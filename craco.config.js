// create-react-app 配置修改
// https://github.com/gsoft-inc/craco

const path = require('path');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoAntDesignPlugin = require('craco-antd');
const CracoLessPlugin = require('craco-less'); // include in craco-antd
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const packageName = require(path.join(__dirname, 'package.json')).name;

const SRC_PATH = path.join(__dirname, 'src');
const NODE_MODULES_PATH = path.join(__dirname, 'node_modules');
const PAGES_PATH = path.join(SRC_PATH, 'pages');
const BUILD_PATH = path.join(__dirname, process.env.BUILD_PATH || 'build');
const CSS_MODULE_LOCAL_IDENT_NAME = '[local]_[hash:base64:5]';

// Don't open the browser during development
// process.env.BROWSER = 'none';

module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeThemeLessPath: path.join(SRC_PATH, 'theme.less'),
                babelPluginImportOptions: {
                    libraryDirectory: 'es',
                },
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            packageName,
                        },
                    },
                },
                modifyLessRule: function(lessRule, _context) {
                    // src 中less交给 CracoLessPlugin 处理
                    lessRule.exclude = SRC_PATH;
                    return lessRule;
                },
            },
        },
        {
            plugin: CracoLessPlugin,
            options: {
                modifyLessRule: function(lessRule, _context) {
                    lessRule.test = /\.(less)$/;
                    lessRule.use = [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {localIdentName: CSS_MODULE_LOCAL_IDENT_NAME},
                            },
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                lessOptions: {
                                    modifyVars: {
                                        packageName,
                                    },
                                    javascriptEnabled: true,
                                },
                            },
                        },
                    ];
                    lessRule.exclude = /node_modules/;

                    return lessRule;
                },
            },
        },
    ],
    devServer: (devServerConfig, {env, paths, proxy, allowedHost}) => {
        if (!devServerConfig.headers) devServerConfig.headers = {};
        devServerConfig.headers['Access-Control-Allow-Origin'] = '*';
        return devServerConfig;
    },
    webpack: {
        alias: {
            // 使所有的react 都访问主应用安装的包
            react: path.join(NODE_MODULES_PATH, 'react'),
            antd: path.join(NODE_MODULES_PATH, 'antd'),
            'react-dom': path.join(NODE_MODULES_PATH, 'react-dom'),
            'react-redux': path.join(NODE_MODULES_PATH, 'react-redux'),
            'redux': path.join(NODE_MODULES_PATH, 'redux'),
            'react-router-dom': path.join(NODE_MODULES_PATH, 'react-router-dom'),
            'axios': path.join(NODE_MODULES_PATH, 'axios'),

            src: SRC_PATH,
        },
        plugins: [
            new WebpackBar({profile: true}),
            ...(process.env.ANALYZER === 'true' ?
                [
                    new BundleAnalyzerPlugin({openAnalyzer: false}),
                ]
                : []),
        ],
        configure: (webpackConfig, {env, paths}) => {
            paths.appBuild = webpackConfig.output.path = BUILD_PATH;

            webpackConfig.output.library = packageName;
            webpackConfig.output.libraryTarget = 'umd';
            webpackConfig.output.jsonpFunction = `webpackJsonp_${packageName}`;

            webpackConfig.module.rules.push({
                test: path.join(PAGES_PATH, 'page-configs.js'),
                enforce: 'pre',
                use: {
                    loader: require.resolve('@ra-lib/config-loader'),
                    options: {
                        pagesPath: PAGES_PATH,
                    },
                },
                include: SRC_PATH,
            });

            if (process.env.ANALYZER_TIME === 'true') {
                const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

                const smp = new SpeedMeasurePlugin();

                return smp.wrap(webpackConfig);
            }

            // mini-css-extract-plugin 对css引入的顺序会有提示，如果我们并不依赖于css文件顺序，这个可以关闭
            // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250#issuecomment-415345126
            const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.find((plugin) => plugin instanceof MiniCssExtractPlugin);
            if (instanceOfMiniCssExtractPlugin) instanceOfMiniCssExtractPlugin.options.ignoreOrder = true;

            return webpackConfig;
        },

    },
    babel: {
        plugins: [
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
            [
                '@babel/plugin-proposal-decorators',
                {
                    'legacy': true,
                },
            ],
        ],
    },
};
