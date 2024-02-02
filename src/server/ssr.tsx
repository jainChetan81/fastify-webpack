import path from "path";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { renderRoutes, matchRoutes } from "react-router-config";
import { Provider } from "react-redux";
import { ChunkExtractor } from "@loadable/server";
import { Helmet } from "react-helmet";
import { Action } from "@reduxjs/toolkit";
import NodeFS from "node:fs/promises";

import createStore from "../store";
import renderHtml from "./renderHtml";
import routes from "../routes";
import { FastifyReply, FastifyRequest } from "fastify";

async function loadStats(filepath: string) {
  const stats = JSON.parse(await NodeFS.readFile(filepath, "utf-8"));
  if (stats.namedChunkGroups) {
    for (const key in stats.namedChunkGroups) {
      if (stats.namedChunkGroups.hasOwnProperty(key)) {
        const item = stats.namedChunkGroups[key];
        item.childAssets = item.childAssets || {};
      }
    }
  }
  return stats;
}

export default async (
  req: FastifyRequest,
  res: FastifyReply,
): Promise<void> => {
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
    const extractor = new ChunkExtractor({
      stats: await loadStats(statsFile),
    });

    const staticContext: Record<string, any> = {};
    const App = extractor.collectChunks(
      <Provider store={store}>
        {/* Setup React-Router server-side rendering */}
        <StaticRouter location={req.url} context={staticContext}>
          {renderRoutes(routes)}
        </StaticRouter>
      </Provider>
    );

    const initialState = store.getState();
    const htmlContent = renderToString(App);
    // head must be placed after "renderToString"
    // see: https://github.com/nfl/react-helmet#server-usage
    const head = Helmet.renderStatic();

    // Check if the render result contains a redirect, if so we need to set
    // the specific status and redirect header and end the response
    if (staticContext.url) {
      res.status(301).header("Location", staticContext.url);
      res.send()

      return;
    }

    // Pass the route and initial state into html template, the "statusCode" comes from <NotFound />
    res
      .status(staticContext.statusCode === "404" ? 404 : 200)
      .send(renderHtml(head, extractor, htmlContent, initialState));
  } catch (error) {
    res.status(404).send("Not Found :(");
    console.error(`==> 😭  Rendering routes error: ${error}`);
  }

};
