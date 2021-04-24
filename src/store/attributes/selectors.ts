import { createSelector } from "@reduxjs/toolkit";
import { find, assoc, map, pipe, sortBy } from "ramda";
import { GroupAttributesNames } from "./constants";
import { FindAttribute, Attribute } from "./types";
import { attributesAdapter } from "./adapters";
import {
	groupAttributes,
	sortAttributes,
	SortAttributesProps,
	exportRulesDataSelector,
	getConditionAttribute,
	getDefaultColumnWidth,
} from "./utils";
import { isNilOrIsEmpty } from "../../utils/data";
import { componentLoadingState } from "../../utils/helpers";
import aggregatorsSelectors from "../aggregators/selectors";
import { ApplicationState, LoadingState } from "../types";
import ruleAttributesSelectors from "../rule-attributes/selectors";

const attributesAdapterSelectors = attributesAdapter.getSelectors<ApplicationState>(
	(state) => state.attributes.attributes
);

const filters = (state: ApplicationState) => state.attributes.filters;

const productAttributes = createSelector(attributesAdapterSelectors.selectAll, (attributes) =>
	attributes.filter(({ isSizeAttribute }) => !isSizeAttribute)
);
const sizeAttributes = createSelector(attributesAdapterSelectors.selectAll, (attributes) =>
	attributes.filter(({ isSizeAttribute }) => isSizeAttribute)
);

const attributeValues = (state: ApplicationState) => state.attributes.attributeValues;
const status = (state: ApplicationState) => state.attributes.status;

const groupedAttributes = createSelector(attributesAdapterSelectors.selectAll, groupAttributes);

const attributeBy = (fn: FindAttribute) =>
	createSelector(attributesAdapterSelectors.selectAll, find(fn));

const sortedGroupedAttributes = createSelector(
	attributesAdapterSelectors.selectAll,
	pipe(
		sortBy(({ isSizeAttribute }) => !isSizeAttribute),
		map<Attribute, Record<"group", string>>((attribute) =>
			assoc(
				"group",
				attribute.isSizeAttribute
					? GroupAttributesNames.sizeAttributes
					: GroupAttributesNames.productAttributes,
				attribute
			)
		)
	)
);

const exportRulesData = createSelector(
	attributesAdapterSelectors.selectAll,
	aggregatorsSelectors.aggregators.all,
	filters,
	exportRulesDataSelector
);

const loadingState = createSelector(
	status,
	ruleAttributesSelectors.status,
	aggregatorsSelectors.other.status,
	componentLoadingState
);

const conditionAttribute = createSelector(
	ruleAttributesSelectors.selected,
	productAttributes,
	getConditionAttribute
);

const editDialog = (state: ApplicationState) => state.attributes.editDialog;
const editDialogOpen = (state: ApplicationState) => state.attributes.editDialog.open;
const editDialogStatus = (state: ApplicationState) => state.attributes.editDialog.status;
const editDialogError = (state: ApplicationState) => state.attributes.editDialog.error;
const editDialogCurrentAttribute = (state: ApplicationState) =>
	state.attributes.editDialog.currentRow.attribute;
const editDialogCurrentCompliences = (state: ApplicationState) =>
	state.attributes.editDialog.currentRow.compliances;
const editDialogEditableAttribute = (state: ApplicationState) =>
	state.attributes.editDialog.editableRow.attribute;
const editDialogEditableCompliences = (state: ApplicationState) =>
	state.attributes.editDialog.editableRow.compliances;

const isRequiredNotFilled = (state: ApplicationState) =>
	[
		state.attributes.editDialog.editableRow.attribute?.attributeID,
		state.attributes.editDialog.editableRow.attribute?.attributeType,
	].some(isNilOrIsEmpty);

const attributesSelectors = {
	loadingState,
	attributes: attributesAdapterSelectors.selectAll,
	filters,
	attributesAdapterSelectors,
	exportRulesData,
	groupedAttributes,
	productAttributes,
	sizeAttributes,
	conditionAttribute,
	status,
	attributeBy,
	editDialog,
	editDialogOpen,
	editDialogError,
	editDialogStatus,
	editDialogCurrentAttribute,
	editDialogCurrentCompliences,
	editDialogEditableAttribute,
	editDialogEditableCompliences,
	isRequiredNotFilled,
	sortedProductAttributes: (props: SortAttributesProps) =>
		createSelector(productAttributes, sortAttributes(props)),
	sortedAllAttributes: (props: SortAttributesProps) =>
		createSelector(attributesAdapterSelectors.selectAll, sortAttributes(props)),
	attribute: (attributeID: string) =>
		createSelector(attributesAdapterSelectors.selectAll, (attributes) =>
			attributes.find((attribute) => attribute.attributeID === attributeID)
		),
	sortedGroupedAttributes,
	attributeValuesById: (attributeID: string) =>
		createSelector(
			attributeValues,
			(attributeValues) =>
				attributeValues[attributeID] || {
					state: LoadingState.Idle,
					attributeValues: [] as string[],
					page: 1,
					totalPages: 2,
					totalCount: 0,
				}
		),
};

export default attributesSelectors;
