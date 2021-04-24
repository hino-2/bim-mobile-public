import { all, put, call, takeEvery, select } from "redux-saga/effects";
import { path, pathOr } from "ramda";
import { getRequestStatus } from "../../utils/saga";
import aggregatorsActions from "../aggregators/actions";
import aggregatorsAPI from "../aggregators/api";
import { mapOldAggregators } from "../aggregators/utils";
import appActions from "../app/actions";
import { appSelectors } from "../app/selectors";
import { OpenState, ThenArg } from "../types";
import tasksActions from "./actions";
import tasksAPI from "./api";
import tasksSelectors from "./selectors";
import { getSearchParams, parsePeriodic } from "./utils";
import attributesActions from "../attributes/actions";
import attributesAPI from "../attributes/api";
import { Schedule } from "./types";

function* getTasksDataWorker() {
	try {
		const [allowedTasksResponce, aggregatorsResponse, attributesResponse, schedulesResponce]: [
			ThenArg<typeof tasksAPI.getAllowedTasks>,
			ThenArg<typeof aggregatorsAPI.getList>,
			ThenArg<typeof attributesAPI.getList>,
			ThenArg<typeof tasksAPI.getSchedules>
		] = yield all([
			call(tasksAPI.getAllowedTasks),
			call(aggregatorsAPI.getList),
			call(attributesAPI.getList),
			call(tasksAPI.getSchedules),
		]);

		yield all([
			put(tasksActions.getAllowedTasksSuccess(allowedTasksResponce.data)),
			put(
				aggregatorsActions.getAggregatorsSuccess(
					mapOldAggregators(aggregatorsResponse.data.result.agregators)
				)
			),
			put(attributesActions.getAttributesSuccess(attributesResponse.data.result.attributes)),
			put(tasksActions.getSchedulesSuccess(schedulesResponce.data)),
		]);
	} catch (error) {
		yield put(
			tasksActions.getAllowedTasksFail({
				message: "Не удалось получить список операций",
				status: getRequestStatus(error),
			})
		);
	}
}

function* addScheduleWorker(action: ReturnType<typeof tasksActions.addSchedule>) {
	try {
		const { taskTypes, cronSchedule, runEveryMs } = action.payload;

		yield all(
			taskTypes.map((taskType) =>
				call(tasksAPI.addSchedule, {
					taskType,
					cronSchedule,
					runEveryMs,
				})
			)
		);

		const { data }: ThenArg<typeof tasksAPI.getSchedules> = yield call(tasksAPI.getSchedules);
		yield put(tasksActions.getSchedulesSuccess(data));
	} catch (error) {
		// yield put(
		//   appActions.addNotification({
		//     message: 'Не удалось добавить задачу',
		//     options: { variant: 'error' },
		//   }),
		// );
	}
}

function* removeScheduleWorker(action: ReturnType<typeof tasksActions.removeSchedule>) {
	try {
		const schedule = action.payload;

		yield call(tasksAPI.removeSchedule, schedule);

		const { data }: ThenArg<typeof tasksAPI.getSchedules> = yield call(tasksAPI.getSchedules);
		yield put(tasksActions.getSchedulesSuccess(data));
	} catch (error) {
		// yield put(
		//   appActions.addNotification({
		//     message: 'Не удалось удалить задачу',
		//     options: { variant: 'error' },
		//   }),
		// );
	}
}

function* editScheduleWorker(action: ReturnType<typeof tasksActions.editSchedule>) {
	try {
		const schedule = action.payload;

		yield call(tasksAPI.editSchedule, schedule);

		const { data }: ThenArg<typeof tasksAPI.getSchedules> = yield call(tasksAPI.getSchedules);
		yield put(tasksActions.getSchedulesSuccess(data));
	} catch (error) {
		// yield put(
		//   appActions.addNotification({
		//     message: 'Не удалось изменить задачу',
		//     options: { variant: 'error' },
		//   }),
		// );
	}
}

