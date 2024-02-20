import express from "express";
import Fastify from "fastify";
import hpp from "hpp";
import path from "path";
import config from "../config";
import devServer from "./devServer";

import render404Page from "./404";
import { webApiRoutes } from "./fastifyApi";
import renderRoutes from "./renderRoutes";
export default async () => {
	const fastifyApp = Fastify();
	const expressApp = express();

	await fastifyApp.register(require("@fastify/helmet"), {
		contentSecurityPolicy: false,
		global: true
	});

	// Prevent HTTP parameter pollution
	// FIXME: any way to use hpp with fastify
	expressApp.use(hpp());

	// Compress all requests
	await fastifyApp.register(require("@fastify/compress"), { global: false });

	await fastifyApp.register(require("@fastify/static"), {
		root: path.join(process.cwd(), "public"),
		wildcard: false,
		prefix: "/"
	});

	// Enable dev-server in development
	if (__DEV__) devServer(fastifyApp);

	fastifyApp.get("/fastify", (_req, reply) => reply.code(200).send({ a: 1 }));
	fastifyApp.get("/fastify-error", (_req, reply) => {
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

	await fastifyApp.register(require("@fastify/express"));

	fastifyApp.listen({ port: config.PORT, host: config.HOST }, (error, address) => {
		if (error) {
			console.log(`==> 😭  OMG!!! ${error}`);
			process.exit(1);
		}
		console.log(`server listening on ${address}`);
	});
};
