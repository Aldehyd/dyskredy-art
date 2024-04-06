
const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
// const { config } = require('dotenv');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const devMode = process.env.NODE_ENV !== "production";

const cssLoaders = [devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader : 'postcss-loader',
                            options : {
                                postcssOptions : {
                                    plugins: (loader) => {
                                        require('autoprefixer')({
                                            browsers: ['last 2 versions']
                                        })
                                    }
                                }
                            }
                        },
                        'sass-loader']


config = {
    mode: devMode ? 'development' : 'production',
    // target: 'node',
    entry: {
        main: path.resolve(__dirname,'./src/main.ts'),
        // server: path.resolve(__dirname,'./src/server.ts'),
        mainStyle: path.resolve(__dirname,'./src/mainStyle.scss'),
        mainStyleContrast: path.resolve(__dirname,'./src/mainStyleContrast.scss')
    },
    output:{
        filename: devMode ? '[name].js' : '[name][contenthash].js',
        path: path.resolve(__dirname,'../server/dist'),
        clean: true,
        assetModuleFilename: 'img/[hash][ext][query]'
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname,'dist')
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use : cssLoaders
            },
            {
                test: /\.(png|jpg|svg|mp4)$/i,
                type: 'asset/resource',
                generator: {
                    filename: devMode ? 'img/[name][ext]' : 'img/[hash][ext][query]',
                }
            },
            {
                test: /\.html$/,
                use: 'html-loader',
                generator: {
                    filename: 'static/[hash][ext][query]',
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader : 'babel-loader',
                    options: {
                        presets: [
                        ['@babel/preset-env', { targets: "default" }]
                        ]
                    }
                }
            },
        ]
    },
    plugins : [
        // new NodePolyfillPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new IgnoreEmitPlugin(/^mainStyle.*\.js$/) //to not generate output js files from css files (fix a webpack bug)
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ],
        minimize: true,
    },
    resolve: {
        extensions: ['.js', '.ts', '.json', '.wasm'], 
        // fallback: {
        //     fs: false,
        //     tls: false,
        //     net: false,
        //     path: false,
        //     zlib: require.resolve("browserify-zlib"),
        //     http: require.resolve("stream-http"),
        //     https: false,
        //     async_hooks: false,
        //     os: require.resolve("os-browserify/browser"),
        //     querystring: require.resolve("querystring-es3"),
        //     stream: require.resolve("stream-browserify"),
        //     crypto: require.resolve("crypto-browserify"),
        //     // crypto-browserify: require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
        // },
    },
};


const htmlPages = ['index','en','a-propos','about','contact','contact_en','technopolice','technopolice_en','reves','dreams','peintures','paintings','photos','photos_en','videos','videos_en','404','accessibilite','accessibility']
htmlPages.forEach(page => config.plugins.push(new HTMLWebpackPlugin({
    title: `${page}`,
    filename: `${page}.html`,
    template: `./src/${page}.html`
})))
config.plugins.reverse(); //car minicssextractplugin doit être situé après htmlwebpackplugin

module.exports = config