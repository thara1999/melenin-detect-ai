/**
 * Server-side Inference Module
 *
 * EfficientNet DDI Skin Disease Classification
 *
 * Loads:
 *   ml/models/model.onnx
 *   ml/models/labels.json
 *
 * Flow:
 *
 * Image
 *   ↓
 * Sharp preprocessing
 *   ↓
 * EfficientNet ONNX
 *   ↓
 * Disease class prediction
 *   ↓
 * Condition metadata
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  lookupCondition,
  riskLevelFromScore
} from "../../ml/config/conditions";


export interface InferenceResult {

  conditionName:string;

  confidence:number;

  severity:
  | "low"
  | "moderate"
  | "high"
  | "none";


  description:string;

  recommendations:string[];


  alternativeConditions:{
    name:string;
    confidence:number;
    isCancer:boolean;
  }[];


  skinTone:string;


  processingTimeMs:number;


  isCancer:boolean;


  cancerRiskLevel:
  | "no_risk"
  | "low_risk"
  | "moderate_risk"
  | "high_risk";


  cancerRiskScore:number;


  cancerType:string|null;


  cancerDescription:string;


  urgency:
  | "routine"
  | "see_doctor"
  | "urgent";


  modelUsed:string;

}



// ===============================
// ONNX MODEL
// ===============================


let ortSession:any = null;

let ortModelLoaded=false;

let ortLoadAttempted=false;



const MODEL_PATH =
join(
 process.cwd(),
 "ml/models/model.onnx"
);



const LABEL_PATH =
join(
 process.cwd(),
 "ml/models/labels.json"
);



let labels:string[]=[];



async function tryLoadOnnx(){

if(ortLoadAttempted)
return;


ortLoadAttempted=true;



if(!existsSync(MODEL_PATH)){


 console.log(
 "[inference] model.onnx not found"
 );


 return;

}



try{


const ort =
await import("onnxruntime-node");



ortSession =
await ort.InferenceSession.create(
 MODEL_PATH
);



ortModelLoaded=true;



console.log(
"✅ EfficientNet ONNX model loaded"
);



console.log(
"Input:",
ortSession.inputNames
);



console.log(
"Output:",
ortSession.outputNames
);



// Load labels

if(
 existsSync(LABEL_PATH)
){


labels =
JSON.parse(
 readFileSync(
 LABEL_PATH,
 "utf-8"
 )
);



console.log(
"✅ Labels loaded:",
labels.length
);


}



}

catch(error:any){


console.log(
"[inference] ONNX loading failed",
error.message
);


}



}
/**
 * ===============================
 * IMAGE PREPROCESSING
 * ===============================
 */


async function preprocessImage(
  imageData:string
):Promise<Float32Array>{


const sharp =
await import("sharp");


// remove base64 prefix

const base64 =
imageData.replace(
 /^data:image\/\w+;base64,/,
 ""
);



const buffer =
Buffer.from(
 base64,
 "base64"
);



const SIZE=224;



const {data}=
await sharp.default(buffer)
.resize(
 SIZE,
 SIZE,
 {
  fit:"fill"
 }
)
.removeAlpha()
.raw()
.toBuffer({
 resolveWithObject:true
});



/*
 EfficientNet training normalization

 If your training used:
 rescale=1/255

 change this to:
 data[i] / 255

 Current:
 MobileNet style normalization
*/

const tensor =
new Float32Array(
 SIZE * SIZE * 3
);



for(
 let i=0;
 i<data.length;
 i++
){

tensor[i] =
data[i] / 255;


}



return tensor;


}





/**
 * ===============================
 * EFFICIENTNET ONNX INFERENCE
 * ===============================
 */


