import Fastify from "fastify";
import path from "path";
import express from "express";
import config from "../config";
import devServer from "./devServer";
import favicon from "serve-favicon";
import hpp from "hpp";
import helmet from "helmet";
import compression from "compression";

import ssr from "./ssr";
export default async (faviconName: string) => {
	const app = express();
	const fastifyApp = Fastify();
	await fastifyApp.register(require("@fastify/express"));

	// Use helmet to secure Express with various HTTP headers
	app.use(helmet({ contentSecurityPolicy: false }));

	// fastifyApp.register(require("@fastify/helmet"), {
	// 	contentSecurityPolicy: false,
	// 	global: true
	// });

	// Prevent HTTP parameter pollution]
	app.use(hpp());
	// Compress all requests
	// await fastifyApp.register(require("@fastify/compress"), { global: false });
	app.use(compression());

	// Use for http request debug (show errors only)
	app.use(favicon(path.resolve(process.cwd(), `public/${faviconName}.ico`)));
	app.use(express.static(path.resolve(process.cwd(), "public")));
	// fastifyApp.register(require("@fastify/static"), {
	// 	root: path.join(process.cwd(), "public"),
	// 	prefix: "/public/" // optional: default '/'
	// });

	// Enable dev-server in development
	if (__DEV__) devServer(app);

	// Use React server-side rendering middleware
	app.get("*", ssr);

	fastifyApp.listen(config.PORT, config.HOST, (error) => {
		if (error) console.error(`==> 😭  OMG!!! ${error}`);
	});
};
