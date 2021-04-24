import { all, fork } from "redux-saga/effects";
import aggreagtorsSaga from "./aggregators/sagas";
import appSaga from "./app/saga";
import attributesSaga from "./attributes/sagas";
import ruleAttributesSaga from "./rule-attributes/saga";
import tasksSaga from "./tasks/sagas";
import usersSaga from "./users/sagas";

function* rootSaga() {
	yield all([
		// fork(exportRulesSaga),
		// fork(hierarchyTemplatesSaga),
		// fork(filesSaga),
		fork(ruleAttributesSaga),
		// fork(rulesSaga),
		fork(appSaga),
		// fork(webSocketSaga),
		// fork(itemsSaga),
		// fork(sizesSaga),
		fork(tasksSaga),
		fork(attributesSaga),
		// fork(conditionsSaga),
		fork(aggreagtorsSaga),
		fork(usersSaga),
	]);
}

export default rootSaga;
