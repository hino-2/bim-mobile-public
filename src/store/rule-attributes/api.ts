import axios from "axios";
import { GetRuleAttributesResponse } from "./types";

const ruleAttributesAPI = {
	get: `classified`,
	add: `classified`,
	remove: `classified`,

	addConditionalAttribute: `classified`,
	removeConditionalAttribute: `classified`,
};

export default ruleAttributesAPI;
