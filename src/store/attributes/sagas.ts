import { all, put, call, takeEvery, debounce, cancel, select, delay } from "redux-saga/effects";
import { isNil, mergeRight } from "ramda";
import attributesAPI from "./api";
import { AttributeTypes, Attribute } from "./types";
import attributesActions from "./actions";
import attributesSelectors from "./selectors";
import { attributesNamespase } from "./constants";
import { getObjectDifference } from "../../utils/data";
import { logger } from "../../utils/helpers";
import aggregatorsActions from "../aggregators/actions";
import aggregatorsAPI from "../aggregators/api";
import { editComliances } from "../aggregators/sagas";
import { mapOldAggregators } from "../aggregators/utils";
// import appActions from '../app/actions';
import { OpenState, ThenArg } from "../types";
import ruleAttributesActions from "../rule-attributes/actions";
import ruleAttributesAPI from "../rule-attributes/api";

function* initAttributesWorker() {
	try {
		const [aggregatorsResponse, ruleAttributesResponse, attributesResponse]: [
			ThenArg<typeof aggregatorsAPI.getList>,
			ThenArg<typeof ruleAttributesAPI.get>,
			ThenArg<typeof attributesAPI.getList>
		] = yield all([
			call(aggregatorsAPI.getList),
			call(ruleAttributesAPI.get),
			call(attributesAPI.getList),
		]);

		yield all([
			put(attributesActions.initColumns()),
			put(
				aggregatorsActions.getAggregatorsSuccess(
					mapOldAggregators(aggregatorsResponse.data.result.agregators)
				)
			),
			put(
				ruleAttributesActions.getRuleAttributesSuccess({
					ruleAttributes: ruleAttributesResponse.data.result.attributes,
					attributes: attributesResponse.data.result.attributes,
				})
			),
			put(attributesActions.getAttributesSuccess(attributesResponse.data.result.attributes)),
		]);
	} catch {
		yield put(attributesActions.getAttributesFail("Ошибка получения атрибутов"));
	}
}

function* getAttributesWorker() {
	try {
		const response: ThenArg<typeof attributesAPI.getList> = yield call(attributesAPI.getList);
		yield put(attributesActions.getAttributesSuccess(response.data.result.attributes));
	} catch {
		yield put(attributesActions.getAttributesFail("Ошибка получения атрибутов"));
	}
}

function* removeAttributeWorker(action: ReturnType<typeof attributesActions.removeAttribute>) {
	try {
		const { attributeID, isSizeAttribute, _id } = action.payload.meta.attribute;

		yield call(attributesAPI.remove, attributeID, isSizeAttribute);
		yield put(attributesActions.removeAttributeSuccess(_id));
	} catch {
		// yield put(
		//   appActions.addNotification({
		//     message: 'Ошибка удаления атрибута атрибута',
		//     options: {
		//       variant: 'error',
		//     },
		//   }),
		// );
	}
}

function* getAttributeValuesWorker(
	action: ReturnType<typeof attributesActions.getAttributeValues>
) {
	try {
		const value = action.payload.value ? action.payload.value : "";
		const attribute = action.payload.attribute;

		const attributeType = attribute ? attribute.attributeType : AttributeTypes.String;

		if (isNil(attribute) || isNil(value) || attributeType === AttributeTypes.Boolean) {
			yield put(
				attributesActions.getAttributeValuesFail(action.payload.attribute.attributeID)
			);
			yield cancel();
		}

		const {
			page,
		}: ReturnType<ReturnType<typeof attributesSelectors.attributeValuesById>> = yield select(
			attributesSelectors.attributeValuesById(attribute.attributeID)
		);

		const response: ThenArg<typeof attributesAPI.getAttributeValues> = yield call(
			attributesAPI.getAttributeValues,
			attribute.attributeID,
			value,
			// attribute.isSizeAttribute, // будет в следующей задаче
			page
		);

		if (response) {
			yield put(
				attributesActions.getAttributeValuesSuccess({
					attribute,
					// response.data.result для обратной совместимости met-692 TODO: потом вырезать
					values: response.data.result?.attributeValues || response.data.result || [],
					page,
					totalPages: response.data.result?.totalPages || 1,
					totalCount: response.data.result?.totalCount || 0,
				})
			);
		}
	} catch {
		yield all([
			put(attributesActions.getAttributeValuesFail(action.payload.attribute.attributeID)),
			// put(
			//   appActions.addNotification({
			//     message: 'Ошибка получения доступных значений',
			//     options: { variant: 'error' },
			//   }),
			// ),
		]);
	}
}

