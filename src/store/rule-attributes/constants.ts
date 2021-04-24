import { RuleAttributesState } from "./types";
import { ruleAttributesAdapter } from "./adapters";
import { LoadingState, OpenState } from "../types";

export const ruleAttributesNamespace = "ruleAttributes";

export const ruleAttributesInitialState: RuleAttributesState = {
	open: true,
	data: ruleAttributesAdapter.getInitialState(),
	selected: null,
	error: null,
	status: LoadingState.Idle,

	editDialog: {
		openState: OpenState.Closed,
		status: LoadingState.Idle,
		error: null,
	},

	// rulesFilters: {},
};
