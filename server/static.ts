import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { getSEOPage, generateSEOHtml } from "./seoPages";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res) => {
    const pathname = req.originalUrl.split('?')[0];
    const indexPath = path.resolve(distPath, "index.html");
    
    // Check if this is an SEO page
    const seoPage = getSEOPage(pathname);
    if (seoPage) {
      // Read base HTML and inject SEO content
      const baseHtml = fs.readFileSync(indexPath, "utf-8");
      const seoHtml = generateSEOHtml(seoPage, baseHtml);
      res.status(200).set({ "Content-Type": "text/html" }).send(seoHtml);
    } else {
      res.sendFile(indexPath);
    }
  });
}
