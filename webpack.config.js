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

const EnhancedObjectLiterals = new HTMLWebpackPlugin({
  template: path.join(__dirname, "/src/enhanced_object_literals/enhanced_object_literals.html"),
  filename: "enhanced_object_literals/enhanced_object_literals.html",
  inject: "body",
  chunks: ["enhanced_object_literals"],
})

const Modules = new HTMLWebpackPlugin({
  template: path.join(__dirname, "/src/modules/modules.html"),
  filename: "modules/modules.html",
  inject: "body",
  chunks: ["modules"],
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
    enhanced_object_literals: path.join(__dirname, "/src/enhanced_object_literals/enhanced_object_literals.js"),
    modules: path.join(__dirname, "/src/modules/modules.js"),
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
  plugins: [Index, Classes, EnhancedObjectLiterals, Modules]
};
