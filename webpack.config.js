const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        index: "./src/index.ts",
        cli: "./src/cli.ts",
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    target: "node",
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "umd",
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: "#!/usr/bin/env node",
            raw: true,
        }),
        new CopyPlugin([
            {
                from: "node_modules/castv2/lib/cast_channel.proto",
                to: "",
            },
        ]),
    ],
};
