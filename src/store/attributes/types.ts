import { CaseReducer, PayloadAction, EntityState } from "@reduxjs/toolkit";
import { OpenState, LoadingState } from "../types";
interface AttributesState {
	attributes: EntityState<Attribute>;
	attributeValues: AttributeValues;
	filters: Record<string, Attribute[] | string[]>;
	// columns: EntityState<ColumnProperties>;

	editDialog: {
		currentRow: {
			attribute: Attribute | null;
			compliances: Record<string, boolean>;
		};
		editableRow: {
			attribute: Attribute | null;
			compliances: Record<string, boolean>;
		};

		open: OpenState;
		status: LoadingState;
		error: string | null;
	};

	status: LoadingState;
	error: string | null;
}

type AttributeValues = Record<
	string,
	{
		state: LoadingState;
		attributeValues: string[];
		page: number;
		totalPages: number;
		totalCount: number;
	}
>;

interface AttributeBase {
	attributeID: string;
	uniqueAttributeID?: string;
	name: string;
	attributeType?: AttributeTypes;
}

interface Attribute extends AttributeBase {
	_id: string;
	__v?: number;
	active?: boolean;
	createdAt?: string;
	updatedAt?: string;
	isKariOnly?: boolean;
	addedManually?: boolean;
	isSizeAttribute?: boolean;
	isBlocked?: boolean;
	isNew?: boolean;
}

interface AttributeRow {
	attributeID: string;
	attributeType: string;
	name: string;
	addedManually?: boolean;
	isSizeAttribute?: boolean;
	filter?: boolean;
	field?: boolean;
	[aggregatorID: string]: string | boolean | undefined;
}

interface DisplayAttributeRow {
	row: AttributeRow;
	meta: {
		attribute: Attribute;
		compliances: Record<string, boolean>;
	};
}

interface GetAttributesResponse {
	`classified`,
}

interface EditAttributeResponse {
	`classified`,
}

interface GetAttributeValuesResponse {
	`classified`,
}

type ReducerFunction<T = undefined> = CaseReducer<AttributesState, PayloadAction<T>>;

export enum AttributeTypes {
	String,
	Number,
	Boolean,
	List,
}

export interface ComplianceInterface {
	agregatorID: string;
	attributesNames: {
		[attributeID: string]: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface PuttingNames {
	agregatorID: string;
	attributesNames: {
		[attributeID: string]: string;
	};
}

export interface DeletingNames {
	agregatorID: string;
	attributesNames: string[];
}

type FindAttribute = (attribute: Attribute) => boolean;

export type {
	AttributesState,
	Attribute,
	AttributeBase,
	AttributeValues,
	ReducerFunction,
	GetAttributesResponse,
	EditAttributeResponse,
	GetAttributeValuesResponse,
	FindAttribute,
	DisplayAttributeRow,
	AttributeRow,
};
