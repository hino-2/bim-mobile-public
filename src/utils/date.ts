import { DateType } from "../store/tasks/types";

export const getStringPeriodBySeconds = (seconds: number) => {
	if (seconds < 60) {
		const floorSeconds = Math.floor(seconds);

		return `${floorSeconds} секунд${getEnding(floorSeconds, "а", "ы")}`;
	}

	const period: string[] = [];

	const minutes = seconds / 60;
	const hours = minutes / 60;
	const days = hours / 24;

	if (days >= 1) {
		period.push(`${Math.floor(days)} д`);
	}

	if (hours >= 1) {
		const remainingHours = Math.floor(hours > 23 ? (seconds % 86400) / 3600 : hours);

		if (remainingHours) {
			period.push(`${remainingHours} ч`);
		}
	}

	if (minutes >= 1 || seconds % 3600 >= 1) {
		const remainingMinutes = Math.floor(minutes > 59 ? (seconds % 3600) / 60 : minutes);

		if (remainingMinutes) {
			period.push(`${remainingMinutes} мин`);
		}
	}

	const remainingSeconds = seconds % 60;

	if (remainingSeconds) {
		period.push(`${Math.floor(remainingSeconds)} сек`);
	}

	return period.join(" ");
};

export const convertCronToString = (cronExpression: string) => {
	const cron = cronExpression.split(" ");

	const date = new Date().setHours(+cron[2], +cron[1]);
	const offset = new Date().getTimezoneOffset() * 60 * 1000;
	const dateWithOffset = new Date(+date - offset);
	const minutes = dateWithOffset.getMinutes().toString().padStart(2, "0");
	const hours = dateWithOffset.getHours().toString().padStart(2, "0");

	return hours + ":" + minutes;
};

export const periodToHumanString = (period: number | string) => {
	if (typeof period === "number") {
		return "Раз в " + getStringPeriodBySeconds(period / 1000);
	}

	if (typeof period === "string") {
		return "Каждый день в " + convertCronToString(period);
	}

	return "Ошибка периода";
};

export const getEnding = (n: number, one = "", notMany = "", many = "") => {
	const lastSymbol = parseInt(n.toString().slice(-1), 10);
	const penultSymbol = parseInt(n.toString().slice(-2, -1), 10);

	if (penultSymbol === 1) {
		return many;
	}

	switch (lastSymbol) {
		case 1:
			return one;
		case 2:
		case 3:
		case 4:
			return notMany;
		default:
			return many;
	}
};

export const isValidDate = (date: Date) => !isNaN(date.getTime());

export const getDateTime = (dateString = ""): [string, string] => {
	const [date = "", time = ""] = parseDate(dateString).split(",");

	return [date.trim(), time.trim()];
};

export const dateToHourAndMinute = (date: Date = new Date()) =>
	isValidDate(date)
		? `${date.getHours().toString().padStart(2, "0")}:${date
				.getMinutes()
				.toString()
				.padStart(2, "0")}`
		: "";

const numToMsMap: Record<DateType, number> = {
	[DateType.min]: 60000,
	[DateType.hour]: 3600000,
	[DateType.day]: 86400000,
};

export const numToMs = (num: number, timeUnit = DateType.min) => num * numToMsMap[timeUnit];

export const msToNumAndUnit = (ms: number): [number, DateType] => {
	let num: number, timeUnit: DateType;

	if (ms >= 3600000 && ms % 3600000 === 0) {
		timeUnit = DateType.hour;
		num = ms / 3600000;
	} else {
		timeUnit = DateType.min;
		num = ms / 60000;
	}

	return [num, timeUnit];
};

export const cronStringToDate = (cronString: string) => {
	const cronScheduleArray = cronString.split(" ");
	const offset = new Date().getTimezoneOffset() / 60;

	const date = new Date();
	date.setMinutes(+cronScheduleArray[1]);
	date.setHours(+cronScheduleArray[2] - offset);

	return new Date(+date);
};

export const parseDate = (date: string) =>
	isNaN(Date.parse(date)) ? date : new Date(date).toLocaleString();

export const getLocalDateTime = (date: Date) => {
	let hours: number | string = date.getHours();
	if (hours < 10) hours = "0" + hours;

	let minutes: number | string = date.getMinutes();
	if (minutes < 10) minutes = "0" + minutes;

	return `${String(date.getDate()).padEnd(2, "0")}.${String(date.getMonth()).padEnd(
		2,
		"0"
	)}.${date.getFullYear()}, ${hours}:${minutes}`;
};
