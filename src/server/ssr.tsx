import { ChunkExtractor } from "@loadable/server";
import { Action } from "@reduxjs/toolkit";
import path from "path";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { matchRoutes, renderRoutes } from "react-router-config";
import { StaticRouter } from "react-router-dom";
import { FastifyReply, FastifyRequest } from "fastify";

import routes from "../routes";
import createStore from "../store";
import renderHtml from "./renderHtml";

export default async (
  req: FastifyRequest,
  res: FastifyReply
): Promise<void> => {
  console.log(`==> 🌎  Requested URL: ${req.url}`);

  const { store } = createStore({ url: req.url });

  // The method for loading data from server-side
  const loadBranchData = (): Promise<any> => {
    const branch = matchRoutes(routes, req.url);
    const promises = branch.map(({ route, match }) => {
      if (route.loadData)
        return Promise.all(
          route
            .loadData({
              params: match.params,
              getState: store.getState,
              req,
              res,
            })
            .map((item: Action) => store.dispatch(item))
        );

      return Promise.resolve(null);
    });

    return Promise.all(promises);
  };

  try {
    // Load data from server-side first
    await loadBranchData();

    const statsFile = path.resolve(process.cwd(), "public/loadable-stats.json");
    const extractor = new ChunkExtractor({ statsFile });

    const staticContext: Record<string, any> = {};
    const App = extractor.collectChunks(
      <Provider store={store}>
        <StaticRouter location={req.url} context={staticContext}>
          {renderRoutes(routes)}
        </StaticRouter>
      </Provider>
    );

    const initialState = store.getState();
    const htmlContent = renderToString(App);
    const head = Helmet.renderStatic();

    if (staticContext.url) {
      res.status(301)
        .header('content-type', 'text/html; charset=utf-8')
        .header("Location", staticContext.url);
      res.send()

      return;
    }

    // Pass the route and initial state into html template, the "statusCode" comes from <NotFound />
    res
      .status(staticContext.statusCode === "404" ? 404 : 200)
      .header('content-type', 'text/html; charset=utf-8')
      .send(renderHtml(head, extractor, htmlContent, initialState));
  } catch (error) {
    res.status(404).send("Not Found :(")
    console.error(`==> 😭  Rendering routes error: ${error}`);
  }
};
