import express, { Router } from "express";

const webApi1 = () => {
	const webRouter = express.Router();
	webRouter.get("/cities/", (_req, res) => {
		res.status(200).send({ status: "cities" });
	});

	webRouter.get("/status/", (_req, res) => {
		res.status(200).send({ status: "status" });
	});

	return webRouter;
};
const webApi2 = () => {
	const webRouter = express.Router();
	webRouter.get("/cities/", (_req, res) => {
		res.status(200).send({ status: "cities2" });
	});

	webRouter.get("/status/", (_req, res) => {
		res.status(200).send({ status: "status2" });
	});

	return webRouter;
};
const webApiRoute = () => {
	const webRouter = express.Router();
	webRouter.use("/v1", webApi1());
	return webRouter;
};
const webApiRoute2 = () => {
	const webRouter = express.Router();
	webRouter.use("/v2", webApi2());
	return webRouter;
};
// 1
export const apiMiddleware = (
	req: { method: string },
	res: {
		set: (arg0: string, arg1: string) => void;
		setHeader: (arg0: string, arg1: string) => void;
	},
	next: () => void
) => {
	const period = 60 * 5;
	if (req.method == "GET") {
		res.set("Cache-control", `public, max-age=${period}`);
	} else {
		res.set("Cache-control", `no-store`);
	}
	if (__DEV__) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	}

	next();
};
// 2
const allRoutes: Router[] = [webApiRoute(), webApiRoute2()];
const app = express();
app.use("/api/", apiMiddleware, allRoutes);
