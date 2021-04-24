// import { createBrowserHistory } from "history";
import { all, put, call, takeEvery, select } from "redux-saga/effects";
import { logger } from "../../utils/helpers";
import aggregatorsActions from "../aggregators/actions";
import aggregatorsAPI from "../aggregators/api";
import { mapOldAggregators } from "../aggregators/utils";
import attributesActions from "../attributes/actions";
import attributesAPI from "../attributes/api";
import attributesSelectors from "../attributes/selectors";
import { ThenArg } from "../types";
import ruleAttributesActions from "./actions";
import ruleAttributesAPI from "./api";
import ruleAttributesSelectors from "./selectors";

// const history = createBrowserHistory();

function* initRuleAttributesWorker() {
	try {
		// const attributeID = history.location.pathname.split("/")[2];

		const [attributesResponse, ruleAttributesRespponse, aggregatorsResponse]: [
			ThenArg<typeof attributesAPI.getList>,
			ThenArg<typeof ruleAttributesAPI.get>,
			ThenArg<typeof aggregatorsAPI.getList>
		] = yield all([
			call(attributesAPI.getList),
			call(ruleAttributesAPI.get),
			call(aggregatorsAPI.getList),
		]);

		const attributes = attributesResponse.data.result.attributes;
		const ruleAttributes = ruleAttributesRespponse.data.result.attributes;
		const aggregators = mapOldAggregators(aggregatorsResponse.data.result.agregators);

		yield all([
			put(attributesActions.getAttributesSuccess(attributes)),
			put(
				ruleAttributesActions.getRuleAttributesSuccess({
					ruleAttributes,
					attributes,
				})
			),
			put(aggregatorsActions.getAggregatorsSuccess(aggregators)),
		]);

		// if (attributeID && !ruleAttributes.find((attr) => attr.attributeID === attributeID)) {
		// 	yield put(
		// 		ruleAttributesActions.getRuleAttributesFail("Такого справочника не существует")
		// 	);
		// } else {
		// 	yield put(ruleAttributesActions.selectRuleAttribute(attributeID));
		// }
	} catch (error) {
		logger(error);
		yield put(
			ruleAttributesActions.getRuleAttributesFail("Не удалось получить список справочников")
		);
	}
}

function* addRuleAttributeWorker(
	action: ReturnType<typeof ruleAttributesActions.addRuleAttribute>
) {
	try {
		const newAttributeID = action.payload;

		const [response, attributes]: [
			ThenArg<typeof ruleAttributesAPI.add>,
			ReturnType<typeof attributesSelectors.attributes>
		] = yield all([
			call(ruleAttributesAPI.add, newAttributeID),
			select(attributesSelectors.productAttributes),
		]);

		yield put(
			ruleAttributesActions.getRuleAttributesSuccess({
				ruleAttributes: response.data.result.attributes,
				attributes,
			})
		);
		yield put(ruleAttributesActions.selectRuleAttribute(newAttributeID));
		yield put(ruleAttributesActions.closeEditDialog());
	} catch (error) {
		logger(error);
		yield put(ruleAttributesActions.changeRuleAttributeFail(error.message));
	}
}

function* removeRuleAttributeWorker(
	action: ReturnType<typeof ruleAttributesActions.removeRuleAttribute>
) {
	try {
		const attributeID = action.payload;

		const [ruleAttributesResponse, attributes, selectedRuleAttribute]: [
			ThenArg<typeof ruleAttributesAPI.get>,
			ReturnType<typeof attributesSelectors.attributes>,
			ReturnType<typeof ruleAttributesSelectors.selected>
		] = yield all([
			call(ruleAttributesAPI.remove, attributeID),
			select(attributesSelectors.productAttributes),
			select(ruleAttributesSelectors.selected),
		]);

		if (selectedRuleAttribute?.attributeID === attributeID) {
			yield put(ruleAttributesActions.selectRuleAttribute(null));
		}

		yield put(
			ruleAttributesActions.getRuleAttributesSuccess({
				ruleAttributes: ruleAttributesResponse.data.result.attributes,
				attributes,
			})
		);
	} catch (error) {
		logger(error);
		yield put(ruleAttributesActions.changeRuleAttributeFail(error.message));
	}
}

function* addConditionAttributeWorker(
	action: ReturnType<typeof ruleAttributesActions.addConditionAttribute>
) {
	try {
		const {
			payload: { attributeID, conditionAttributeID },
		} = action;

		const [response, attributes]: [
			ThenArg<typeof ruleAttributesAPI.addConditionalAttribute>,
			ReturnType<typeof attributesSelectors.productAttributes>
		] = yield all([
			call(ruleAttributesAPI.addConditionalAttribute, attributeID, conditionAttributeID),
			select(attributesSelectors.productAttributes),
		]);

		yield put(
			ruleAttributesActions.getRuleAttributesSuccess({
				ruleAttributes: response.data.result.attributes,
				attributes,
			})
		);
		yield put(ruleAttributesActions.selectRuleAttribute(attributeID));
	} catch (error) {
		logger(error);
		yield put(ruleAttributesActions.getRuleAttributesFail("Не удалось изменить правило"));
	}
}

function* removeConditionAttributeWorker(
	action: ReturnType<typeof ruleAttributesActions.removeConditionAttribute>
) {
	try {
		const attributeID = action.payload;

		const [response, attributes]: [
			ThenArg<typeof ruleAttributesAPI.removeConditionalAttribute>,
			ReturnType<typeof attributesSelectors.productAttributes>
		] = yield all([
			call(ruleAttributesAPI.removeConditionalAttribute, attributeID),
			select(attributesSelectors.productAttributes),
		]);

		yield put(
			ruleAttributesActions.getRuleAttributesSuccess({
				ruleAttributes: response.data.result.attributes,
				attributes,
			})
		);
		yield put(ruleAttributesActions.selectRuleAttribute(attributeID));
	} catch (error) {
		logger(error);
		yield put(ruleAttributesActions.getRuleAttributesFail(error.message));
	}
}

function* setRulesFiltersWorker(action: ReturnType<typeof ruleAttributesActions.setRulesFilters>) {
	// yield put(rulesActions.setFilters(action.payload));
}

function* ruleAttributesSaga() {
	yield all([
		takeEvery(ruleAttributesActions.initRuleAttributes, initRuleAttributesWorker),
		takeEvery(ruleAttributesActions.addRuleAttribute, addRuleAttributeWorker),
		takeEvery(ruleAttributesActions.removeRuleAttribute, removeRuleAttributeWorker),
		takeEvery(ruleAttributesActions.addConditionAttribute, addConditionAttributeWorker),
		takeEvery(ruleAttributesActions.removeConditionAttribute, removeConditionAttributeWorker),
		takeEvery(ruleAttributesActions.setRulesFilters, setRulesFiltersWorker),
	]);
}

export default ruleAttributesSaga;
