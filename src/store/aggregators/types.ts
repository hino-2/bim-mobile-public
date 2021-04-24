import { CaseReducer, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { Attribute } from "../attributes/types";
import { LoadingState, OpenState } from "../types";

interface AggregatorsState {
	data: EntityState<Aggregator>;

	selected: {
		data: Aggregator | null;

		commissions: CommissionItem[];

		error: AggregatorErrors | null;
		status: LoadingState;
		saveStatus: LoadingState;
	};

	editDialog: {
		openState: OpenState;
		status: LoadingState;
		error: string | null;
	};

	error: { message: string; status: number } | null;
	status: LoadingState;
	list: {
		openList: boolean;
	};
}

type ReducerFunction<T = undefined> = CaseReducer<AggregatorsState, PayloadAction<T>>;

interface Compliance {
	active: boolean;
	compliance: string;
	isSizeAttribute: boolean;
}
type Commissions = Record<string, Record<string, number>>;
type AggregatorErrors = "name" | "commissions" | "request" | "not_found";

type Compliances = Record<string, Record<string, Compliance>>;

interface ResponseCommissionItem {
	`classified`,
}

interface CommissionItem {
	id: string;
	attributeID: string | null;
	attribute: Attribute | null;
	isSizeAttribute: boolean | null;
	values: string[];
	commission: string | null;
}

interface Aggregator {
	_id?: string;
	isActive?: boolean;
	commissions?: ResponseCommissionItem[];
	compliances?: Record<string, Compliance>;
	aggregatorID: string;
	name: string;
}

interface OldAggregator {
	`classified`,
}
interface GetAggregatorsResponse {
	`classified`,
}

interface GetAggregatorResponse {
	`classified`,
}

interface EditCompliancesResponse {
	`classified`,
}

type EditCommissionsRequest = {
	`classified`,
};

type EditCommissionsResponse = {
	`classified`,
};

export type {
	AggregatorsState,
	Aggregator,
	OldAggregator,
	ReducerFunction,
	GetAggregatorsResponse,
	GetAggregatorResponse,
	EditCompliancesResponse,
	ResponseCommissionItem,
	EditCommissionsRequest,
	EditCommissionsResponse,
	CommissionItem,
	Commissions,
	Compliance,
	Compliances,
	AggregatorErrors,
};
