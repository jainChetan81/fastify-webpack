import fastify, { FastifyRequest, FastifyReply } from "fastify";
const testApi = (req: FastifyRequest, res: FastifyReply) => {
	res.send({ test: 1 });
};
const webApi1 = () => {
	console.log("webApi1--");
	const webRouter = fastify();
	console.log("--webApi1");

	webRouter.get("/cities/", async (_req, res) => {
		console.log("/cities/");

		res.status(200).send({ status: "cities" });
	});

	webRouter.get("/status/", async (_req, res) => {
		console.log("/status/");
		res.status(200).send({ status: "status" });
	});

	return webRouter;
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

const webApiRoute1 = () => {
	const webRouter = fastify();
	console.log("webApiRoute1");
	webRouter.get("/v1", webApi1);
	return webRouter;
};

export const webApiRoute = () => {
	const webRouter = fastify();
	console.log("webApiRoute2");
	webRouter.get("/v2", testApi);
	console.log("---------ending webApiRoute2-----------");
	return webRouter;
};

export const webApiRoute = [webApiRoute1, webApiRoute2];
const api = fastify();

webApiRoute.forEach((route) => {
	const routeInstance = route();
	routeInstance.register(apiMiddleware);
	api;
});
