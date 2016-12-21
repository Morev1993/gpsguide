var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'cheap-module-source-map',
	entry: [
		'babel-polyfill',
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'app.[hash].js',
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
		        	presets: [ "es2015", "react", "stage-0", ]
		      	},
		      	plugins: ['transform-runtime']
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader!postcss-loader'
			},
	      	{
	      		test: /\.scss$/,
	      		loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'sass-loader'])
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
  		new ExtractTextPlugin("app.[hash].css"),
		new webpack.optimize.UglifyJsPlugin({
		    compress: {
		        warnings: false
		    }
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new HtmlWebpackPlugin({
	      template: 'index.html',
	      inject: 'body'
	    })
	]
}
