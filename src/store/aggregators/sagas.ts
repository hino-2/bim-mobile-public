import { all, put, call, takeEvery, select } from "redux-saga/effects";
import { isEmpty } from "ramda";
import aggregatorsActions from "./actions";
import aggregatorsAPI from "./api";
import { mapOldAggregators, mapOldAggregator, getNormalizedCommissionItems } from "./utils";
import { getErrorMessage, getRequestStatus } from "../../utils/saga";
import attributesActions from "../attributes/actions";
import attributesAPI from "../attributes/api";
import attributesSelectors from "../attributes/selectors";
import { Attribute } from "../attributes/types";
import { mapSimpleToComplexCompliences } from "../attributes/utils";
import { ThenArg } from "../types";
import { AggregatorErrors } from "./types";

function* getAggregatorsWorker() {
	try {
		const [aggregatorsResponse, attributesResponse]: [
			ThenArg<typeof aggregatorsAPI.getList>,
			ThenArg<typeof attributesAPI.getList>
		] = yield all([call(aggregatorsAPI.getList), call(attributesAPI.getList)]);
		yield put(
			attributesActions.getAttributesSuccess(attributesResponse.data.result.attributes)
		);
		yield put(
			aggregatorsActions.getAggregatorsSuccess(
				mapOldAggregators(aggregatorsResponse.data.result.agregators)
			)
		);
	} catch (error) {
		yield put(
			aggregatorsActions.getAggregatorsFail({
				message: "Не удалось получить список агрегаторов",
				status: getRequestStatus(error),
			})
		);
	}
}

function* getAggregatorWorker(action: ReturnType<typeof aggregatorsActions.getAggregator>) {
	try {
		const aggregatorID = action.payload;
		const response: ThenArg<typeof aggregatorsAPI.get> = yield call(
			aggregatorsAPI.get,
			aggregatorID
		);

		const attributes: ReturnType<typeof attributesSelectors.attributes> = yield select(
			attributesSelectors.attributes
		);

		yield put(
			aggregatorsActions.getAggregatorSuccess({
				aggregator: mapOldAggregator(response.data.result.agregator),
				commissions: getNormalizedCommissionItems(
					response.data.result.agregator.commissions || [],
					attributes
				),
			})
		);
	} catch (error) {
		const errorType: AggregatorErrors = getErrorMessage(error).match(/not found/)
			? "not_found"
			: "request";
		yield put(aggregatorsActions.getAggregatorFail(errorType));
	}
}

function* addAggregatorWorker(action: ReturnType<typeof aggregatorsActions.addAggregator>) {
	try {
		const { aggregatorID, name, isActive } = action.payload;
		const response: ThenArg<typeof aggregatorsAPI.add> = yield call(aggregatorsAPI.add, {
			agregatorID: aggregatorID,
			name: name ? name : aggregatorID,
			isActive,
		});

		yield put(
			aggregatorsActions.addAggregatorSuccess(
				mapOldAggregator(response.data.result.agregator)
			)
		);
		yield put(aggregatorsActions.closeEditDialog());
	} catch {
		yield put(aggregatorsActions.addAggregatorFail("Ошибка добавления агрегатора"));
	}
}

function* saveAggregatorWorker() {
	try {
		// const {
		//   data: { aggregatorID, commissions: oldCommissions, ...aggregator },
		//   commissions: newCommissions,
		// }: ReturnType<typeof aggregatorsSelectors.other.selected> = yield select(
		//   aggregatorsSelectors.other.selected,
		// );
		// const requests: {
		//   responseAggregator?: CallEffect<ThenArg<typeof aggregatorsAPI.edit>>;
		//   responseCommissions?: CallEffect<
		//     ThenArg<typeof aggregatorsAPI.editCommissions>
		//   >;
		// } = {};
		// const newAggregator = {
		//   name: aggregator.name,
		//   isActive: aggregator.isActive,
		// };
		// const { name, isActive }: Aggregator = yield select(
		//   aggregatorsSelectors.aggregators.byId(aggregatorID),
		// );
		// const oldAggregator = {
		//   name,
		//   isActive,
		// };
		// if (isEmpty(newAggregator.name)) {
		//   yield put(aggregatorsActions.saveAggregatorFail('name'));
		//   yield cancel();
		// }
		// const clearNewCommissions = clearEmptyCommissionItems(newCommissions);
		// const errorCommissionItem = getErrorCommissionItem(clearNewCommissions);
		// if (errorCommissionItem) {
		//   yield put(aggregatorsActions.saveAggregatorFail('commissions'));
		//   yield cancel();
		// }
		// if (!equals(oldAggregator, newAggregator)) {
		//   requests.responseAggregator = call(
		//     aggregatorsAPI.edit,
		//     assoc('agregatorID', aggregatorID, aggregator),
		//   );
		// }
		// const requestNewCommissions = getRequestCommissionItems(
		//   clearNewCommissions,
		// );
		// if (!equals(oldCommissions, requestNewCommissions)) {
		//   requests.responseCommissions = call(aggregatorsAPI.editCommissions, {
		//     aggregatorID,
		//     commissions: requestNewCommissions,
		//   });
		// }
		// const {
		//   responseAggregator,
		//   responseCommissions,
		// }: {
		//   responseAggregator: ThenArg<typeof aggregatorsAPI.edit>;
		//   responseCommissions: ThenArg<typeof aggregatorsAPI.editCommissions>;
		// } = yield all(requests);
		// yield put(
		//   aggregatorsActions.saveAggregatorSuccess({
		//     aggregator: responseAggregator
		//       ? mapOldAggregator(responseAggregator.data.result.agregator)
		//       : {
		//         aggregatorID,
		//         commissions: responseCommissions.data.result.commissions,
		//         ...aggregator,
		//       },
		//     commissions: clearNewCommissions,
		//   }),
		// );
	} catch {
		yield put(aggregatorsActions.saveAggregatorFail("request"));
	}
}

export function* editComliances(
	compliancesEditable: ReturnType<typeof attributesSelectors.editDialogEditableCompliences>,
	{ attributeID = "", isSizeAttribute = false }: Partial<Attribute>
) {
	if (!isEmpty(compliancesEditable)) {
		const responseCompl: ThenArg<typeof aggregatorsAPI.editComliances> = yield call(
			aggregatorsAPI.editComliances,
			mapSimpleToComplexCompliences(compliancesEditable, attributeID, isSizeAttribute)
		);
		yield put(aggregatorsActions.setAggregatorCompliance(responseCompl.data.compliances));
	}
}

function* selectWorker(action: ReturnType<typeof aggregatorsActions.select>) {
	yield put(aggregatorsActions.getAggregator(action.payload));
}

function openEditDialogWorker() {}

function* aggreagtorsSaga() {
	yield all([
		takeEvery(aggregatorsActions.getAggregators, getAggregatorsWorker),
		takeEvery(aggregatorsActions.getAggregator, getAggregatorWorker),
		takeEvery(aggregatorsActions.addAggregator, addAggregatorWorker),
		takeEvery(aggregatorsActions.saveAggregator, saveAggregatorWorker),
		takeEvery(aggregatorsActions.select, selectWorker),
		takeEvery(aggregatorsActions.openEditDialog, openEditDialogWorker),
	]);
}

export default aggreagtorsSaga;
