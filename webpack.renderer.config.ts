import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import * as path from "path";

rules.push(
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader"]
  },
  {
    test: /\.scss$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: "[local]--[hash:base64:5]"
          }
        }
      },
      {
        loader: "sass-loader",
        options: {
          additionalData: `
            @import "~@/common/common.scss";
        `
        }
      }
    ]
  },
  {
    test: /\.(png|jpge?)$/,
    use: ["file-loader"]
  }
);

export const rendererConfig: Configuration = {
  module: {
    rules
  },
  plugins,
  resolve: {
    alias: {
      "@@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./src/renderer/assets"),
      "@": path.resolve(__dirname, "./src/renderer")
    },
    extensions: [".js", ".ts", ".jsx", ".tsx"]
  }
};
