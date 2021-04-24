import { createSelector } from "@reduxjs/toolkit";
import { getIndex } from "../../utils/arrays";
import { ApplicationState } from "../types";
import { aggregatorsAdapter } from "./adapters";
import {
	findAggregatorByID,
	getActiveAggregators,
	isEmptyCommissionItem,
	prependCommonAggregator,
	rejectKariAggregator,
} from "./utils";

const aggregatorsAdapterSelectors = aggregatorsAdapter.getSelectors<ApplicationState>(
	(state) => state.aggregators.data
);

const status = (state: ApplicationState) => state.aggregators.status;
const error = (state: ApplicationState) => state.aggregators.error?.message;
const selected = (state: ApplicationState) => state.aggregators.selected;
const openListStatus = (state: ApplicationState) => state.aggregators.list.openList;

const selectedAggregator = createSelector(selected, ({ data }) => data);
const selectedAggregatorStatus = createSelector(selected, ({ status }) => status);
const selectedAggregatorCommissions = createSelector(selected, ({ commissions }) => commissions);
const selectedAggregatorError = createSelector(selected, ({ error }) => error);
const selectedAggregatorCommissionsError = createSelector(selected, ({ error, commissions }) =>
	commissions.length === 1 && isEmptyCommissionItem(commissions[0])
		? false
		: error === "commissions"
);
const selectedAggregatorSaveStatus = createSelector(selected, ({ saveStatus }) => saveStatus);

const activeAggregators = createSelector(
	aggregatorsAdapterSelectors.selectAll,
	getActiveAggregators
);

const editDialog = (state: ApplicationState) => state.aggregators.editDialog;
const selectedIndex = createSelector(
	aggregatorsAdapterSelectors.selectAll,
	selectedAggregator,
	getIndex("aggregatorID")
);

const aggregatorsSelectors = {
	aggregators: {
		all: aggregatorsAdapterSelectors.selectAll,
		withoutKari: createSelector(aggregatorsAdapterSelectors.selectAll, rejectKariAggregator),
		withCommon: createSelector(aggregatorsAdapterSelectors.selectAll, prependCommonAggregator),
		byId: (aggregatorID: string) =>
			createSelector(aggregatorsAdapterSelectors.selectAll, findAggregatorByID(aggregatorID)),
	},
	activeAggregators: {
		all: activeAggregators,
		withoutKari: createSelector(activeAggregators, rejectKariAggregator),
		withCommon: createSelector(activeAggregators, prependCommonAggregator),
		byId: (aggregatorID: string) =>
			createSelector(activeAggregators, findAggregatorByID(aggregatorID)),
	},
	other: {
		status,
		error,
		selected,
		editDialog,
		selectedIndex,
		selectedAggregator,
		selectedAggregatorError,
		selectedAggregatorStatus,
		selectedAggregatorSaveStatus,
		selectedAggregatorCommissions,
		selectedAggregatorCommissionsError,
		openListStatus,
	},
};

export default aggregatorsSelectors;
