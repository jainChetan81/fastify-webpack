import path from "path";
import webpack, { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";
import merge from "webpack-merge";
// @ts-ignore
import CopyWebpackPlugin from "copy-webpack-plugin";

import baseConfig, { isDev } from "./base.config";

const config: Configuration = {
	target: "node",
	devtool: isDev ? "inline-source-map" : "source-map",
	entry: "./src/server",
	output: {
		filename: "index.js",
		chunkFilename: "[id].js",
		path: path.resolve(process.cwd(), "public/server"),
		libraryTarget: "commonjs2"
	},
	node: { __dirname: true, __filename: true },
	externals: [
		"@loadable/component",
		nodeExternals({
			// Load non-javascript files with extensions, presumably via loaders
			allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i]
		})
	],
	plugins: [
		// Adding source map support to node.js (for stack traces)
		new webpack.BannerPlugin({
			banner: 'require("source-map-support").install();',
			raw: true
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: "src/components/**/assets/*.*",
					to({ absoluteFilename }: any) {
						return `../assets/images/components/${absoluteFilename.split("src/components/")[1]}`;
					}
				},
				{
					from: "src/pages/**/assets/*.*",
					to({ absoluteFilename }: any) {
						return `../assets/images/pages/${absoluteFilename.split("src/pages/")[1]}`;
					}
				},
				{
					from: "src/app/**/assets/*.*",
					to({ absoluteFilename }: any) {
						return `../assets/images/app/${absoluteFilename.split("src/app/")[1]}`;
					}
				}
			]
		})
	]
};

export default merge(baseConfig(false), config);
