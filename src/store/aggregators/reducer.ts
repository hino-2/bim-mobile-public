import { merge, isEmpty } from "ramda";
import {
	ReducerFunction,
	Aggregator,
	CommissionItem,
	AggregatorErrors,
	Compliances,
} from "./types";
import { aggregatorsInitialState } from "./constants";
import { aggregatorsAdapter } from "./adapters";
import { removeItemByValue, updateItemByProp } from "../../utils/arrays";
import { mapComplexToSimpleCompliances } from "../attributes/utils";
import { LoadingState, OpenState } from "../types";
import { getDefaultCommissionItem } from "./utils";

const getAggregators: ReducerFunction = (state) => {
	state.status = LoadingState.Loading;
};

const getAggregatorsSuccess: ReducerFunction<Aggregator[]> = (state, action) => {
	aggregatorsAdapter.setAll(state.data, action.payload);
	state.status = LoadingState.Resolve;
};

const getAggregatorsFail: ReducerFunction<{
	message: string;
	status: number;
}> = (state, { payload }) => {
	state.error = payload;
	state.status = LoadingState.Reject;
};

const getAggregator: ReducerFunction<string> = (state) => {
	state.selected.status = LoadingState.Loading;
};

const getAggregatorSuccess: ReducerFunction<{
	aggregator: Aggregator;
	commissions: CommissionItem[];
}> = (state, { payload }) => {
	const { aggregator, commissions } = payload;

	state.selected.data = aggregator;
	state.selected.commissions = isEmpty(commissions) ? [getDefaultCommissionItem()] : commissions;

	state.selected.saveStatus = LoadingState.Idle;
	state.selected.error = null;
	state.selected.status = LoadingState.Resolve;
};

const getAggregatorFail: ReducerFunction<AggregatorErrors> = (state, { payload }) => {
	state.selected.error = payload;
	state.selected.status = LoadingState.Reject;
};

const addAggregator: ReducerFunction<Aggregator> = (state) => {
	state.editDialog.status = LoadingState.Loading;
};

const addAggregatorSuccess: ReducerFunction<Aggregator> = (state, { payload }) => {
	aggregatorsAdapter.addOne(state.data, payload);
	state.editDialog.status = LoadingState.Resolve;
	state.editDialog.error = null;
};

const addAggregatorFail: ReducerFunction<string> = (state, { payload }) => {
	state.editDialog.status = LoadingState.Reject;
	state.editDialog.error = payload;
};

const setAggregatorIsActive: ReducerFunction<boolean> = (state, { payload }) => {
	if (state.selected.data) {
		state.selected.data.isActive = payload;
	}
};

const setAggregatorName: ReducerFunction<string> = (state, { payload }) => {
	if (state.selected.data) {
		state.selected.data.name = payload;
	}
};

const openEditDialog: ReducerFunction = (state) => {
	state.editDialog.openState = OpenState.Add;
};

const closeEditDialog: ReducerFunction = (state) => {
	state.editDialog = aggregatorsInitialState.editDialog;
};

const addCommission: ReducerFunction = (state) => {
	state.selected.commissions.push(getDefaultCommissionItem());
};

const editCommission: ReducerFunction<Partial<CommissionItem>> = (state, { payload }) => {
	state.selected.commissions = state.selected.commissions.map((commission) =>
		commission.id === payload.id ? merge(commission, payload) : commission
	);
};

const removeCommission: ReducerFunction<string> = (state, { payload }) => {
	if (state.selected.commissions.length === 1) {
		state.selected.commissions = [getDefaultCommissionItem()];
	} else {
		state.selected.commissions = removeItemByValue("id", payload, state.selected.commissions);
	}
};

const removeAllCommissions: ReducerFunction = (state) => {
	state.selected.commissions = [getDefaultCommissionItem()];
};

const saveAggregator: ReducerFunction = (state) => {
	state.selected.saveStatus = LoadingState.Loading;
};

const saveAggregatorSuccess: ReducerFunction<{
	aggregator: Aggregator;
	commissions: CommissionItem[];
}> = (state, { payload }) => {
	const { aggregator, commissions } = payload;

	state.selected.data = aggregator;
	aggregatorsAdapter.setAll(
		state.data,
		updateItemByProp("_id", aggregator, aggregatorsAdapter.getSelectors().selectAll(state.data))
	);

	state.selected.commissions = isEmpty(commissions) ? [getDefaultCommissionItem()] : commissions;
	state.selected.error = null;
	state.selected.saveStatus = LoadingState.Resolve;
};

const saveAggregatorFail: ReducerFunction<AggregatorErrors> = (state, { payload }) => {
	state.selected.error = payload;
	state.selected.saveStatus = LoadingState.Reject;
};

const clearAggregators: ReducerFunction = (state) => {
	state.data = aggregatorsInitialState.data;
	state.selected = aggregatorsInitialState.selected;
	state.status = aggregatorsInitialState.status;
};

const clearAggregator: ReducerFunction = (state) => {
	state.selected = aggregatorsInitialState.selected;
};

const setAggregatorCompliance: ReducerFunction<Compliances> = (state, { payload }) => {
	aggregatorsAdapter.setAll(
		state.data,
		mapComplexToSimpleCompliances(
			aggregatorsAdapter.getSelectors().selectAll(state.data),
			payload
		)
	);
};

const resetLoadingStatus: ReducerFunction = (state) => {
	state.status = LoadingState.Loading;
};

const select: ReducerFunction<string> = (state, { payload }) => {
	state.editDialog = aggregatorsInitialState.editDialog;
	state.selected.data = aggregatorsAdapter.getSelectors().selectById(state.data, payload) || null;
};

const setListStatus: ReducerFunction<boolean> = (state, { payload }) => {
	state.list.openList = payload;
};

const reducers = {
	getAggregators,
	getAggregatorsSuccess,
	getAggregatorsFail,

	getAggregator,
	getAggregatorSuccess,
	getAggregatorFail,

	addAggregator,
	addAggregatorSuccess,
	addAggregatorFail,
	setAggregatorCompliance,

	setAggregatorIsActive,
	setAggregatorName,

	openEditDialog,
	closeEditDialog,
	select,

	addCommission,
	editCommission,
	removeCommission,
	removeAllCommissions,

	saveAggregator,
	saveAggregatorSuccess,
	saveAggregatorFail,

	resetLoadingStatus,
	clearAggregators,
	clearAggregator,
	setListStatus,
};

export default reducers;
