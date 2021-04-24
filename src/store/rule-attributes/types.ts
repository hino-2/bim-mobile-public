import { CaseReducer, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { Attribute } from "../attributes/types";
import { LoadingState, OpenState } from "../types";

interface RuleAttributesState {
	open: boolean;
	data: EntityState<RuleAttribute>;
	selected: RuleAttribute | null;
	status: LoadingState;
	error: string | null;

	editDialog: {
		openState: OpenState;
		status: LoadingState;
		error: string | null;
	};

	// rulesFilters: Filters;
}

type ReducerFunction<T = undefined> = CaseReducer<RuleAttributesState, PayloadAction<T>>;

interface ResponseRuleAttribute {
	_id: string;
	attributeID: string;
	conditionalAttributeID: string;
}

interface RuleAttribute extends ResponseRuleAttribute {
	name?: string;
	displayName?: string;
	removedAttribute?: boolean;
	removedConditionalAttribute?: boolean;
	attribute?: Attribute;
	conditionalAttribute?: Attribute;
}

interface GetRuleAttributesResponse {
	`classified`,
}

export type {
	RuleAttributesState,
	ReducerFunction,
	RuleAttribute,
	ResponseRuleAttribute,
	GetRuleAttributesResponse,
};
