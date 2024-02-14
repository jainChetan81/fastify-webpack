import { Action } from "@reduxjs/toolkit";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { matchRoutes, renderRoutes } from "react-router-config";
import { StaticRouter } from "react-router-dom";
import { FastifyReply, FastifyRequest } from "fastify";

import routes from "../routes";
import createStore from "../store";
import renderHtml from "./renderHtml";
import loadableConfig from "./loadable-config";

export default async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const { store } = createStore({ url: req.url });

  // The method for loading data from server-side
  const loadBranchData = () => {
    const branch = matchRoutes(routes, req.url);
    const promises = branch.map(({ route, match }) => {
      if (route.loadData)
        return Promise.all(
          route
            .loadData({
              params: match.params,
              getState: store.getState,
              req,
              res: reply,
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


    const staticContext: Record<string, any> = {};
    const extractor = await loadableConfig();
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
      return reply.status(301)
        .header('content-type', 'text/html; charset=utf-8')
        .header("Location", staticContext.url);

    }
    return reply
      .status(staticContext.statusCode === "404" ? 404 : 200)
      .header('content-type', 'text/html; charset=utf-8')
      .send(renderHtml(head, extractor, htmlContent, initialState));
  } catch (error) {
    console.error(`==> 😭  Rendering routes error: ${error}`);
    return reply.status(404).send("Not Found :(")
  }
};
