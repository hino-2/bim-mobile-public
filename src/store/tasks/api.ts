import axios from "axios";
import { GetAllowedTasksResponse, GetSchedulesResponse, Schedule, GetTasksResponse } from "./types";

const tasksAPI = {
	getTasks: `classified`,
	removeTask: `classified`,
	getAllowedTasks: `classified`,

	getSchedules: `classified`,

	addSchedule: `classified`,

	editSchedule: `classified`,

	removeSchedule: `classified`,

	run: `classified`,
};

export default tasksAPI;
