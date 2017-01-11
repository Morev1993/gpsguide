var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		'babel-polyfill',
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'src'),
		filename: 'app.js',
		publicPath: ''
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				loaders: ['eslint'],
				include: [
					path.resolve(__dirname, "src"),
				],
			}
		],
		loaders: [
			{
				test: /\.js$/,
				loader: "babel",
				include: [
					path.resolve(__dirname, "src"),
				],
				exclude: /node_modules/,
				query: {
		        	presets: [ "es2015", "stage-0", "react", "react-hmre"],
					plugins: ["transform-decorators-legacy"]
		      	},
		      	plugins: ['transform-runtime']
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader!postcss-loader'
			},
			{
		        test: /\.scss$/,
		        loaders: ['style', 'css', 'postcss', 'sass']
	      	}
		]
	},
	postcss: function() {
		return [autoprefixer, precss]
	},
	sassLoader: {
    	includePaths: [path.resolve(__dirname, "./src")]
  	},
  	plugins: [
		new HtmlWebpackPlugin({
		  	filename: 'index.html',
  		  	template: path.join(__dirname, './src/index.html'),
	      	inject: 'body'
	    })
	]
}
