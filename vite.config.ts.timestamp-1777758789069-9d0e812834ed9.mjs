// vite.config.ts
import { jsxLocPlugin } from "file:///C:/Users/Admin/Downloads/aleah-birthday/node_modules/@builder.io/vite-plugin-jsx-loc/dist/index.js";
import tailwindcss from "file:///C:/Users/Admin/Downloads/aleah-birthday/node_modules/@tailwindcss/vite/dist/index.mjs";
import react from "file:///C:/Users/Admin/Downloads/aleah-birthday/node_modules/@vitejs/plugin-react/dist/index.js";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "file:///C:/Users/Admin/Downloads/aleah-birthday/node_modules/vite/dist/node/index.js";
import { vitePluginManusRuntime } from "file:///C:/Users/Admin/Downloads/aleah-birthday/node_modules/vite-plugin-manus-runtime/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Admin\\Downloads\\aleah-birthday";
var PROJECT_ROOT = __vite_injected_original_dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
function vitePluginStorageProxy() {
  return {
    name: "manus-storage-proxy",
    configureServer(server) {
      server.middlewares.use("/manus-storage", async (req, res) => {
        const key = req.url?.replace(/^\//, "");
        if (!key) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Missing storage key");
          return;
        }
        const forgeBaseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
        if (!forgeBaseUrl || !forgeKey) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Storage proxy not configured");
          return;
        }
        try {
          const forgeUrl = new URL("v1/storage/presign/get", forgeBaseUrl + "/");
          forgeUrl.searchParams.set("path", key);
          const forgeResp = await fetch(forgeUrl, {
            headers: { Authorization: `Bearer ${forgeKey}` }
          });
          if (!forgeResp.ok) {
            res.writeHead(502, { "Content-Type": "text/plain" });
            res.end("Storage backend error");
            return;
          }
          const { url } = await forgeResp.json();
          if (!url) {
            res.writeHead(502, { "Content-Type": "text/plain" });
            res.end("Empty signed URL");
            return;
          }
          res.writeHead(307, { Location: url, "Cache-Control": "no-store" });
          res.end();
        } catch {
          res.writeHead(502, { "Content-Type": "text/plain" });
          res.end("Storage proxy error");
        }
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector(), vitePluginStorageProxy()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "client", "src"),
      "@shared": path.resolve(__vite_injected_original_dirname, "shared"),
      "@assets": path.resolve(__vite_injected_original_dirname, "attached_assets")
    }
  },
  envDir: path.resolve(__vite_injected_original_dirname),
  root: path.resolve(__vite_injected_original_dirname, "client"),
  base: "/aleah-birthday/",
  build: {
    outDir: path.resolve(__vite_injected_original_dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    port: 3e3,
    strictPort: false,
    // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBZG1pblxcXFxEb3dubG9hZHNcXFxcYWxlYWgtYmlydGhkYXlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEFkbWluXFxcXERvd25sb2Fkc1xcXFxhbGVhaC1iaXJ0aGRheVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQWRtaW4vRG93bmxvYWRzL2FsZWFoLWJpcnRoZGF5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsganN4TG9jUGx1Z2luIH0gZnJvbSBcIkBidWlsZGVyLmlvL3ZpdGUtcGx1Z2luLWpzeC1sb2NcIjtcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tIFwiQHRhaWx3aW5kY3NzL3ZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBmcyBmcm9tIFwibm9kZTpmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCB0eXBlIFBsdWdpbiwgdHlwZSBWaXRlRGV2U2VydmVyIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IHZpdGVQbHVnaW5NYW51c1J1bnRpbWUgfSBmcm9tIFwidml0ZS1wbHVnaW4tbWFudXMtcnVudGltZVwiO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTWFudXMgRGVidWcgQ29sbGVjdG9yIC0gVml0ZSBQbHVnaW5cbi8vIFdyaXRlcyBicm93c2VyIGxvZ3MgZGlyZWN0bHkgdG8gZmlsZXMsIHRyaW1tZWQgd2hlbiBleGNlZWRpbmcgc2l6ZSBsaW1pdFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgUFJPSkVDVF9ST09UID0gaW1wb3J0Lm1ldGEuZGlybmFtZTtcbmNvbnN0IExPR19ESVIgPSBwYXRoLmpvaW4oUFJPSkVDVF9ST09ULCBcIi5tYW51cy1sb2dzXCIpO1xuY29uc3QgTUFYX0xPR19TSVpFX0JZVEVTID0gMSAqIDEwMjQgKiAxMDI0OyAvLyAxTUIgcGVyIGxvZyBmaWxlXG5jb25zdCBUUklNX1RBUkdFVF9CWVRFUyA9IE1hdGguZmxvb3IoTUFYX0xPR19TSVpFX0JZVEVTICogMC42KTsgLy8gVHJpbSB0byA2MCUgdG8gYXZvaWQgY29uc3RhbnQgcmUtdHJpbW1pbmdcblxudHlwZSBMb2dTb3VyY2UgPSBcImJyb3dzZXJDb25zb2xlXCIgfCBcIm5ldHdvcmtSZXF1ZXN0c1wiIHwgXCJzZXNzaW9uUmVwbGF5XCI7XG5cbmZ1bmN0aW9uIGVuc3VyZUxvZ0RpcigpIHtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKExPR19ESVIpKSB7XG4gICAgZnMubWtkaXJTeW5jKExPR19ESVIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyaW1Mb2dGaWxlKGxvZ1BhdGg6IHN0cmluZywgbWF4U2l6ZTogbnVtYmVyKSB7XG4gIHRyeSB7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGxvZ1BhdGgpIHx8IGZzLnN0YXRTeW5jKGxvZ1BhdGgpLnNpemUgPD0gbWF4U2l6ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmVzID0gZnMucmVhZEZpbGVTeW5jKGxvZ1BhdGgsIFwidXRmLThcIikuc3BsaXQoXCJcXG5cIik7XG4gICAgY29uc3Qga2VwdExpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBrZXB0Qnl0ZXMgPSAwO1xuXG4gICAgLy8gS2VlcCBuZXdlc3QgbGluZXMgKGZyb20gZW5kKSB0aGF0IGZpdCB3aXRoaW4gNjAlIG9mIG1heFNpemVcbiAgICBjb25zdCB0YXJnZXRTaXplID0gVFJJTV9UQVJHRVRfQllURVM7XG4gICAgZm9yIChsZXQgaSA9IGxpbmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBsaW5lQnl0ZXMgPSBCdWZmZXIuYnl0ZUxlbmd0aChgJHtsaW5lc1tpXX1cXG5gLCBcInV0Zi04XCIpO1xuICAgICAgaWYgKGtlcHRCeXRlcyArIGxpbmVCeXRlcyA+IHRhcmdldFNpemUpIGJyZWFrO1xuICAgICAga2VwdExpbmVzLnVuc2hpZnQobGluZXNbaV0pO1xuICAgICAga2VwdEJ5dGVzICs9IGxpbmVCeXRlcztcbiAgICB9XG5cbiAgICBmcy53cml0ZUZpbGVTeW5jKGxvZ1BhdGgsIGtlcHRMaW5lcy5qb2luKFwiXFxuXCIpLCBcInV0Zi04XCIpO1xuICB9IGNhdGNoIHtcbiAgICAvKiBpZ25vcmUgdHJpbSBlcnJvcnMgKi9cbiAgfVxufVxuXG5mdW5jdGlvbiB3cml0ZVRvTG9nRmlsZShzb3VyY2U6IExvZ1NvdXJjZSwgZW50cmllczogdW5rbm93bltdKSB7XG4gIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gIGVuc3VyZUxvZ0RpcigpO1xuICBjb25zdCBsb2dQYXRoID0gcGF0aC5qb2luKExPR19ESVIsIGAke3NvdXJjZX0ubG9nYCk7XG5cbiAgLy8gRm9ybWF0IGVudHJpZXMgd2l0aCB0aW1lc3RhbXBzXG4gIGNvbnN0IGxpbmVzID0gZW50cmllcy5tYXAoKGVudHJ5KSA9PiB7XG4gICAgY29uc3QgdHMgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgcmV0dXJuIGBbJHt0c31dICR7SlNPTi5zdHJpbmdpZnkoZW50cnkpfWA7XG4gIH0pO1xuXG4gIC8vIEFwcGVuZCB0byBsb2cgZmlsZVxuICBmcy5hcHBlbmRGaWxlU3luYyhsb2dQYXRoLCBgJHtsaW5lcy5qb2luKFwiXFxuXCIpfVxcbmAsIFwidXRmLThcIik7XG5cbiAgLy8gVHJpbSBpZiBleGNlZWRzIG1heCBzaXplXG4gIHRyaW1Mb2dGaWxlKGxvZ1BhdGgsIE1BWF9MT0dfU0laRV9CWVRFUyk7XG59XG5cbi8qKlxuICogVml0ZSBwbHVnaW4gdG8gY29sbGVjdCBicm93c2VyIGRlYnVnIGxvZ3NcbiAqIC0gUE9TVCAvX19tYW51c19fL2xvZ3M6IEJyb3dzZXIgc2VuZHMgbG9ncywgd3JpdHRlbiBkaXJlY3RseSB0byBmaWxlc1xuICogLSBGaWxlczogYnJvd3NlckNvbnNvbGUubG9nLCBuZXR3b3JrUmVxdWVzdHMubG9nLCBzZXNzaW9uUmVwbGF5LmxvZ1xuICogLSBBdXRvLXRyaW1tZWQgd2hlbiBleGNlZWRpbmcgMU1CIChrZWVwcyBuZXdlc3QgZW50cmllcylcbiAqL1xuZnVuY3Rpb24gdml0ZVBsdWdpbk1hbnVzRGVidWdDb2xsZWN0b3IoKTogUGx1Z2luIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcIm1hbnVzLWRlYnVnLWNvbGxlY3RvclwiLFxuXG4gICAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWwpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBodG1sLFxuICAgICAgICB0YWdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGFnOiBcInNjcmlwdFwiLFxuICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgc3JjOiBcIi9fX21hbnVzX18vZGVidWctY29sbGVjdG9yLmpzXCIsXG4gICAgICAgICAgICAgIGRlZmVyOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluamVjdFRvOiBcImhlYWRcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcjogVml0ZURldlNlcnZlcikge1xuICAgICAgLy8gUE9TVCAvX19tYW51c19fL2xvZ3M6IEJyb3dzZXIgc2VuZHMgbG9ncyAod3JpdHRlbiBkaXJlY3RseSB0byBmaWxlcylcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoXCIvX19tYW51c19fL2xvZ3NcIiwgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIGlmIChyZXEubWV0aG9kICE9PSBcIlBPU1RcIikge1xuICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYW5kbGVQYXlsb2FkID0gKHBheWxvYWQ6IGFueSkgPT4ge1xuICAgICAgICAgIC8vIFdyaXRlIGxvZ3MgZGlyZWN0bHkgdG8gZmlsZXNcbiAgICAgICAgICBpZiAocGF5bG9hZC5jb25zb2xlTG9ncz8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgd3JpdGVUb0xvZ0ZpbGUoXCJicm93c2VyQ29uc29sZVwiLCBwYXlsb2FkLmNvbnNvbGVMb2dzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBheWxvYWQubmV0d29ya1JlcXVlc3RzPy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB3cml0ZVRvTG9nRmlsZShcIm5ldHdvcmtSZXF1ZXN0c1wiLCBwYXlsb2FkLm5ldHdvcmtSZXF1ZXN0cyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwYXlsb2FkLnNlc3Npb25FdmVudHM/Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHdyaXRlVG9Mb2dGaWxlKFwic2Vzc2lvblJlcGxheVwiLCBwYXlsb2FkLnNlc3Npb25FdmVudHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0pO1xuICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBzdWNjZXNzOiB0cnVlIH0pKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByZXFCb2R5ID0gKHJlcSBhcyB7IGJvZHk/OiB1bmtub3duIH0pLmJvZHk7XG4gICAgICAgIGlmIChyZXFCb2R5ICYmIHR5cGVvZiByZXFCb2R5ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGhhbmRsZVBheWxvYWQocmVxQm9keSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg0MDAsIHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSk7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBTdHJpbmcoZSkgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYm9keSA9IFwiXCI7XG4gICAgICAgIHJlcS5vbihcImRhdGFcIiwgKGNodW5rKSA9PiB7XG4gICAgICAgICAgYm9keSArPSBjaHVuay50b1N0cmluZygpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXEub24oXCJlbmRcIiwgKCkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICAgIGhhbmRsZVBheWxvYWQocGF5bG9hZCk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg0MDAsIHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSk7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBTdHJpbmcoZSkgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiB2aXRlUGx1Z2luU3RvcmFnZVByb3h5KCk6IFBsdWdpbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJtYW51cy1zdG9yYWdlLXByb3h5XCIsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcjogVml0ZURldlNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShcIi9tYW51cy1zdG9yYWdlXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSByZXEudXJsPy5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgcmVzLndyaXRlSGVhZCg0MDAsIHsgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L3BsYWluXCIgfSk7XG4gICAgICAgICAgcmVzLmVuZChcIk1pc3Npbmcgc3RvcmFnZSBrZXlcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZm9yZ2VCYXNlVXJsID0gKHByb2Nlc3MuZW52LkJVSUxUX0lOX0ZPUkdFX0FQSV9VUkwgfHwgXCJcIikucmVwbGFjZSgvXFwvKyQvLCBcIlwiKTtcbiAgICAgICAgY29uc3QgZm9yZ2VLZXkgPSBwcm9jZXNzLmVudi5CVUlMVF9JTl9GT1JHRV9BUElfS0VZO1xuXG4gICAgICAgIGlmICghZm9yZ2VCYXNlVXJsIHx8ICFmb3JnZUtleSkge1xuICAgICAgICAgIHJlcy53cml0ZUhlYWQoNTAwLCB7IFwiQ29udGVudC1UeXBlXCI6IFwidGV4dC9wbGFpblwiIH0pO1xuICAgICAgICAgIHJlcy5lbmQoXCJTdG9yYWdlIHByb3h5IG5vdCBjb25maWd1cmVkXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgZm9yZ2VVcmwgPSBuZXcgVVJMKFwidjEvc3RvcmFnZS9wcmVzaWduL2dldFwiLCBmb3JnZUJhc2VVcmwgKyBcIi9cIik7XG4gICAgICAgICAgZm9yZ2VVcmwuc2VhcmNoUGFyYW1zLnNldChcInBhdGhcIiwga2V5KTtcblxuICAgICAgICAgIGNvbnN0IGZvcmdlUmVzcCA9IGF3YWl0IGZldGNoKGZvcmdlVXJsLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtmb3JnZUtleX1gIH0sXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoIWZvcmdlUmVzcC5vaykge1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDIsIHsgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L3BsYWluXCIgfSk7XG4gICAgICAgICAgICByZXMuZW5kKFwiU3RvcmFnZSBiYWNrZW5kIGVycm9yXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHsgdXJsIH0gPSAoYXdhaXQgZm9yZ2VSZXNwLmpzb24oKSkgYXMgeyB1cmw6IHN0cmluZyB9O1xuICAgICAgICAgIGlmICghdXJsKSB7XG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMiwgeyBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQvcGxhaW5cIiB9KTtcbiAgICAgICAgICAgIHJlcy5lbmQoXCJFbXB0eSBzaWduZWQgVVJMXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlcy53cml0ZUhlYWQoMzA3LCB7IExvY2F0aW9uOiB1cmwsIFwiQ2FjaGUtQ29udHJvbFwiOiBcIm5vLXN0b3JlXCIgfSk7XG4gICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMiwgeyBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQvcGxhaW5cIiB9KTtcbiAgICAgICAgICByZXMuZW5kKFwiU3RvcmFnZSBwcm94eSBlcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcbn1cblxuY29uc3QgcGx1Z2lucyA9IFtyZWFjdCgpLCB0YWlsd2luZGNzcygpLCBqc3hMb2NQbHVnaW4oKSwgdml0ZVBsdWdpbk1hbnVzUnVudGltZSgpLCB2aXRlUGx1Z2luTWFudXNEZWJ1Z0NvbGxlY3RvcigpLCB2aXRlUGx1Z2luU3RvcmFnZVByb3h5KCldO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoaW1wb3J0Lm1ldGEuZGlybmFtZSwgXCJjbGllbnRcIiwgXCJzcmNcIiksXG4gICAgICBcIkBzaGFyZWRcIjogcGF0aC5yZXNvbHZlKGltcG9ydC5tZXRhLmRpcm5hbWUsIFwic2hhcmVkXCIpLFxuICAgICAgXCJAYXNzZXRzXCI6IHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lLCBcImF0dGFjaGVkX2Fzc2V0c1wiKSxcbiAgICB9LFxuICB9LFxuICBlbnZEaXI6IHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lKSxcbiAgcm9vdDogcGF0aC5yZXNvbHZlKGltcG9ydC5tZXRhLmRpcm5hbWUsIFwiY2xpZW50XCIpLFxuICBiYXNlOiBcIi9hbGVhaC1iaXJ0aGRheS9cIixcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6IHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lLCBcImRpc3QvcHVibGljXCIpLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIHN0cmljdFBvcnQ6IGZhbHNlLCAvLyBXaWxsIGZpbmQgbmV4dCBhdmFpbGFibGUgcG9ydCBpZiAzMDAwIGlzIGJ1c3lcbiAgICBob3N0OiB0cnVlLFxuICAgIGFsbG93ZWRIb3N0czogW1xuICAgICAgXCIubWFudXNwcmUuY29tcHV0ZXJcIixcbiAgICAgIFwiLm1hbnVzLmNvbXB1dGVyXCIsXG4gICAgICBcIi5tYW51cy1hc2lhLmNvbXB1dGVyXCIsXG4gICAgICBcIi5tYW51c2NvbXB1dGVyLmFpXCIsXG4gICAgICBcIi5tYW51c3ZtLmNvbXB1dGVyXCIsXG4gICAgICBcImxvY2FsaG9zdFwiLFxuICAgICAgXCIxMjcuMC4wLjFcIixcbiAgICBdLFxuICAgIGZzOiB7XG4gICAgICBzdHJpY3Q6IHRydWUsXG4gICAgICBkZW55OiBbXCIqKi8uKlwiXSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlULFNBQVMsb0JBQW9CO0FBQzlVLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sV0FBVztBQUNsQixPQUFPLFFBQVE7QUFDZixPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBcUQ7QUFDOUQsU0FBUyw4QkFBOEI7QUFOdkMsSUFBTSxtQ0FBbUM7QUFhekMsSUFBTSxlQUFlO0FBQ3JCLElBQU0sVUFBVSxLQUFLLEtBQUssY0FBYyxhQUFhO0FBQ3JELElBQU0scUJBQXFCLElBQUksT0FBTztBQUN0QyxJQUFNLG9CQUFvQixLQUFLLE1BQU0scUJBQXFCLEdBQUc7QUFJN0QsU0FBUyxlQUFlO0FBQ3RCLE1BQUksQ0FBQyxHQUFHLFdBQVcsT0FBTyxHQUFHO0FBQzNCLE9BQUcsVUFBVSxTQUFTLEVBQUUsV0FBVyxLQUFLLENBQUM7QUFBQSxFQUMzQztBQUNGO0FBRUEsU0FBUyxZQUFZLFNBQWlCLFNBQWlCO0FBQ3JELE1BQUk7QUFDRixRQUFJLENBQUMsR0FBRyxXQUFXLE9BQU8sS0FBSyxHQUFHLFNBQVMsT0FBTyxFQUFFLFFBQVEsU0FBUztBQUNuRTtBQUFBLElBQ0Y7QUFFQSxVQUFNLFFBQVEsR0FBRyxhQUFhLFNBQVMsT0FBTyxFQUFFLE1BQU0sSUFBSTtBQUMxRCxVQUFNLFlBQXNCLENBQUM7QUFDN0IsUUFBSSxZQUFZO0FBR2hCLFVBQU0sYUFBYTtBQUNuQixhQUFTLElBQUksTUFBTSxTQUFTLEdBQUcsS0FBSyxHQUFHLEtBQUs7QUFD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
