import { createMemoryHistory, createBrowserHistory } from "history";
import { Action, configureStore } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import { routerMiddleware } from "connected-react-router";

import createRootReducer from "./rootReducer";

interface Arg {
	initialState?: typeof window.__INITIAL_STATE__;
	url?: string;
}

// Use inferred return type for making correctly Redux types
const createStore = ({ initialState, url }: Arg = {}) => {
	const history = __SERVER__ ? createMemoryHistory({ initialEntries: [url || "/"] }) : createBrowserHistory();
	const store = configureStore({
		preloadedState: initialState,
		// @ts-ignore
		reducer: createRootReducer(history),
		// @ts-ignore
		middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), routerMiddleware(history)],
		devTools: __DEV__
	});

	return { store, history };
};

const { store } = createStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;

export default createStore;
