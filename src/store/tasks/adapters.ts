import { createEntityAdapter } from "@reduxjs/toolkit";
import { AllowedTask, Schedule } from "./types";

const allowedTasksAdapter = createEntityAdapter<AllowedTask>({
	selectId: (aTask) => aTask.id,
	sortComparer: (a, b) => a.id.localeCompare(b.id),
});

const schedulesAdapter = createEntityAdapter<Schedule>({
	selectId: (sched) => sched._id,
	sortComparer: (a, b) => a.taskType.localeCompare(b.taskType),
});

export { allowedTasksAdapter, schedulesAdapter };
