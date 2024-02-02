import { FastifyInstance } from "fastify";
import path from "path";
import config from "../config";
import devServer from "./devServer";
import ssr from "./ssr";
export default async (fastifyApp: FastifyInstance, _faviconName: string) => {
	// Use helmet to secure Express with various HTTP headers
	fastifyApp.register(require("@fastify/helmet"), {
		contentSecurityPolicy: false,
		global: true
	});

	// Prevent HTTP parameter pollution
	// Compress all requests
	await fastifyApp.register(require("@fastify/compress"), { global: false });

	// Use for http request debug (show errors only)
	// app.use(favicon(path.resolve(process.cwd(), `public/${faviconName}.ico`)));
	// app.use(express.static(path.resolve(process.cwd(), "public")));
	fastifyApp.register(require("@fastify/static"), {
		root: path.join(process.cwd(), "public"),
		prefix: "/public/" // optional: default '/'
	});

	// Enable dev-server in development
	if (__DEV__) devServer(fastifyApp);

	// Use React server-side rendering middleware
	fastifyApp.get("*", ssr);

	fastifyApp.listen(config.PORT, config.HOST, (error) => {
		if (error) console.error(`==> 😭  OMG!!! ${error}`);
	});
};
