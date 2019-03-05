const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, "/src/index.html"),
  filename: "index.html",
  inject: "body"
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
  entry: [path.join(__dirname, "/src/index.js")],
  output: {
    path: path.join(__dirname, "/build"),
    filename: 'index.js'
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
  plugins: [HTMLWebpackPluginConfig]
};