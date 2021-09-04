const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const ElectronReload = require("webpack-electron-reload")({
  path: path.join(__dirname, "./dist/tunnlr.js"),
});

module.exports = [
  {
    mode: "development",
    entry: "./src/main/main.ts",
    target: "electron-main",
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          exclude: /node_modules/,
          use: [{ loader: "ts-loader" }],
        },
      ],
    },
    output: {
      path: __dirname + "/dist",
      filename: "tunnlr.js",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [new ElectronReload()],
  },
  {
    mode: "development",
    entry: "./src/renderer/index.tsx",
    target: "electron-renderer",
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: path.resolve(__dirname, "src/renderer"),
          use: ["react-hot-loader/webpack", "ts-loader"],
        },
        {
          test: /\.scss$/,
          include: path.resolve(__dirname, "src/renderer"),
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\global\.css$/i,
          include: path.resolve(__dirname, "src/renderer"),
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: __dirname + "/dist",
      filename: "view.js",
    },
    plugins: [
      new ElectronReload(),
      new HtmlWebpackPlugin({
        template: "./src/main/index.html",
      }),
    ],
  },
];
