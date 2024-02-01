import fastifyExpress from "@fastify/express";
import express, { Express } from "express";
import { FastifyInstance } from "fastify";
import hpp from "hpp";
import path from "path";
import favicon from "serve-favicon";
import config from "../config";
import devServer from "./devServer";
import ssr from "./ssr";
export default async (app: Express, fastifyApp: FastifyInstance, faviconName: string) => {
	// Use helmet to secure Express with various HTTP headers
	fastifyApp.register(require("@fastify/helmet"), {
		contentSecurityPolicy: false,
		global: true
	});

	// Prevent HTTP parameter pollution
	app.use(hpp());
	await fastifyApp.register(fastifyExpress);
	// Compress all requests
	await fastifyApp.register(require("@fastify/compress"), { global: false });

	// Use for http request debug (show errors only)
	app.use(favicon(path.resolve(process.cwd(), `public/${faviconName}.ico`)));
	// fastifyApp.register(require("fastify-favicon"), {
	// 	path: path.resolve(process.cwd(), `public`),
	// 	name: `favicon.ico`
	// });
	app.use(express.static(path.resolve(process.cwd(), "public")));

	// Enable dev-server in development
	if (__DEV__) devServer(fastifyApp);

	// Use React server-side rendering middleware
	app.get("*", ssr);

	fastifyApp.listen(config.PORT, config.HOST, (error) => {
		if (error) console.error(`==> 😭  OMG!!! ${error}`);
	});
};
