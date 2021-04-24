import { createSelector } from "@reduxjs/toolkit";
import { prop, sortBy } from "ramda";
import { getIndex } from "../../utils/arrays";
import { ApplicationState } from "../types";
import { ruleAttributesAdapter } from "./adapters";

const ruleAttributesAdapterSelectors = ruleAttributesAdapter.getSelectors<ApplicationState>(
	(state) => state.ruleAttributes.data
);

const selected = (state: ApplicationState) => state.ruleAttributes.selected;
const data = ruleAttributesAdapterSelectors.selectAll;

const byID = (ruleAttributeID: string) => (state: ApplicationState) =>
	ruleAttributesAdapterSelectors.selectById(state, ruleAttributeID);

const status = (state: ApplicationState) => state.ruleAttributes.status;
const error = (state: ApplicationState) => state.ruleAttributes.error;
// const rulesFilters = (state: ApplicationState) =>
//   state.ruleAttributes.rulesFilters;

const editDialog = (state: ApplicationState) => state.ruleAttributes.editDialog;

const haveCondition = createSelector(selected, (conditionalAttribute) =>
	Boolean(conditionalAttribute?.conditionalAttributeID)
);

const sortedRuleAttributesSelector = createSelector(data, sortBy(prop("name")));

const selectedIndex = createSelector(data, selected, getIndex("attributeID"));

const ruleAttributesSelectors = {
	selected,
	data,
	byID,
	status,
	error,
	// rulesFilters,
	editDialog,
	haveCondition,
	sortedRuleAttributesSelector,
	selectedIndex,
};

export default ruleAttributesSelectors;
