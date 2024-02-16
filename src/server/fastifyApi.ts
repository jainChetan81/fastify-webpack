import fastify, { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
const testApi = (_req: FastifyRequest, res: FastifyReply) => {
	res.send({ test: 1 });
};
const webApi1 = (webRouter: FastifyInstance, _opts: any, done: any) => {
	webRouter.get("/cities", { preHandler: apiMiddleware }, async (_req, res) => {
		console.log("/cities/");
		res.status(200).send({ status: "cities" });
	});

	webRouter.get("/status", { preHandler: apiMiddleware }, async (_req, res) => {
		console.log("/status/");
		res.status(200).send({ status: "status" });
	});
	done();
};

const webApi2 = () => {
	console.log("webApi2");
	const webRouter = fastify();

	webRouter.get("/cities/", async (_req, res) => {
		console.log("/cities/");

		res.status(200).send({ status: "cities2" });
	});

	webRouter.get("/status/", async (_req, res) => {
		console.log("/status/");

		res.status(200).send({ status: "status2" });
	});

	return webRouter;
};

export const apiMiddleware = (req: FastifyRequest, res: FastifyReply, done: () => void) => {
	console.log("m,iddleware");

	const period = 60 * 5;
	if (req.method == "GET") {
		res.header("Cache-control", `public, max-age=${period}`);
	} else {
		res.header("Cache-control", `no-store`);
	}
	if (process.env.NODE_ENV === "development") {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	}

	done();
};

const webApiRoute1 = (webRouter: FastifyInstance, _opts: any, done: any) => {
	webRouter.register(webApi1, { prefix: "/v1" });
	done();
};

export const webApiRoute2 = (webRouter: FastifyInstance, _opts: any, done: any) => {
	webRouter.get("/v2", { preHandler: apiMiddleware }, testApi);
	done();
};

export const webApiRoutes = [webApiRoute1, webApiRoute2];