function* getTasksWorker(action: ReturnType<typeof tasksActions.getTasks>) {
	try {
		const { taskType, search } = action.payload;

		const { params, page } = getSearchParams(taskType, search);

		const { data }: ThenArg<typeof tasksAPI.getTasks> = yield call(tasksAPI.getTasks, params);

		yield put(
			tasksActions.getTasksSuccess({
				data,
				page,
				taskType,
			})
		);
	} catch (error) {
		yield put(
			tasksActions.getTasksFail({
				message: "Не удалось получить список задач",
				status: pathOr(500, ["response", "status"], error),
			})
		);
	}
}

function* removeTaskWorker(action: ReturnType<typeof tasksActions.removeTask>) {
	try {
		const taskId = action.payload;
		yield call(tasksAPI.removeTask, taskId);
		yield put(tasksActions.removeTaskSuccess(taskId));
	} catch {
		// yield put(
		//   appActions.addNotification({
		//     message: 'Не удалось удалить задачу',
		//     options: { variant: 'error' },
		//   }),
		// );
	}
}

// function changePageWorker(action: ReturnType<typeof tasksActions.setPage>) {
//   onChangePage(action.payload);
// }

function* saveEditDialogWorker() {
	const editDialog: ReturnType<typeof tasksSelectors.editDialog> = yield select(
		tasksSelectors.editDialog
	);
	const userLogin: ReturnType<typeof appSelectors.login> = yield select(appSelectors.login);

	const {
		openState,
		editableRow: { schedule, periodic },
	} = editDialog;

	const { description, blockedByTasks, taskType = "", _id = "" } = schedule;

	const { cronSchedule, runEveryMs } = parsePeriodic(periodic);

	try {
		if (openState === OpenState.Add) {
			const newSchedule: Omit<Schedule, "_id"> = {
				description,
				blockedByTasks,
				userLogin,
				taskType,
				cronSchedule,
				runEveryMs,
			};

			yield call(tasksAPI.addSchedule, newSchedule);
		} else {
			const newSchedule: Schedule = {
				...schedule,
				_id,
				taskType,
				userLogin,
				cronSchedule,
				runEveryMs,
			};

			yield call(tasksAPI.editSchedule, newSchedule);
		}

		yield all([put(tasksActions.closeEditDialog()), put(tasksActions.getTasksData())]);
	} catch (error) {
		yield all([
			// put(
			//   appActions.addNotification({
			//     message: `Не удалось ${
			//       openState === OpenDialogState.Add ? 'добавить' : 'изменить'
			//     } задачу`,
			//     options: { variant: 'error' },
			//   }),
			// ),
			put(tasksActions.saveEditDialogFail()),
		]);
	}
}

function* startScheduleWorker(action: ReturnType<typeof tasksActions.startSchedule>) {
	try {
		yield call(tasksAPI.run, action.payload);

		// yield put(
		//   appActions.addNotification({
		//     message: 'Операция запущена',
		//     options: {
		//       variant: 'success',
		//     },
		//   }),
		// );
	} catch {
		// yield put(
		//   appActions.addNotification({
		//     message: 'Не удалось запустить операцию',
		//     options: {
		//       variant: 'error',
		//     },
		//   }),
		// );
	}
}

function* getAllowedTasksWorker() {
	try {
		const response: ThenArg<typeof tasksAPI.getAllowedTasks> = yield call(
			tasksAPI.getAllowedTasks
		);

		yield put(tasksActions.getAllowedTasksSuccess(response.data));
	} catch (error) {
		yield put(
			tasksActions.getAllowedTasksFail({
				message: "Не удалось получить типы выгрузок",
				status: getRequestStatus(error),
			})
		);
	}
}

function* tasksSaga() {
	yield all([
		takeEvery(tasksActions.getTasksData, getTasksDataWorker),
		takeEvery(tasksActions.getTasks, getTasksWorker),
		takeEvery(tasksActions.addSchedule, addScheduleWorker),
		takeEvery(tasksActions.removeSchedule, removeScheduleWorker),
		takeEvery(tasksActions.editSchedule, editScheduleWorker),
		takeEvery(tasksActions.removeTask, removeTaskWorker),
		// takeEvery(tasksActions.setPage, changePageWorker),
		takeEvery(tasksActions.saveEditDialog, saveEditDialogWorker),
		takeEvery(tasksActions.startSchedule, startScheduleWorker),
		takeEvery(tasksActions.getAllowedTasks, getAllowedTasksWorker),
	]);
}

export default tasksSaga;
