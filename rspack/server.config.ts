import path from "path";
import rspack, { Configuration } from "@rspack/core";
import nodeExternals from "webpack-node-externals";
import merge from "webpack-merge";

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
		}) as any
	],
	plugins: [
		// Adding source map support to node.js (for stack traces)
		new rspack.BannerPlugin({
			banner: 'require("source-map-support").install();',
			raw: true
		}),
		new rspack.CopyRspackPlugin({
			patterns: [
				{
					from: "src/components/**/assets/*.*",
					to: `../assets/images/`
				},
				{
					from: "src/pages/**/assets/*.*",
					to: `../assets/images/`
				},
				{
					from: "src/app/**/assets/*.*",
					to: `../assets/images/`
				}
			]
		})
	]
};

export default merge(baseConfig(false), config);
