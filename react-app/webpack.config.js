const path = require("path");

const Source_dir = path.join(__dirname, "src/components");
const Output_dir = path.join(__dirname, "public/bundle");

module.exports = {
  mode: "development",
  entry: path.join(Source_dir, "index.jsx"),
  output: {
    path: Output_dir,
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};
