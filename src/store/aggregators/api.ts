import axios from "axios";
import {
	GetAggregatorsResponse,
	GetAggregatorResponse,
	OldAggregator,
	EditCompliancesResponse,
	EditCommissionsResponse,
	EditCommissionsRequest,
	Compliances,
} from "./types";

const aggregatorsAPI = {
	getList: `classified`,
	get: `classified`,

	add: `classified`,
	edit: `classified`,
	editComliances: `classified`,
	editCommissions: `classified`,
};

export default aggregatorsAPI;
