import { isEmpty, path, sortWith, descend, ascend, concat, isNil, append } from "ramda";
import { getStringPeriodBySeconds, parseDate, numToMs } from "../../utils/date";
import { Aggregator } from "../aggregators/types";
import { TaskTypes, StatusTypeNames, TaskStatus, tasksNamespace } from "./constants";
import {
	Task,
	TasksCount,
	DisplayTask,
	UpdateTasksResponse,
	AllowedTasks,
	Periodic,
	DateType,
	AllowedTask,
	Schedule,
} from "./types";

export const FIXED_COLUMN_WIDTH = 250;
export const ID_COLUMN_WIDTH = 230;

const sortByDate = (taskType: TaskTypes) =>
	sortWith<Task>(
		taskType === TaskTypes.Active
			? [
					ascend((task) => +new Date(task.createdAt)),
					ascend((task) => +new Date(task.endTime)),
			  ]
			: [
					descend((task) => +new Date(task.createdAt)),
					descend((task) => +new Date(task.endTime)),
			  ]
	);

export const getSearchParams = (type: TaskTypes, search: string) => {
	const searchParams = new URLSearchParams(search);

	const page = Number(searchParams.get("page")) || 1;

	searchParams.set("page", (page - 1).toString());
	searchParams.set("limit", "50");

	return {
		params: `${type ? `/${type}` : ""}?${searchParams}`,
		page,
	};
};

export const mapTasks = (
	tasks: Task[],
	allowedTasks: AllowedTasks,
	aggregatorsFilter: Aggregator[] = [],
	taskType: TaskTypes
) =>
	sortByDate(taskType)(
		tasks
			.filter(({ status }) => {
				switch (taskType) {
					case TaskTypes.Active:
						return status === TaskStatus.Queue || status === TaskStatus.Pending;
					case TaskTypes.Executed:
						return status === TaskStatus.Executed;
					case TaskTypes.Failed:
						return status === TaskStatus.Failed;
					default:
						return true;
				}
			})
			.filter((task) => {
				if (isEmpty(aggregatorsFilter)) {
					return true;
				}
				return aggregatorsFilter.some(({ aggregatorID }) => {
					const allowedTaskAggregatorID = path(
						[task.type, "tags", "agregatorID"],
						allowedTasks
					);
					if (aggregatorID === "common") {
						return isNil(allowedTaskAggregatorID);
					}
					return allowedTaskAggregatorID === aggregatorID;
				});
			})
	).map<DisplayTask>(({ _id, createdAt, beginTime, endTime, durationInSec, status, type }) => {
		const isActiveTask = status === TaskStatus.Queue || status === TaskStatus.Pending;

		return {
			_id,
			duration:
				!isActiveTask && durationInSec ? getStringPeriodBySeconds(durationInSec) : "0",
			createdAt: parseDate(createdAt),
			beginTime: parseDate(beginTime),
			endTime: isActiveTask ? undefined : parseDate(endTime),
			aliasName: allowedTasks[type]?.aliasName || type,
			status: StatusTypeNames[status],
		};
	});

export const getTotalTasksByType = (count: TasksCount, tasksType: TaskTypes) => {
	switch (tasksType) {
		case TaskTypes.Active:
			return count.activeQty;
		case TaskTypes.Executed:
			return count.executedQty;
		case TaskTypes.Failed:
			return count.failedQty;
		default:
			return count.allQty;
	}
};

const findTask = (task: Task, list: Task[]) => list.find(({ _id }) => _id === task._id);

export const getUpdatedTasks = (
	tasks: Task[],
	{
		created = [],
		updated = [],
		deleted = [],
	}: Pick<UpdateTasksResponse, "created" | "updated" | "deleted">
): Task[] => {
	let updatedTasks = concat(tasks, created);

	if (!isEmpty(updated)) {
		updatedTasks = updatedTasks.map((task) => findTask(task, updated) || task);
	}

	if (!isEmpty(deleted)) {
		updatedTasks = updatedTasks.filter((task) => !findTask(task, deleted));
	}

	return updatedTasks;
};

const calcHour = (hour: number, offset: number) => {
	const offsetted = hour + offset;
	if (offsetted > 24) {
		return offsetted - 24;
	}
	if (offsetted < 0) {
		return offsetted + 24;
	}
	return offsetted;
};

export const parsePeriodic = (periodic?: Periodic | null) => {
	let cronSchedule: string | undefined, runEveryMs: number | undefined;

	if (periodic) {
		const { period, time, timeUnit } = periodic;

		if (timeUnit === DateType.day && time) {
			const offset = new Date().getTimezoneOffset() / 60;
			const [hour, minute] = time.split(":");
			cronSchedule = `0 ${+minute} ${calcHour(+hour, offset)} * * *`;
		} else {
			runEveryMs = period ? numToMs(period, timeUnit) : 0;
		}
	}
	return {
		cronSchedule,
		runEveryMs,
	};
};

export const filterSchedules = (
	schedules: Schedule[],
	allowedTasks: AllowedTask[],
	filters: Record<string, Aggregator[]>
) => {
	if (isEmpty(filters)) {
		return schedules;
	}
	return schedules;
	// const aggregatorNames = Object.values(filters)[0].reduce(
	//   (res, { aggregatorID }) => append(aggregatorID, res),
	//   [],
	// );

	// const taskIDs = allowedTasks.reduce((res, allowedTask) => {
	//   const aggregatorID = allowedTask.tags?.agregatorID;

	//   if (aggregatorID) {
	//     return aggregatorNames.includes(aggregatorID)
	//       ? append(allowedTask.id, res)
	//       : res;
	//   } else {
	//     return aggregatorNames.includes('common')
	//       ? append(allowedTask.id, res)
	//       : res;
	//   }
	// }, []);

	// return schedules.filter(schedule => taskIDs.includes(schedule.taskType));
};
