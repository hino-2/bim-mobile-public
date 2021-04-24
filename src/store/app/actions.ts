import { createAction } from "@reduxjs/toolkit";
import { appNamespace } from "./consts";
import appSlice from "./index";

const appInitFail = createAction<{ message: string; status: number }>(
	appNamespace + "/appInitFail"
);

const appActions = { appInitFail, ...appSlice.actions };

export default appActions;
