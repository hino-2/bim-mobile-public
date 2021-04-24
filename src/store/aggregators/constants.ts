import { kariID, kariEshopID, mobileKariID } from "../../utils/consts";
import { LoadingState, OpenState } from "../types";
import { aggregatorsAdapter } from "./adapters";
import { Aggregator, AggregatorsState } from "./types";

const aggregatorsNamespase = "aggregators";
const aggregatorCommon: Aggregator = { aggregatorID: "common", name: "Общее" };

const aggregatorsInitialState: AggregatorsState = {
	data: aggregatorsAdapter.getInitialState(),

	selected: {
		data: null,

		commissions: [],

		error: null,
		status: LoadingState.Idle,
		saveStatus: LoadingState.Idle,
	},

	editDialog: {
		openState: OpenState.Closed,
		status: LoadingState.Idle,
		error: null,
	},

	error: null,
	status: LoadingState.Idle,
	list: {
		openList: true,
	},
};
const aggregatorsFilterProps: (keyof Aggregator)[] = ["aggregatorID", "name"];
const firstSortAggregatorsIDs = [kariID, kariEshopID, mobileKariID];

export {
	aggregatorsNamespase,
	aggregatorsInitialState,
	aggregatorsFilterProps,
	aggregatorCommon,
	firstSortAggregatorsIDs,
};
