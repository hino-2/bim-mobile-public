// import { createBrowserHistory } from "history";
import { Attribute } from "../attributes/types";
import { LoadingState, OpenState } from "../types";
import { ruleAttributesAdapter } from "./adapters";
import { ruleAttributesInitialState } from "./constants";
import { RuleAttribute, ReducerFunction } from "./types";
import { mapRuleAttributes } from "./utils";

// const history = createBrowserHistory();

const initRuleAttributes: ReducerFunction = (state) => {
	state.status = LoadingState.Loading;
};

const getRuleAttributes: ReducerFunction = (state) => {
	state.status = LoadingState.Loading;
};

const getRuleAttributesSuccess: ReducerFunction<{
	ruleAttributes: RuleAttribute[];
	attributes: Attribute[];
}> = (state, { payload }) => {
	const { ruleAttributes, attributes } = payload;

	state.data = ruleAttributesAdapter.setAll(
		state.data,
		mapRuleAttributes(ruleAttributes, attributes)
	);

	state.status = LoadingState.Resolve;
	state.editDialog.status = LoadingState.Resolve;
	state.error = null;
};

const getRuleAttributesFail: ReducerFunction<string> = (state, { payload }) => {
	state.error = payload;
	state.status = LoadingState.Reject;
};

const selectRuleAttribute: ReducerFunction<string | null> = (state, { payload }) => {
	state.status = LoadingState.Resolve;
	state.error = null;
	// state.rulesFilters = {};

	if (payload) {
		const ruleAttribute = ruleAttributesAdapter.getSelectors().selectById(state.data, payload);

		if (ruleAttribute) {
			state.selected = ruleAttribute;
			// history.push(`/rules/${ruleAttribute.attributeID}`);
		}
	} else {
		state.selected = null;
		// history.push("/rules");
	}
};

const changeRuleAttributeFail: ReducerFunction<string> = (state, { payload }) => {
	state.error = payload;
};

const openEditDialog: ReducerFunction = (state) => {
	state.editDialog.openState = OpenState.Add;
};

const closeEditDialog: ReducerFunction = (state) => {
	state.editDialog.openState = OpenState.Closed;
};

const addRuleAttribute: ReducerFunction<string> = (state) => {
	state.editDialog.status = LoadingState.Loading;
};

const removeRuleAttribute: ReducerFunction<string> = (state) => {
	state.editDialog.status = LoadingState.Loading;
};

const setRulesFilters: ReducerFunction<Record<string, string[]>> = (state, { payload }) => {
	// state.rulesFilters = payload;
};

const clearRules: ReducerFunction = (state) => {
	state.data = ruleAttributesInitialState.data;
	state.error = ruleAttributesInitialState.error;
	state.open = ruleAttributesInitialState.open;
	state.selected = ruleAttributesInitialState.selected;
	state.error = ruleAttributesInitialState.error;
};

const ruleAttributesReducers = {
	initRuleAttributes,
	setRulesFilters,
	clearRules,

	getRuleAttributes,
	getRuleAttributesSuccess,
	getRuleAttributesFail,
	changeRuleAttributeFail,
	addRuleAttribute,
	removeRuleAttribute,

	selectRuleAttribute,

	openEditDialog,
	closeEditDialog,
};

export default ruleAttributesReducers;
