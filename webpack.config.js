const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development", // Use 'production' for production builds
  target: "web",
  devtool: "source-map",
  entry: {
    //popup: "./src/popup/index.tsx",
    background: "./src/scripts/background/background.ts",
    "content-on-start": "./src/scripts/content/content-on-start.ts",
    "content-on-end": "./src/scripts/content/content-on-end.ts",
    "content-on-end": "./src/scripts/content/content-on-end.ts",
    "popup": "./src/scripts/popup/mount-components.tsx",
    styles: "./src/styles/tailwind.css",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
    libraryTarget: "umd", // Universal Module Definition
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
    new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public", "manifest.json"), // Source directory
            to: path.resolve(__dirname, "dist"), // Destination directory
          },
          {
            from: path.resolve(__dirname, "public", "assets", "images"), // Source directory
            to: path.resolve(__dirname, "dist"), // Destination directory
          },
          {
            from: path.resolve(__dirname, "public", "popup.html"), // Source directory
            to: path.resolve(__dirname, "dist"), // Destination directory
          },
        ],
      }),
  ],
};
