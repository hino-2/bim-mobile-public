import axios from "axios";
import {
	Attribute,
	GetAttributesResponse,
	GetAttributeValuesResponse,
	EditAttributeResponse,
} from "./types";

const attributesAPI = {
	getList: `classified`,

	add: `classified`,
	edit: `classified`,
	remove: `classified`,

	getAttributeValues: `classified`,
};

export default attributesAPI;
