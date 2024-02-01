import path from "path";
import webpack, { Configuration, WebpackPluginInstance, RuleSetUseItem } from "webpack";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import LoadablePlugin from "@loadable/webpack-plugin";

export const isDev = process.env.NODE_ENV === "development";

const getStyleLoaders = (isWeb: boolean, isSass?: boolean) => {
	let loaders: RuleSetUseItem[] = [
		{
			loader: "css-loader",
			options: {
				importLoaders: isSass ? 2 : 1,
				modules: {
					auto: true,
					localIdentName: isDev ? "[path][name]__[local]" : "[hash:base64]",
					exportOnlyLocals: !isWeb
				}
			}
		},
		{ loader: "postcss-loader" }
	];

	if (isWeb) loaders = [MiniCssExtractPlugin.loader, ...loaders];

	if (isSass)
		loaders = [
			...loaders,
			{
				loader: "sass-loader",
				options: {
					implementation: require("sass"),
					additionalData: (...args: any[]) => {
						const themePath = path.resolve(process.cwd(), `src/theme/core.scss`);
						const loaderContext = args[1];
						const data = args[0];
						// More information about available properties https://webpack.js.org/api/loaders/
						const { resourcePath } = loaderContext;
						const relativePath2 = path.relative(resourcePath, themePath).substring(3);
						return `@import "${relativePath2}";${data}`;
					}
				}
			}
		];

	return loaders;
};

const getPlugins = (isWeb: boolean) => {
	let plugins = [
		new webpack.ProgressPlugin(),
		new WebpackManifestPlugin({
			fileName: path.resolve(process.cwd(), "public/webpack-assets.json"),
			filter: (file) => file.isInitial
		}),
		new LoadablePlugin({
			writeToDisk: true,
			filename: "../loadable-stats.json"
		}),
		// Setting global variables
		new webpack.DefinePlugin({
			__CLIENT__: isWeb,
			__SERVER__: !isWeb,
			__DEV__: isDev
		}),
		isDev && new ForkTsCheckerWebpackPlugin()
	].filter(Boolean);

	return plugins;
};

const config = (isWeb = false): Configuration => ({
	mode: isDev ? "development" : "production",
	stats: "minimal",
	context: path.resolve(process.cwd()),
	output: { clean: true },
	optimization: {
		minimizer: [new TerserPlugin({ terserOptions: { compress: { drop_console: true } }, parallel: true, minify: TerserPlugin.swcMinify })]
	},
	plugins: getPlugins(isWeb) as WebpackPluginInstance[],
	module: {
		rules: [
			{
				test: /\.(t|j)sx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "swc-loader",
						options: webpackSwcConfig
					}
				]
			},
			{
				test: /\.css$/,
				use: getStyleLoaders(isWeb)
			},
			{
				test: /\.(scss|sass)$/,
				use: getStyleLoaders(isWeb, true)
			},
			{
				test: /\.(woff2?|eot|ttf|otf)$/i,
				type: "asset",
				generator: { emit: isWeb }
			},
			{
				test: /\.(png|svg|jpe?g|gif)$/i,
				type: "asset",
				generator: { emit: isWeb }
			}
		]
	},
	resolve: {
		modules: ["src", "node_modules"],
		extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
	}
});

export default config;
const webpackSwcConfig = {
	sourceMaps: true,
	jsc: {
		// externalHelpers: The output code depends on helper functions(like browserlist) to support the target environment
		// need to install @swc/helpers to use this feature
		externalHelpers: true,
		parser: {
			syntax: "typescript",
			tsx: true,
			dynamicImport: true
		},
		transform: {
			react: {
				runtime: "automatic"
			}
		},
		experimental: {
			plugins: [["@swc/plugin-loadable-components", {}]]
		}
	},
	env: {
		coreJs: "3.26.1",
		targets: "Chrome >= 48"
	}
};
