import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";

import { createServer } from "./server/index";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 10000;

// React production build folder
const distDir = join(__dirname, "dist");

async function main() {
  try {
    // Create Express app (includes all API routes)
    const app = await createServer();

    // Serve React static files
    app.use(
      sirv(distDir, {
        dev: false,
        etag: true,
        maxAge: 31536000,
      })
    );

    // React Router support
    app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  res.sendFile(join(distDir, "index.html"));
});

    app.listen(PORT, "0.0.0.0", () => {
      console.log("=================================");
      console.log("🚀 MelaninDetect AI");
      console.log(`🌍 Running on port ${PORT}`);
      console.log(`📁 Serving React from ${distDir}`);
      console.log("=================================");
    });
  } catch (err) {
    console.error("Failed to start server");
    console.error(err);
    process.exit(1);
  }
}

main();