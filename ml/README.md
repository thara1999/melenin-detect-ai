# ML Pipeline — Skin Cancer Detection

Real AI skin cancer detection trained on the **SCIN** and **DDI** datasets, both
designed for diverse skin tone representation.

## Datasets

### SCIN (Skin Condition Image Network)
- **Source**: Google Research + Stanford Medicine
- **URL**: https://github.com/google-research-datasets/scin
- **Size**: 10,000+ crowdsourced images
- **Labels**: 1-3 dermatologist labels per case with confidence scores
- **Skin tones**: Fitzpatrick I-VI + Monk Skin Tone labels
- **Format**: `scin_cases.csv` + `scin_labels.csv` + images in Google Cloud Storage

### DDI (Diverse Dermatology Images)
- **Source**: Stanford University School of Medicine
- **URL**: https://ddi-dataset.github.io
- **Size**: 656 biopsy-proven images (DDI-1), expanded in DDI-2
- **Labels**: Pathology-confirmed benign vs malignant
- **Skin tones**: FST I-VI, matched for fair vs dark comparison
- **Format**: `ddi.csv` + image files
- **Note**: Requires registration and acceptance of Research Use Agreement

## Pipeline Overview

```
Download datasets → Parse CSVs → Merge into manifest → Train model → Export ONNX → Server inference
```

## Step-by-Step Instructions

### 1. Download Datasets

#### SCIN
```bash
# Clone the SCIN repo (contains CSVs + download instructions)
git clone https://github.com/google-research-datasets/scin.git /tmp/scin

# Copy CSVs to the expected location
mkdir -p ml/datasets/scin/images
cp /tmp/scin/scin_cases.csv ml/datasets/scin/
cp /tmp/scin/scin_labels.csv ml/datasets/scin/

# Download images from Google Cloud Storage (see SCIN repo for details)
# The SCIN repo provides a download script or gsutil commands
gsutil -m cp -r gs://scin-2023-resized/ ml/datasets/scin/images/
```

#### DDI
```bash
# Register at https://ddi-dataset.github.io and download the dataset
# Copy the CSV and images to:
mkdir -p ml/datasets/ddi/images
# Place ddi.csv in ml/datasets/ddi/
# Place image files in ml/datasets/ddi/images/
```

### 2. Merge Datasets into Training Manifest

```bash
npx tsx ml/datasets/merge.ts \
  --scin-cases ml/datasets/scin/scin_cases.csv \
  --scin-labels ml/datasets/scin/scin_labels.csv \
  --scin-images ml/datasets/scin/images \
  --ddi-csv ml/datasets/ddi/ddi.csv \
  --ddi-images ml/datasets/ddi/images \
  --output ml/training/training_manifest.json
```

This produces `ml/training/training_manifest.json` with unified entries:
```json
{
  "imagePath": "ml/datasets/ddi/images/abc.jpg",
  "conditionName": "Melanoma",
  "isCancer": true,
  "cancerRiskScore": 88,
  "cancerType": "Melanoma",
  "severity": "high",
  "urgency": "urgent",
  "skinTone": "Deep (Fitzpatrick V-VI)",
  "dataset": "DDI",
  "confidence": 100,
  "split": "train"
}
```

### 3. Install Python Dependencies

```bash
pip install tensorflow tf2onnx onnx
# For image preprocessing on the server:
pip install sharp  # or: npm install sharp
```

### 4. Train the Model

```bash
npx tsx ml/training/train.ts \
  --manifest ml/training/training_manifest.json \
  --output-dir ml/models \
  --epochs 30 \
  --batch-size 32 \
  --img-size 224
```

This generates `ml/models/train_python.py`. Run it with Python:

```bash
python ml/models/train_python.py
```

The training script:
- Fine-tunes **MobileNetV2** (pre-trained on ImageNet) for skin cancer detection
- Trains two models:
  1. **Binary cancer classifier** (cancer vs non-cancer) — primary output
  2. **Multi-class condition classifier** (specific conditions) — secondary
- Uses two-phase training: train head first, then fine-tune top layers
- Applies data augmentation (flip, brightness, contrast, saturation, hue)
- Uses early stopping and learning rate scheduling

### 5. Export to ONNX

```bash
npx tsx ml/training/export_onnx.ts --model-dir ml/models --output-dir ml/models
```

This generates `ml/models/convert_onnx.py`. Run it:

