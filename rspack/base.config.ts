import LoadablePlugin from "@loadable/webpack-plugin";
import rspack, { Configuration, RspackPluginInstance, RuleSetUseItem } from "@rspack/core";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";
import { WebpackManifestPlugin } from "rspack-manifest-plugin";

export const isDev = process.env.NODE_ENV === "development";

const getStyleLoaders = (isSass?: boolean) => {
	let loaders: RuleSetUseItem[] = [{ loader: "postcss-loader" }];

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
		new rspack.ProgressPlugin(),
		new WebpackManifestPlugin({
			fileName: path.resolve(process.cwd(), "public/webpack-assets.json"),
			filter: (file) => file.isInitial
		}),
		new LoadablePlugin({
			writeToDisk: true,
			filename: "../loadable-stats.json"
		}),
		// Setting global variables
		new rspack.DefinePlugin({
			__CLIENT__: isWeb,
			__SERVER__: !isWeb,
			__DEV__: isDev
		})
	];

	if (isDev)
		plugins = [
			...plugins,
			// Runs TypeScript type checker on a separate process
			false && new ForkTsCheckerWebpackPlugin()
		].filter(Boolean);

	return plugins;
};

const config = (isWeb = false): Configuration => ({
	mode: isDev ? "development" : "production",
	stats: "normal",
	context: path.resolve(process.cwd()),
	output: { clean: true },
	optimization: { minimizer: [new rspack.SwcJsMinimizerRspackPlugin({ dropConsole: true })] },
	plugins: getPlugins(isWeb) as RspackPluginInstance[],
	builtins: {
		css: {
			modules: {
				localIdentName: "[name]__[local]",
				exportsOnly: !isWeb
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.(t|j)sx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "swc-loader",
						options: rspackSwcConfig
					}
				]
			},
			{
				test: /\.css$/,
				use: getStyleLoaders(),
				type: "css/module"
			},
			{
				test: /\.(scss|sass)$/,
				use: getStyleLoaders(true),
				type: "css/module"
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
const rspackSwcConfig = {
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
