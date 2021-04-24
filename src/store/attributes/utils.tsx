import {
	groupBy,
	sortBy,
	prop,
	merge,
	sort,
	isEmpty,
	has,
	partition,
	trim,
	defaultTo,
	equals,
	pipe,
	where,
} from "ramda";
import { Attribute, AttributeTypes, DisplayAttributeRow, AttributeRow } from "./types";
import { AttributeGroups, AttributeTypeNames } from "./constants";
import { YES, NO } from "../../utils/consts";
import { Aggregator, Compliances, Compliance } from "../aggregators/types";
import { getKeyByValue } from "../../utils/data";
import { OpenState } from "../types";
import { RuleAttribute } from "../rule-attributes/types";

const SCROLL_SIZE = 17;
const ACTION_COLUMN_WIDTH = 40;
const MIN_COLUMN_WIDTH = 100;

export const groupAttributes = <T extends { isSizeAttribute?: boolean }>(attributes: T[]) =>
	groupBy(
		({ isSizeAttribute }) => (isSizeAttribute ? AttributeGroups.Size : AttributeGroups.Product),
		attributes
	);

export interface SortAttributesProps {
	sortProp?: keyof Attribute;
	firstAttributeID?: string;
}

export const sortAttributes = ({ sortProp, firstAttributeID }: SortAttributesProps = {}) => (
	attributes: Attribute[]
) => {
	if (sortProp) {
		attributes = sortBy(prop(sortProp))(attributes);
	}

	if (firstAttributeID) {
		attributes = sort((a, b) => {
			if (a.attributeID === b.attributeID) {
				return 0;
			}
			return a.attributeID === firstAttributeID ? -1 : 1;
		}, attributes);
	}

	return attributes;
};

export const normalizeAttributes = (attributes: Attribute[]) =>
	attributes.map(({ name = "", attributeType = AttributeTypes.String, ...attribute }) => ({
		name,
		attributeType,
		...attribute,
	}));

export const getAttributesFilters = (attributes: Attribute[]) => {
	const idSet = new Set<string>(attributes.map(({ attributeID }) => attributeID));

	return Array.from(idSet);
};

export const clearEmptyFilters = (filters: Record<string, string[]>) =>
	Object.entries(filters).reduce<Record<string, string[]>>((result, [key, values]) => {
		if (!isEmpty(values)) {
			result[key] = values;
		}

		return result;
	}, {});

const getNormalizedFilterValue = (value: string) => {
	if (value === YES) {
		return true;
	}

	if (value === NO) {
		return false;
	}

	return undefined;
};

export const makeItemIDFirst = (attributes: Attribute[]): Attribute[] => {
	const partitions = partition(({ attributeID }) => attributeID === "itemID", attributes);
	return partitions[0].concat(partitions[1]);
};

export const exportRulesDataSelector = (
	attributes: Attribute[],
	aggregators: Aggregator[],
	filters: Record<string, Attribute[] | string[]>
) => {
	attributes = makeItemIDFirst(attributes);

	const data: DisplayAttributeRow[] = [];

	attributes.forEach((attribute) => {
		const {
			attributeID,
			name,
			attributeType = AttributeTypes.String,
			addedManually,
			isSizeAttribute,
		} = attribute;

		const aggregatorCompliances: Record<string, boolean> = {};

		aggregators.forEach(({ aggregatorID, compliances = {} }) => {
			aggregatorCompliances[aggregatorID] = compliances[attribute.attributeID]?.active;
		});

		const row: DisplayAttributeRow = {
			row: {
				attributeID,
				attributeType: AttributeTypeNames[attributeType],
				name,
				addedManually,
				isSizeAttribute,
				field: false,
				filter: false,
			},
			meta: {
				attribute,
				compliances: aggregatorCompliances,
			},
		};

		row.row = merge(row.row, aggregatorCompliances) as AttributeRow;

		data.push(row);
	});

	if (isEmpty(filters)) {
		return data;
	}

	return data.filter(({ row, meta }) =>
		Object.entries(filters).every(([filterKey, filterValues]) =>
			filterValues.some((value: string | Attribute) => {
				switch (filterKey) {
					case "attributeType":
						return (
							Number(getKeyByValue(AttributeTypeNames, value as string)) ===
							meta.attribute.attributeType
						);
					case "name":
					case "attributeID":
						return sizeAttributeCondition(meta.attribute)(value);
					default:
						return row[filterKey] === getNormalizedFilterValue(value as string);
				}
			})
		)
	);
};

export const getDialogTitle = (state: OpenState, attribute: Attribute) => {
	if (state === OpenState.Add) {
		return "Создание атрибута";
	}

	if (has("name", attribute)) {
		return (
			<>
				Редактирование атрибута <b>&quot;{attribute.attributeID}&quot;</b>
				{attribute.isSizeAttribute && " (размерный)"}
			</>
		);
	}

	return "Редактирование атрибута";
};

export const mapSimpleToComplexCompliences = (
	compliancesEditable: Record<string, boolean>,
	attributeID: string,
	isSizeAttribute: boolean
) =>
	Object.entries(compliancesEditable).reduce<Compliances>((result, [agregatorID, active]) => {
		result[agregatorID] = {
			[attributeID]: {
				active,
				compliance: attributeID,
				isSizeAttribute,
			},
		};
		return result;
	}, {});

export const mapComplexToSimpleCompliances = (
	storeData: Aggregator[],
	backendData: Record<string, Record<string, Compliance>>
) =>
	storeData.map((aggr) => ({
		...aggr,
		compliances: backendData[aggr.aggregatorID],
	}));

export const byAttributeID = (attributeIDArg: string) => ({ attributeID }: Attribute) =>
	attributeIDArg === attributeID;

export const findAttributeByID = (attributeID: string) => (attribute: Attribute) =>
	attributeID === attribute.attributeID;

export const getConditionAttribute = (
	conditionalAttribute: RuleAttribute | null,
	attributes: Attribute[]
) =>
	attributes.find(
		(attribute) => attribute.attributeID === conditionalAttribute?.conditionalAttributeID
	);

export const getDefaultColumnWidth = (
	aggregators: Aggregator[],
	conditionAttribute?: Attribute
) => {
	const countColumns = 1 + aggregators.length + (conditionAttribute ? 1 : 0);
	const defaultWidth = Math.ceil(
		(window.innerWidth - ACTION_COLUMN_WIDTH - SCROLL_SIZE) / countColumns
	);

	return Math.max(defaultWidth, MIN_COLUMN_WIDTH);
};

export const mapListAttributeValues = (values: unknown) => {
	let result: string[] = [];

	if (Array.isArray(values)) {
		values.forEach((value) => {
			if (typeof value === "string") {
				result.push(trim(value));
			}
		});
	}

	if (typeof values === "string") {
		result = values.split(",").map(trim);
	}

	return result;
};

export const sizeAttributeCondition = ({
	attributeID,
	isSizeAttribute = false,
}: Pick<Attribute, "attributeID" | "isSizeAttribute">) =>
	where({
		attributeID: equals(attributeID),
		isSizeAttribute: equals(isSizeAttribute),
	});
