// vite.config.js
import { fileURLToPath, URL } from "node:url";
import glsl from "file:///C:/Users/Jaime/Code/Portfolio/code/node_modules/.pnpm/vite-plugin-glsl@1.5.5_@rol_f30dd17a6b973aed32682d785af52c7b/node_modules/vite-plugin-glsl/src/index.js";
import { defineConfig } from "file:///C:/Users/Jaime/Code/Portfolio/code/node_modules/.pnpm/vite@4.5.14_sass@1.97.3/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/Jaime/Code/Portfolio/code/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@4.5.14_sass@1.97.3__vue@3.5.27/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/Jaime/Code/Portfolio/code/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("Tres") && tag !== "TresCanvas" || tag === "primitive"
        }
      }
    }),
    glsl()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxKYWltZVxcXFxDb2RlXFxcXFBvcnRmb2xpb1xcXFxjb2RlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxKYWltZVxcXFxDb2RlXFxcXFBvcnRmb2xpb1xcXFxjb2RlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9KYWltZS9Db2RlL1BvcnRmb2xpby9jb2RlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCBnbHNsIGZyb20gJ3ZpdGUtcGx1Z2luLWdsc2wnO1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSh7XHJcbiAgICAgIHRlbXBsYXRlOiB7XHJcbiAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XHJcbiAgICAgICAgICBpc0N1c3RvbUVsZW1lbnQ6IHRhZyA9PiB0YWcuc3RhcnRzV2l0aCgnVHJlcycpICYmIHRhZyAhPT0gJ1RyZXNDYW52YXMnIHx8IHRhZyA9PT0gJ3ByaW1pdGl2ZScsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgZ2xzbCgpXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUyxTQUFTLGVBQWUsV0FBVztBQUN2VSxPQUFPLFVBQVU7QUFFakIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBSnVLLElBQU0sMkNBQTJDO0FBT3hPLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFVBQVU7QUFBQSxRQUNSLGlCQUFpQjtBQUFBLFVBQ2YsaUJBQWlCLFNBQU8sSUFBSSxXQUFXLE1BQU0sS0FBSyxRQUFRLGdCQUFnQixRQUFRO0FBQUEsUUFDcEY7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxLQUFLO0FBQUEsRUFBQztBQUFBLEVBQ1IsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
