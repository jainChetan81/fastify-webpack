import { FastifyInstance } from "fastify";
import ssr from "./ssr";
import routesApp from "../routes";

export default (webRouter: FastifyInstance) => {
	const activeRoutes = getActiveRoutes(routesApp);
	activeRoutes.forEach((route) => {
		webRouter.get(route, (req, res) => ssr(req, res));
	});

	return webRouter;
};
const getActiveRoutes = (mobileRoutes: typeof routesApp) => {
	const concatRoutes = mobileRoutes[0].routes!;
	const routes: Array<string> = concatRoutes
		.filter((item) => Object.prototype.hasOwnProperty.call(item, "path"))
		.reduce((acc: string[], item) => {
			if (typeof item.path === "string") {
				acc.push(item.path);
			} else if (Array.isArray(item.path)) {
				acc = acc.concat(item.path);
			}
			return acc;
		}, []);
	return routes;
};
