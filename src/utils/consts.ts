export const kariID = "kari";
export const kariEshopID = "eShopKari";
export const mobileKariID = "mobileKari";
export const sizeAttributeID = "size";
export const YES = "да";
export const NO = "нет";
export const EMPTY = "(пусто)";
export const DEFAULT_NO_OPTIONS_TEXT = "Не найдено";
export const NO_VALUE_LABEL = "(нет значения)";
export const ALL_VALUES = "(все значения)";

export const sizeAttributesIDs = [sizeAttributeID, "sizeList", "size_ru", "size_eu"];

export const replaceToNumber = (value: string) => {
	const result = value
		.replace(/,/g, ".")
		.replace(/[^\d.]/g, "")
		.match(/([0-9]+(\.[0-9]*)?)/);

	return result ? result[0] : "";
};

export const requestTimeout = 20000;

export const yesNoOptions = [YES, NO];
export const yesNoNoValueOptions = [NO_VALUE_LABEL, YES, NO];

export const DEFAULT_PAGINATION_LIMIT = 50;

export enum ErrorMessages {
	Number = "Поле должно содержать число",
	Boolean = "Поле может принимать одно из значений: да|нет",
	Required = "Поле обязательно для заполнения",
	Empty = "Поле не может быть пустым",
}
