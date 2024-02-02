import config from "../config";
import { FastifyInstance } from "fastify";

export default (app: FastifyInstance): void => {
	const webpack = require("webpack");
	const webpackConfig = require("../../webpack/client.config").default;
	const compiler = webpack(webpackConfig);
	const instance = require("webpack-dev-middleware")(compiler, {
		headers: { "Access-Control-Allow-Origin": "*" },
		serverSideRender: true
	});

	app.register(instance);
	app.register(
		require("webpack-hot-middleware")(compiler, {
			log: false,
			path: "/__webpack_hmr",
			heartbeat: 10 * 1000
		})
	);

	instance.waitUntilValid(() => {
		const url = `http://${config.HOST}:${config.PORT}`;
		console.info(`==> 🌎  Listening at ${url}`);
	});
};
