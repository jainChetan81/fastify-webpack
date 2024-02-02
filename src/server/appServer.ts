import Fastify from "fastify";
import hpp from "hpp";
import path from "path";
import config from "../config";
import devServer from "./devServer";

import ssr from "./ssr";
export default async (faviconName: string) => {
	const fastifyApp = Fastify();

	fastifyApp.register(require("@fastify/helmet"), {
		contentSecurityPolicy: false,
		global: true
	});

	// Prevent HTTP parameter pollution
	// FIXME: any way to use hpp with fastify
	// fastifyApp.register(hpp());

	// Compress all requests
	fastifyApp.register(require("@fastify/compress"), { global: false });

	// Use for http request debug (show errors only)
	fastifyApp.register(require("@fastify/static"), {
		root: path.join(process.cwd(), "public"),
		prefix: "/" // optional: default '/'
	});

	// Enable dev-server in development
	if (__DEV__) devServer(fastifyApp);

	// Use React server-side rendering middleware
	fastifyApp.get("/test", (req, reply) => reply.code(200).send({ a: 1 }));
	// FIXME: breaking here
	fastifyApp.get("*", async (req, rep) => {
		await ssr(req, rep);
		return rep;
	});
	fastifyApp.listen({ port: config.PORT, host: config.HOST }, (error, address) => {
		if (error) {
			fastifyApp.log.error(`==> 😭  OMG!!! ${error}`);
			process.exit(1);
		}
		fastifyApp.log.info(`server listening on ${address}`);
	});
};
