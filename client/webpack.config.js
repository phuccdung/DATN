const path = require("path");
const HtmlWebpackPlugin=require("html-webpack-plugin");
module.exports = {
  entry: "./src/index.js", // Dẫn tới file index.js ta đã tạo
  output: {
    path: path.join(__dirname, "/build"),
    publicPath: '/',
    filename: 'bundle.js',
},
devServer: {
  historyApiFallback: true,
  contentBase: './',
  hot: true
},
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,// Sẽ sử dụng babel-loader cho những file .js
        exclude: /node_modules/, // Loại trừ thư mục node_modules
        use: ["babel-loader"]
      },
      {
        test: /\.css$/, // Sử dụng style-loader, css-loader cho file .css
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ]
  },
  // Chứa các plugins sẽ cài đặt trong tương lai
  plugins: [
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,'public/index.html'),
      filename:'index.html'
    })
  ]
};