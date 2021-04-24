import { assoc, sort, isNil, isEmpty, reject, either, prepend, curry } from "ramda";
import { OldAggregator, Aggregator, CommissionItem, ResponseCommissionItem } from "./types";
import { nanoid } from "@reduxjs/toolkit";
import { aggregatorCommon, firstSortAggregatorsIDs } from "./constants";
import { kariID } from "../../utils/consts";
import {
	getValueFromStringBoolean,
	getValueWithEmpty,
	getStringBooleanFromValue,
	getValueWithoutEmpty,
} from "../../utils/data";
import { Attribute, AttributeTypes } from "../attributes/types";
import { sizeAttributeCondition } from "../attributes/utils";

export const mapOldAggregator = ({ agregatorID, ...aggregator }: OldAggregator): Aggregator =>
	assoc("aggregatorID", agregatorID, aggregator);

export const mapOldAggregators = (aggregators: OldAggregator[]) =>
	aggregators.map(mapOldAggregator);

/**
 * Сортровка агрегаторов (const не работает!!!)
 * @param a
 * @param b
 */
export function sortComparer(a: Aggregator, b: Aggregator) {
	if (a.aggregatorID === b.aggregatorID) {
		return 0;
	}

	const indexA = firstSortAggregatorsIDs.indexOf(a.aggregatorID);
	const indexB = firstSortAggregatorsIDs.indexOf(b.aggregatorID);

	if (indexA === -1 || indexB === -1) {
		return indexB - indexA;
	}

	return 1;
}

export const sortAggregators = (
	sortProp: keyof Aggregator | null = null,
	firstAggregatorIDs: string[] = [],
	withoutKari = false
) => (aggregators: Aggregator[]) => {
	if (sortProp) {
		aggregators = sort(
			(a, b) => (a[sortProp] as string).localeCompare(b[sortProp] as string),
			aggregators
		);
	}

	if (firstAggregatorIDs.length > 0) {
		aggregators = sort((a, b) => {
			if (a.aggregatorID === b.aggregatorID) {
				return 0;
			}

			const indexA = firstAggregatorIDs.indexOf(a.aggregatorID);
			const indexB = firstAggregatorIDs.indexOf(b.aggregatorID);

			return indexA === -1 || indexB === -1 ? indexB - indexA : 1;
		}, aggregators);
	}

	if (withoutKari) {
		aggregators = reject(({ aggregatorID }) => aggregatorID === kariID, aggregators);
	}

	return aggregators;
};

export const getNormalizedCommissionItems = (
	commissions: ResponseCommissionItem[],
	attributes: Attribute[]
) => {
	const items: CommissionItem[] = [];

	commissions?.forEach(({ isSizeAttribute, attributeID, commission, values }) => {
		const attribute = attributes.find(
			sizeAttributeCondition({
				attributeID: attributeID,
				isSizeAttribute,
			})
		);

		if (attribute) {
			const isBoolean = attribute?.attributeType === AttributeTypes.Boolean;
			const normalizedValues = values.map(
				isBoolean ? getValueFromStringBoolean : getValueWithEmpty
			);

			items.push({
				id: nanoid(),
				attribute,
				attributeID,
				values: normalizedValues,
				isSizeAttribute,
				commission: String(commission),
			});
		}
	});

	return items;
};

export const getRequestCommissionItems = (commissions: CommissionItem[]) => {
	const responseCommissions: ResponseCommissionItem[] = [];

	commissions.forEach(({ attributeID, values, commission, attribute }) => {
		if (attributeID) {
			const isBoolean = attribute?.attributeType === AttributeTypes.Boolean;
			responseCommissions.push({
				attributeID,
				isSizeAttribute: attribute?.isSizeAttribute || false,
				commission: Number(commission),
				values: values.map(isBoolean ? getStringBooleanFromValue : getValueWithoutEmpty),
			});
		}
	});

	return responseCommissions;
};

export const getDefaultCommissionItem = (): CommissionItem => ({
	id: nanoid(),
	attribute: null,
	attributeID: null,
	isSizeAttribute: null,
	commission: null,
	values: [],
});

export const isNilOrIsEmpty = either(isNil, isEmpty);

export const isEmptyCommissionItem = ({ attribute, commission, values }: CommissionItem) =>
	isNil(attribute) && isNilOrIsEmpty(commission) && isEmpty(values);

export const clearEmptyCommissionItems = reject(isEmptyCommissionItem);

export const getErrorCommissionItem = (commissions: CommissionItem[]) =>
	commissions.find(
		({ attribute, commission, values }) =>
			isNil(attribute) || isNilOrIsEmpty(commission) || isEmpty(values)
	);

export const getAggregatorOptionLabel = (aggregator: Aggregator) => aggregator.name;

export const getActiveAggregators = (aggregators: Aggregator[]) =>
	aggregators.filter(({ isActive }) => isActive);

export const rejectKariAggregator = (aggregators: Aggregator[]) =>
	aggregators.filter(({ aggregatorID }) => aggregatorID !== kariID);

export const findAggregatorByID = curry((aggregatorID: string, aggregators: Aggregator[]) =>
	aggregators.find((aggregator) => aggregator.aggregatorID === aggregatorID)
);

export const prependCommonAggregator = prepend(aggregatorCommon);
