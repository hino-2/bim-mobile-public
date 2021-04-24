import { reject, eqProps, map, when, always, propEq } from "ramda";
import { ValueOf } from "../store/types";

/**
 * Удаление элемента из массива по значению свойства объекта
 * @param prop Свойство объекта
 * @param element Объект по свойству которого будет сравнение
 * @param list Массив для перебора
 */
export const removeItemByProp = <T extends Record<string, unknown>>(
	prop: string,
	element: T,
	list: T[]
) => reject(eqProps(prop, element), list);

/**
 * Удаление элемента из массива по значению
 * @param prop Свойство объекта
 * @param value Значение по которому будет удаление
 * @param list Массив для перебора
 */
export const removeItemByValue = <T extends Record<string, unknown>>(
	prop: string,
	value: ValueOf<T>,
	list: T[]
) => reject<T>(propEq(prop, value), list);

/**
 * Обновление элемента массива
 * @param prop Свойство объекта
 * @param element Объект для замены
 * @param list Массив для перебора
 */
export const updateItemByProp = <T>(prop: string, element: T, list: T[]) =>
	map(when(eqProps(prop, element), always(element)), list);

/**
 * Поиск индекса элемента в массиве из объектов
 * @param key Ключ объекта
 * @param array Массив объектов
 * @param elem Элемент массива
 */
export const getIndex = <T>(key: keyof T) => (array: T[], elem: T | null) =>
	elem ? array.findIndex((item) => item[key] === elem[key]) : -1;
