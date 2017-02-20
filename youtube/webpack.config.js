var webpack = require('webpack');

module.exports = {
    devServer: {
        inline:true,
        port: 8008
    },
    reload: true,
    entry: ['./src/index.js'],
    devtool: 'source-map',
    eslint: {configFile: './.eslintrc.json'},
    node: {
        fs: 'empty',
        module: 'empty'
    },
    output: { path: './dist', filename: 'bundle.js'},
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    'plugins': [
                        'transform-object-rest-spread'
                    ],
                    'presets': ['es2015']
                }
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'eslint-loader'
            }
        ]
    },
};