function* addAttribute(
	attributeEditable: Partial<ReturnType<typeof attributesSelectors.editDialogEditableAttribute>>
) {
	if (attributeEditable) {
		const responseAttr: ThenArg<typeof attributesAPI.add> = yield call(
			attributesAPI.add,
			attributeEditable
		);
		yield put(attributesActions.addAttributeSuccess(responseAttr.data.result.attribute));
	}
}

function* editAttribute(attributeEditable: Partial<Attribute>) {
	if (attributeEditable.name) {
		const responseAttr: ThenArg<typeof attributesAPI.edit> = yield call(attributesAPI.edit, {
			attributeID: attributeEditable.attributeID,
			isSizeAttribute: attributeEditable.isSizeAttribute,
			name: attributeEditable.name,
		});
		yield put(
			attributesActions.editAttributeSuccess({
				changes: responseAttr.data.result.attribute,
				id: attributeEditable._id || "",
			})
		);
	}
}

function* saveExportRulesAttributeWorker() {
	try {
		const {
			open,
			currentRow: { attribute: attributeCurrent, compliances: compliancesCurrent },
			editableRow: { attribute: attributeEditable, compliances: compliancesEditable },
		}: ReturnType<typeof attributesSelectors.editDialog> = yield select(
			attributesSelectors.editDialog
		);

		const attributeNew: Partial<Attribute> = { ...attributeEditable };

		if (open === OpenState.Add) {
			if (!attributeNew.name) {
				attributeNew.name = attributeNew.attributeID;
			}

			yield all([
				addAttribute(attributeNew),
				editComliances(compliancesEditable, attributeNew),
			]);
		}

		if (open === OpenState.Edit) {
			if (attributeCurrent) {
				const edits: unknown[] = [
					editComliances(
						getObjectDifference(compliancesCurrent, compliancesEditable),
						attributeNew
					),
				];

				if (attributeCurrent.name !== attributeNew.name) {
					edits.push(editAttribute(mergeRight(attributeCurrent, attributeNew)));
				}

				yield all(edits);
			}
		}

		yield put(attributesActions.saveEditDialogExportRulesAttributeSuccess());
	} catch (error) {
		logger(error);

		const errorMessage = error.response?.data?.message ?? "Не удалось добавить атрибут";
		const actions = [];

		if (errorMessage.match(/Атрибут с таким ID уже существует/)) {
			actions.push(
				put(attributesActions.saveEditDialogExportRulesAttributeFail(errorMessage))
			);
		} else {
			actions.push(
				put(attributesActions.saveEditDialogExportRulesAttributeFail(null))
				// put(
				//   appActions.addNotification({
				//     message: errorMessage,
				//     options: {
				//       variant: 'error',
				//     },
				//   }),
				// ),
			);
		}

		yield all(actions);
	}
}

function* getDebounceAttributeValues(
	action: ReturnType<typeof attributesActions.getDebounceAttributeValues>
) {
	yield put(attributesActions.getAttributeValues(action.payload));
}

function* openEditDialogWorker(action: ReturnType<typeof attributesActions.openEditDialog>) {
	yield delay(300);
	const aggregatorRow = document.querySelector(`#aggregator_${action.payload.aggregatorID}`);
	if (aggregatorRow) aggregatorRow.scrollIntoView();
}

function* attributesSaga() {
	yield all([
		takeEvery(attributesActions.initAttributes, initAttributesWorker),
		takeEvery(attributesActions.getAttributes, getAttributesWorker),
		takeEvery(attributesActions.removeAttribute, removeAttributeWorker),
		takeEvery(
			[attributesActions.getAttributeValues, attributesActions.getNextAttributeValues],
			getAttributeValuesWorker
		),
		takeEvery(
			attributesActions.saveEditDialogExportRulesAttribute,
			saveExportRulesAttributeWorker
		),
		debounce(600, attributesActions.getDebounceAttributeValues, getDebounceAttributeValues),
		takeEvery(attributesActions.openEditDialog, openEditDialogWorker),
	]);
}

export default attributesSaga;
