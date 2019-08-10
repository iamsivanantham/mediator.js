const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const commonConfig = {
  mode: 'production',
  entry: "./src/index.ts",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
};

const commonjs = {
  ...commonConfig,
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "mediator.js",
    library: "Mediator",
    libraryTarget: "commonjs2",
    libraryExport: 'default',
  }
};

const umd = {
  ...commonConfig,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "mediator.min.js",
    library: "Mediator",
    libraryTarget: "umd",
    libraryExport: 'default',
  }
};

module.exports = [commonjs, umd];

