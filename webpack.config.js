/**
 * This Webpack config is used for bundling files for the demo.
 */
const webpack = require('webpack');
const path = require('path');
const NODE_ENV = JSON.stringify(
    process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
);
const devtool = NODE_ENV == '"development"' ? 'source-map' : undefined;
console.info('process.env.NODE_ENV', NODE_ENV, devtool);

module.exports = {
    devtool,
    stats: {
        modules: true,
        modulesSort: 'size',
    },
    entry: {
        content: ['./src/content.tsx'],
        popup: ['./src/popup.tsx'],
    },
    node: {
        fs: 'empty',
    },
    output: {
        path: path.join(__dirname, '/fd-cypress-recorder'),
        filename: '[name].js',
        publicPath: './fd-cypress-recorder',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: NODE_ENV,
            },
        }),
    ],
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by a TypeScript loader
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
            },
        ],
    },
};