```bash
python ml/models/convert_onnx.py
```

Output files:
- `ml/models/cancer_binary.onnx` — binary cancer classifier
- `ml/models/condition_multiclass.onnx` — multi-class condition classifier
- `ml/models/class_indices.json` — class name → index mapping

### 6. Install Server Dependencies

```bash
npm install onnxruntime-node
# Optional but recommended for real image preprocessing:
npm install sharp
```

### 7. Restart the Server

The server auto-detects the ONNX model at startup. Check the health endpoint:

```bash
curl http://localhost:3001/api/health
# {"status":"ok","inferenceMode":"onnx","modelLoaded":true}
```

If `inferenceMode` is `"simulation"`, the model wasn't found or failed to load.

## Architecture

```
ml/
├── config/
│   └── conditions.ts          # Condition mapping table (SCIN/DDI → app vocabulary)
├── datasets/
│   ├── parsers/
│   │   ├── scin.ts             # SCIN CSV parser
│   │   └── ddi.ts              # DDI CSV parser
│   └── merge.ts                # Dataset merger → training manifest
├── training/
│   ├── train.ts                # Training script (generates Python Keras script)
│   └── export_onnx.ts          # ONNX export script
├── inference/
│   └── predict.ts              # Server-side inference (ONNX + simulation fallback)
└── models/                     # Trained models go here (gitignored)
    ├── cancer_binary.onnx
    ├── condition_multiclass.onnx
    └── class_indices.json
```

## How It Works

### Inference Flow
1. User uploads an image on the Scan page
2. Frontend POSTs to `/api/predict` (server-side inference)
3. Server loads the ONNX model, preprocesses the image (resize to 224x224, normalize)
4. Runs inference through the binary cancer model → cancer probability
5. If multi-class model is available, also runs it for specific condition
6. Returns: `isCancer`, `cancerRiskScore`, `cancerRiskLevel`, `conditionName`, `urgency`
7. Frontend saves the result via `/api/scans` and displays the Results page

### Fallback
If no ONNX model is present, the server falls back to a deterministic simulation
engine that produces consistent, realistic-looking results. This allows the app
to function during development before a real model is trained.

### Condition Mapping
The `ml/config/conditions.ts` file is the single source of truth that maps
condition names from both datasets to the app's unified vocabulary. Each
condition entry specifies:
- `isCancer` — whether it's cancer
- `cancerRiskScore` — 0-100 risk score
- `cancerType` — cancer type if cancerous
- `severity` — low / moderate / high
- `urgency` — routine / see_doctor / urgent
- `cancerDescription` — user-facing description
- `aliases` — all known names from source datasets

## Cancer Detection Output

The results page prominently shows:
- **"CANCER DETECTED"** or **"NO CANCER DETECTED"** — large verdict banner
- **Cancer risk level**: No Risk / Low / Moderate / High (with color-coded bar)
- **Cancer risk score**: 0-100 numeric score
- **Cancer type**: e.g., Melanoma, BCC, SCC (if cancerous)
- **Urgency badge**: Routine / See Doctor / URGENT
- **Cancer description**: Plain-language explanation
- **Recommendations**: Actionable next steps

## Files in This Pipeline

| File | Purpose |
|------|---------|
| `ml/config/conditions.ts` | Condition mapping table with cancer metadata |
| `ml/datasets/parsers/scin.ts` | SCIN dataset parser (cases + labels CSV) |
| `ml/datasets/parsers/ddi.ts` | DDI dataset parser (pathology-confirmed labels) |
| `ml/datasets/merge.ts` | Unifies both datasets into training manifest |
| `ml/training/train.ts` | Generates Keras training script for MobileNetV2 fine-tuning |
| `ml/training/export_onnx.ts` | Converts trained models to ONNX format |
| `ml/inference/predict.ts` | Server inference module (ONNX + simulation fallback) |
| `server/index.ts` | Express server with `/api/predict` endpoint |
| `server/controllers/scanController.ts` | Scan CRUD controller |
| `server/models/SkinScan.ts` | Mongoose model with cancer fields |
| `src/pages/ResultsPage.tsx` | Results UI with cancer verdict display |
| `src/pages/ScanPage.tsx` | Scan page with server inference integration |
| `src/lib/api.ts` | Frontend API client |
| `src/types/index.ts` | TypeScript types with cancer fields |