async function runOnnxInference(
 imageData:string
):Promise<InferenceResult|null>{



if(
 !ortSession ||
 !ortModelLoaded
)
return null;



const start =
Date.now();




const tensor =
await preprocessImage(
 imageData
);



const ort =
await import(
 "onnxruntime-node"
);



const inputName =
ortSession.inputNames[0];


const inputTensor =
new ort.Tensor(
 "float32",
 tensor,
 [
 1,
 224,
 224,
 3
 ]
);



const outputs =
await ortSession.run({

   [inputName]:
        inputTensor

});



const outputName =
ortSession.outputNames[0];



const probabilities = outputs[outputName].data as Float32Array;



/*
 Find highest prediction
*/


let maxIndex=0;



for(
 let i=1;
 i<probabilities.length;
 i++
){

if(
 probabilities[i] >
 probabilities[maxIndex]
){

maxIndex=i;

}

}



const predictedLabel =
labels[maxIndex] ||
"Unknown";



const confidence =
Math.round(
 probabilities[maxIndex] * 100
);



/*
 Top 3 predictions
*/


const ranked =
Array.from(
 probabilities
)
.map(
(prob,index)=>({

prob,
index

})
)
.sort(
(a,b)=>
b.prob-a.prob
)
.slice(0,3);



const alternatives =
ranked
.slice(1)
.map(item=>{


const name =
labels[item.index] ||
"Unknown";


const condition =
lookupCondition(
 name
);



return {


name:
condition.canonical,


confidence:
Math.round(
 item.prob * 100
),


isCancer:
condition.isCancer


};


});




const condition =
lookupCondition(
 predictedLabel
);



const cancerScore =
condition.cancerRiskScore;
// ======================================
// Debug Logs
// ======================================

console.log("\n========== AI Prediction ==========");

console.log("Disease      :", predictedLabel);

console.log("Confidence   :", confidence + "%");

console.log("Processing   :", Date.now() - start + " ms");

console.log("Cancer       :", condition.isCancer);

console.log("Risk Level   :", riskLevelFromScore(cancerScore));

console.log("Model        :", "EfficientNet-DDI-ONNX");

console.log("\nTop 3 Predictions:");

ranked.forEach((item, index) => {
    console.log(
        `${index + 1}. ${labels[item.index]} - ${(item.prob * 100).toFixed(2)}%`
    );
});

console.log("===================================\n");


return {


conditionName:
condition.canonical,


confidence,


severity:
condition.severity,


description:
getConditionDescription(
 condition
),


recommendations:
getRecommendations(
 condition
),


alternativeConditions:
alternatives,


skinTone:
"DDI analysis",


processingTimeMs:
Date.now()-start,


isCancer:
condition.isCancer,


cancerRiskLevel:
riskLevelFromScore(
 cancerScore
),


cancerRiskScore:
cancerScore,


cancerType:
condition.cancerType,


cancerDescription:
condition.cancerDescription,


urgency:
condition.urgency,


modelUsed:
"EfficientNet-DDI-ONNX"



};



}
/**
 * ===============================
 * SIMULATION FALLBACK
 * ===============================
 */

function hashString(str:string){

let hash=0;


for(
let i=0;
i<str.length;
i++
){

hash =
((hash<<5)-hash)
+
str.charCodeAt(i);


hash |=0;

}


return Math.abs(hash);

}



function runSimulation(
imageData:string
):InferenceResult{


const start =
Date.now();



const conditions=[

"Melanoma",

"Basal Cell Carcinoma",

"Squamous Cell Carcinoma",

"Benign Nevus",

"Eczema",

"Psoriasis",

"Melasma",

"Vitiligo",

"Tinea Versicolor",

"Keloid Scarring"

];



const index =
hashString(
 imageData
)
%
conditions.length;



const condition =
lookupCondition(
 conditions[index]
);



return {


conditionName:
condition.canonical,


confidence:
80,


severity:
condition.severity,


description:
getConditionDescription(
condition
),


recommendations:
getRecommendations(
condition
),


alternativeConditions:[],


skinTone:
"Simulation",


processingTimeMs:
Date.now()-start,


isCancer:
condition.isCancer,


cancerRiskLevel:
riskLevelFromScore(
condition.cancerRiskScore
),


cancerRiskScore:
condition.cancerRiskScore,


cancerType:
condition.cancerType,


cancerDescription:
condition.cancerDescription,


urgency:
condition.urgency,


modelUsed:
"simulation"


};


}



/**
 * ===============================
 * PUBLIC API
 * ===============================
 */


export async function runInference(
imageData:string
):Promise<InferenceResult>{



await tryLoadOnnx();



if(
ortModelLoaded
){

const result =
await runOnnxInference(
 imageData
);


if(result)
return result;

}



console.log(
"[inference] Using simulation fallback"
);



return runSimulation(
imageData
);



}




export function isModelLoaded(){

return ortModelLoaded;

}



export function getInferenceMode(){

return ortModelLoaded
?
"onnx"
:
"simulation";

}