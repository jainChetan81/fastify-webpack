import { FastifyInstance } from "fastify";
import config from "../config";

export default (app: FastifyInstance): void => {
	const rspack = require("@rspack/core");
	const rspackConfig = require("../../rspack/client.config").default;
	const compiler = rspack(rspackConfig);
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
