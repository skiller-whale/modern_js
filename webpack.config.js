const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")

const Index = new HTMLWebpackPlugin({
  template: path.join(__dirname, "/src/index.html"),
  filename: "index.html",
  inject: "body",
  chunks: ["main"],
})

const Classes = new HTMLWebpackPlugin({
  template: path.join(__dirname, "/src/classes/classes.html"),
  filename: "classes/classes.html",
  inject: "body",
  chunks: ["classes"],
})

module.exports = {
  devServer: {
    host: "0.0.0.0",
    port: "3000",
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    historyApiFallback: true
  },  
  entry: {
    main: path.join(__dirname, "/src/index.js"),
    classes: path.join(__dirname, "/src/classes/classes.js"),
  },
  output: {
    path: path.join(__dirname, "/build"),
    filename: '[name].js'
  },  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [Index, Classes]
};
