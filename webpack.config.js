const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: {
        main: "./static/js/index.js"
    },
    output: {
        filename: "[name].[contentHash].bundle.js",  // File name with hash, based on content
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin(),
            new HtmlWebpackPlugin(
                {
                template: "./static/index.html",
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true
                }
            }
            )
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contentHash].css"
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [ "html-loader" ]
            },
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /(node_modules|tests)/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            }
        ],
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
            static: path.resolve(__dirname, 'static'),
        },
        extensions: [ '.ts', '.js' ]
    }
}
