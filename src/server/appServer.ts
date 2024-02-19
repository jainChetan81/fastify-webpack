import Fastify from "fastify";
import path from "path";
import config from "../config";

import { webApiRoutes } from "./fastifyApi";
import devServer from "./devServer";
import render404Page from "./404";
import renderRoutes from "./renderRoutes";
export default async () => {
	const fastifyApp = Fastify();

	await fastifyApp.register(require("@fastify/helmet"), {
		contentSecurityPolicy: false,
		global: true
	});

	// Compress all requests
	await fastifyApp.register(require("@fastify/compress"), { global: false });

	await fastifyApp.register(require("@fastify/static"), {
		root: path.join(process.cwd(), "public"),
		wildcard: false,
		prefix: "/"
	});

	// Enable dev-server in development
	if (process.env.NODE_ENV === "development") devServer(fastifyApp);

	fastifyApp.get("/fastify", (_req, reply) => reply.code(200).send({ a: 1 }));
	fastifyApp.get("/fastify-error", () => {
		throw new Error("something");
	});
	fastifyApp.setErrorHandler((error, _req, reply) => {
		reply.code(500).header("content-type", "text/html; charset=utf-8").send(render404Page(config, error, 500));
	});
	webApiRoutes.map(async (route) => {
		await fastifyApp.register(route, { prefix: "api" });
	});

	// Use React server-side rendering middleware
	renderRoutes(fastifyApp);

	fastifyApp.setNotFoundHandler((req, reply) => {
		reply
			.code(404)
			.header("content-type", "text/html; charset=utf-8")
			.send(render404Page(config, new Error(`Page Not Found | ${req.url}`), 404));
	});

	fastifyApp.listen({ port: config.PORT, host: config.HOST }, (error, address) => {
		if (error) {
			console.log(`==> 😭  OMG!!! ${error}`);
			process.exit(1);
		}
		console.log(`server listening on ${address}`);
	});
};
