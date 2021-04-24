import { AttributesState, AttributeTypes } from "./types";
import { attributesAdapter } from "./adapters";
import { OpenState, LoadingState } from "../types";

const attributesNamespase = "attributes";

const attributesInitialState: AttributesState = {
	attributes: attributesAdapter.getInitialState(),
	filters: {},
	attributeValues: {},

	editDialog: {
		open: OpenState.Closed,
		status: LoadingState.Idle,
		error: null,

		currentRow: {
			attribute: null,
			compliances: {},
		},
		editableRow: {
			attribute: null,
			compliances: {},
		},
	},

	status: LoadingState.Loading,
	error: null,
};

enum AttributeGroups {
	Product = "productAttributes",
	Size = "sizeAttributes",
}

const GroupAttributesNames: Record<AttributeGroups, string> = {
	[AttributeGroups.Product]: "Товарные атрибуты",
	[AttributeGroups.Size]: "Размерные атрибуты",
};

const AttributeTypeNames: Record<AttributeTypes, string> = {
	[AttributeTypes.String]: "строка",
	[AttributeTypes.Number]: "число",
	[AttributeTypes.Boolean]: "да/нет",
	[AttributeTypes.List]: "список",
};

const attributeKeys = [
	"__v",
	"_id",
	"attributeID",
	"name",
	"attributeType",
	"active",
	"createdAt",
	"updatedAt",
	"isKariOnly",
	"addedManually",
	"isSizeAttribute",
	"isBlocked",
	"uniqueAttributeID",
];

export {
	attributesNamespase,
	attributesInitialState,
	GroupAttributesNames,
	AttributeTypeNames,
	AttributeGroups,
	attributeKeys,
};
