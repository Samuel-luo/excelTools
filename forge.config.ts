import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    appVersion: "1.0.0",
    name: "excelTools",
    appCopyright: "Samuel-luo(1319433916@qq.com)",
    icon: "./excelTools.ico",
    win32metadata: {
      ProductName: "excelTools",
      CompanyName: "Samuel-luo Personal",
      FileDescription: "一个 excel 工具软件"
    }
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),   // 不支持中文路径
    new MakerZIP({}),
    new MakerRpm({}),
    new MakerDeb({})
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/renderer/index.html",
            js: "./src/renderer/index.tsx",
            name: "excel_tools",
            preload: {
              js: "./src/main/preload.ts"
            }
          }
        ]
      }
    })
  ]
};

export default config;
