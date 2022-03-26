const path = require("path");
const NodemonPlugin = require("nodemon-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new NodemonPlugin()],
  externals: [nodeExternals()],
};
