import { createAction } from "@reduxjs/toolkit";
import { tasksNamespace } from "./constants";
import tasksSlice from "./index";
import { Schedule, OperationsToAdd } from "./types";

const removeTask = createAction<string>(tasksNamespace + "/removeTask");

const addSchedule = createAction<OperationsToAdd>(tasksNamespace + "/addSchedule");

const editSchedule = createAction<Schedule>(tasksNamespace + "/editSchedule");

const removeSchedule = createAction<Schedule>(tasksNamespace + "/removeSchedule");

const startSchedule = createAction<string>(tasksNamespace + "/startSchedule");

const tasksActions = {
	removeTask,

	addSchedule,
	editSchedule,
	removeSchedule,
	startSchedule,

	...tasksSlice.actions,
};

export default tasksActions;
