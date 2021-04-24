import { either, assoc, is, includes, isEmpty, isNil } from "ramda";
import { Dictionary } from "@reduxjs/toolkit";
import { EMPTY, YES, NO, NO_VALUE_LABEL, ErrorMessages, DEFAULT_PAGINATION_LIMIT } from "./consts";
import { AttributeTypes } from "../store/attributes/types";
import { ValueType } from "../store/types";

// Получение значения для отображения
export const getValue = (value: any, attributeType = AttributeTypes.String) => {
	switch (attributeType) {
		case AttributeTypes.Boolean:
			return getBooleanValue(value);
		case AttributeTypes.Number:
			return getNumberValue(value);
		default:
			return getValueWithEmpty(value);
	}
};

// Получение нормализованного значения для хранения/сохранения
export const getNormalizedValue = (value: any, attributeType: AttributeTypes) => {
	switch (attributeType) {
		case AttributeTypes.Boolean:
			return getNormalizedBooleanValue(value);
		case AttributeTypes.Number:
			return getNormalizedNumberValue(value);
		default:
			return getValueWithoutEmpty(value);
	}
};

export const getValueWithoutEmpty = (value: ValueType) => {
	if (value === EMPTY) {
		return "";
	}
	if (value === "") {
		return null;
	}
	return value;
};

const getNormalizedNumberValue = (value: any) => {
	if (value === EMPTY) {
		return "";
	}
	if (value === "" || value === null) {
		return null;
	}
	const numberValue = +value;

	return isNaN(value) ? null : numberValue;
};

export const getNormalizedBooleanValue = (value: any) => {
	switch (value) {
		case YES:
			return true;
		case NO:
			return false;
		case EMPTY:
			return "";
		case NO_VALUE_LABEL:
			return null;
		default:
			return value;
	}
};

const getNumberValue = (value: any) => {
	if (value === "") {
		return EMPTY;
	}
	return isNil(value) ? value : value.toString();
};

export const getValueWithEmpty = (value: ValueType) => {
	if (value === "") {
		return EMPTY;
	}
	return value;
};

export const getBooleanValue = (value: ValueType) => {
	switch (value) {
		case true:
			return YES;
		case false:
			return NO;
		case "":
			return EMPTY;
		default:
			return value;
	}
};

export const getValueFromStringBoolean = (value: any) => {
	switch (value) {
		case "true":
			return YES;
		case "false":
			return NO;
		case "":
			return EMPTY;
		case "null":
			return NO_VALUE_LABEL;
		default:
			return value;
	}
};

export const getStringBooleanFromValue = (value: any) => {
	switch (value) {
		case YES:
			return "true";
		case NO:
			return "false";
		case EMPTY:
			return "";
		case NO_VALUE_LABEL:
			return "null";
		default:
			return value;
	}
};
export const getValueFromActualBoolean = (value: boolean) => {
	switch (value) {
		case true:
			return YES;
		case false:
			return NO;
		default:
			return value;
	}
};

export const reorder = (list: any[], startIndex: number, endIndex: number) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

export const mapKeyToId = <T>(data: Record<string, T>, objKey = "id") =>
	Object.entries(data).map(([key, item]) => assoc(objKey, key, item));

/**
 * Not deep
 */
export const getObjectDifference = <T extends Record<string, any>>(obj1: T, obj2: T) =>
	Object.entries(obj2)?.reduce<Record<string, any>>((diff, [key, value]) => {
		if (obj1[key] === value) return diff;
		diff[key] = value;
		return diff;
	}, {});

export const getError = (
	attributeType: AttributeTypes,
	value: string,
	disabled: boolean,
	isImported: boolean
) => {
	if (disabled) {
		return false;
	}
	if (!isImported && isEmpty(value)) {
		return true;
	}
	// TODO: Временно убрал, потом будет доработка
	// if (attributeType === AttributeTypes.Boolean) {
	//   return isNil(value) || isEmpty(value);
	// }
	// if (attributeType === AttributeTypes.Number) {
	//   if (value === EMPTY) {
	//     return false;
	//   }
	//   return isNil(value) || isEmpty(value);
	// }
	return false;
};

/**
 * Валидация значения, если есть ошибка, то возвращается строка с этой ошибкой, иначе null
 * @param value Валидируемое значение
 * @param attributeType Тип атрибута
 * @param isRequired Обязательное ли поле
 */
export const hasErrors = (value: unknown, attributeType: AttributeTypes, isRequired = false) => {
	if (attributeType === AttributeTypes.Boolean) {
		if (isRequired && value === undefined) {
			return ErrorMessages.Empty;
		}

		if (!includes(value, [YES, NO, null])) {
			return ErrorMessages.Boolean;
		}
	}

	if (attributeType === AttributeTypes.Number) {
		if (value === EMPTY || value === NO_VALUE_LABEL) {
			return undefined;
		}
		if (isNaN(Number(value))) {
			return ErrorMessages.Number;
		}
		if (isRequired && isEmpty(value)) {
			return ErrorMessages.Required;
		}
	}

	return undefined;
};

/**
 * Получение сообщения об ошибке для множественного или единичного значения
 * @param value Валидируемое значение или массив значений
 * @param attributeType Тип атрибута
 * @param isRequired Обязательное ли значение
 */
export const getErrorMessage = (
	value: unknown,
	attributeType: AttributeTypes,
	isRequired = false
) => {
	if (Array.isArray(value)) {
		for (const singleValue of value) {
			const message = hasErrors(singleValue, attributeType, isRequired);

			if (message) {
				return message;
			}
		}

		return undefined;
	}

	return hasErrors(value, attributeType, isRequired);
};

export const toLowerCaseString = (value: unknown) => String(value).toLowerCase();

export const findByPropWithIndex = <T>(array: T[], prop: keyof T, value: unknown) => {
	for (let i = 0; i < array.length; i++) {
		if (array[i][prop] === value) {
			return { elem: array[i], index: i };
		}
	}

	return { elem: null, index: -1 };
};
export const calcCountPages = (total: number, limit: number) => Math.ceil(total / limit) || 1;

// export const getPagination = <T>(data: T[], defaultPage = 1): Pagination => ({
//   page: defaultPage,
//   countPages: calcCountPages(data.length, DEFAULT_PAGINATION_LIMIT),
//   total: data.length,
//   limit: DEFAULT_PAGINATION_LIMIT,
// });

export const isNilOrIsEmpty = either(isNil, isEmpty);

export const getKeyByValue = <T extends Record<string | number, unknown>>(
	obj: T,
	value: T[keyof T]
) => Object.keys(obj).find((key) => obj[key] === value);
