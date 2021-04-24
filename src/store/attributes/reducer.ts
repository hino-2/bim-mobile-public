import { concat, isNil, mergeRight } from "ramda";
import { ReducerFunction, Attribute, DisplayAttributeRow } from "./types";
import { normalizeAttributes, clearEmptyFilters } from "./utils";
import { attributesAdapter } from "./adapters";
import { kariID } from "../../utils/consts";
import { getNormalizedBooleanValue } from "../../utils/data";
import { LoadingState, OpenState } from "../types";

const getAttributes: ReducerFunction = (state) => {
	state.status = LoadingState.Loading;
};

const initAttributes: ReducerFunction = (state) => {
	state.status = LoadingState.Loading;
};

const getAttributesSuccess: ReducerFunction<Attribute[]> = (state, { payload }) => {
	state.attributes = attributesAdapter.setAll(state.attributes, normalizeAttributes(payload));

	state.status = LoadingState.Resolve;
	state.error = null;
};

const getAttributesSuccessWithStatus: ReducerFunction<{
	attributes: Attribute[];
	status?: LoadingState;
}> = (state, { payload }) => {
	const { attributes, status = LoadingState.Idle } = payload;

	state.attributes = attributesAdapter.setAll(state.attributes, normalizeAttributes(attributes));

	state.status = status;
};

const getAttributesFail: ReducerFunction<string> = (state, { payload }) => {
	state.error = payload;
	state.status = LoadingState.Reject;
};

const addAttributeSuccess: ReducerFunction<Attribute> = (state, { payload }) => {
	state.attributes = attributesAdapter.addOne(state.attributes, payload);
};

const editAttributeSuccess: ReducerFunction<{
	changes: Attribute;
	id: string;
}> = (state, { payload }) => {
	const { changes, id } = payload;
	state.attributes = attributesAdapter.updateOne(state.attributes, {
		id,
		changes,
	});
};

const removeAttributeSuccess: ReducerFunction<string> = (state, { payload }) => {
	state.attributes = attributesAdapter.removeOne(state.attributes, payload);
};

const getAttributeValues: ReducerFunction<{
	attribute: Attribute;
	value?: string | number;
}> = (state, { payload }) => {
	const attributeID = payload.attribute.attributeID;

	state.attributeValues[attributeID] = {
		state: LoadingState.Loading,
		attributeValues: [],
		page: 1,
		totalPages: 2,
		totalCount: 0,
	};
};

const getNextAttributeValues: ReducerFunction<{
	attribute: Attribute;
	value?: string | number;
}> = (state, { payload }) => {
	const attributeID = payload.attribute.attributeID;

	state.attributeValues[attributeID].state = LoadingState.Loading;
	state.attributeValues[attributeID].attributeValues =
		state.attributeValues[attributeID]?.attributeValues || [];
};

const getAttributeValuesSuccess: ReducerFunction<{
	attribute: Attribute;
	values: any;
	page: number;
	totalPages: number;
	totalCount: number;
}> = (state, { payload }) => {
	const {
		attribute: { attributeID },
		values = [],
		page = 1,
		totalPages,
		totalCount,
	} = payload;

	state.attributeValues[attributeID] = {
		state: LoadingState.Resolve,
		attributeValues:
			page === 1
				? values
				: concat(state.attributeValues[attributeID].attributeValues, values),
		page: page + 1,
		totalPages,
		totalCount,
	};
};

const getAttributeValuesFail: ReducerFunction<string> = (state, { payload }) => {
	state.attributeValues[payload].state = LoadingState.Reject;
};

const setFilters: ReducerFunction<Record<string, string[]>> = (state, { payload }) => {
	state.filters = clearEmptyFilters(payload);
};

const saveEditDialogExportRulesAttribute: ReducerFunction = (state) => {
	state.editDialog.status = LoadingState.Loading;
};
const saveEditDialogExportRulesAttributeSuccess: ReducerFunction = (state) => {
	state.editDialog.status = LoadingState.Resolve;
	state.editDialog.open = OpenState.Closed;
	state.editDialog.error = null;
};
const saveEditDialogExportRulesAttributeFail: ReducerFunction<string | null> = (
	state,
	{ payload }
) => {
	state.editDialog.status = LoadingState.Reject;
	state.editDialog.error = payload;
};

const openEditDialog: ReducerFunction<{
	row: DisplayAttributeRow;
	aggregatorID?: string;
}> = (state, { payload }) => {
	if (isNil(payload.row)) {
		state.editDialog.editableRow.compliances = {};
		state.editDialog.editableRow.attribute = {
			_id: "",
			attributeID: "",
			attributeType: undefined,
			name: "",
			isSizeAttribute: false,
		};
		state.editDialog.currentRow.compliances = {};
		state.editDialog.currentRow.attribute = {
			_id: "",
			attributeID: "",
			attributeType: undefined,
			name: "",
			isSizeAttribute: false,
		};
		state.editDialog.open = OpenState.Add;
	} else {
		const { attribute, compliances } = payload.row.meta;

		state.editDialog.currentRow.compliances = compliances;
		state.editDialog.currentRow.attribute = attribute;
		state.editDialog.editableRow.compliances = compliances;
		state.editDialog.editableRow.attribute = attribute;
		state.editDialog.open = OpenState.Edit;
	}

	state.editDialog.status = LoadingState.Idle;
};

const closeEditDialog: ReducerFunction = (state) => {
	state.editDialog.open = OpenState.Closed;
	state.editDialog.status = LoadingState.Idle;
	state.editDialog.error = null;
	state.editDialog.currentRow.compliances = {};
	state.editDialog.currentRow.attribute = null;
	state.editDialog.editableRow.compliances = {};
	state.editDialog.editableRow.attribute = null;
};

const setEditDialogAttribute: ReducerFunction<Partial<Attribute>> = (state, { payload }) => {
	if (state.editDialog.editableRow.attribute) {
		state.editDialog.editableRow.attribute = mergeRight(
			state.editDialog.editableRow.attribute,
			payload
		);
	}
	state.editDialog.error = null;
};

const setEditDialogCompliance: ReducerFunction<{
	aggregatorID: string;
	value: string;
}> = (state, { payload }) => {
	const { aggregatorID, value } = payload;

	const normalizedValue = getNormalizedBooleanValue(value);

	if (aggregatorID !== kariID && normalizedValue === true) {
		state.editDialog.editableRow.compliances[kariID] = true;
	}

	state.editDialog.editableRow.compliances[aggregatorID] = normalizedValue;
};

const resetAttributes: ReducerFunction = (state) => {
	state.status = LoadingState.Loading;
};

const reducers = {
	initAttributes,

	getAttributes,
	getAttributesSuccess,
	getNextAttributeValues,
	getAttributesSuccessWithStatus,
	getAttributesFail,

	setFilters,

	addAttributeSuccess,
	editAttributeSuccess,
	removeAttributeSuccess,

	getAttributeValues,
	getAttributeValuesSuccess,
	getAttributeValuesFail,

	openEditDialog,
	closeEditDialog,
	saveEditDialogExportRulesAttribute,
	saveEditDialogExportRulesAttributeSuccess,
	saveEditDialogExportRulesAttributeFail,

	setEditDialogAttribute,
	setEditDialogCompliance,

	resetAttributes,
};

export default reducers;
