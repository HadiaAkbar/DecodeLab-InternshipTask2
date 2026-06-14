import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public
  const staticPath = path.resolve(__dirname, "public");
  
  // Fallback to dist/public if public doesn't exist (for development)
  const fs = await import('fs');
  const finalStaticPath = fs.existsSync(staticPath) ? staticPath : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(finalStaticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(finalStaticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`Serving static files from: ${finalStaticPath}`);
  });
}

startServer().catch(console.error);
