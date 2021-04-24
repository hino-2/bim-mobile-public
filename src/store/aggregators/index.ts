import { createSlice } from "@reduxjs/toolkit";
import { aggregatorsNamespase, aggregatorsInitialState } from "./constants";
import reducers from "./reducer";

const aggregatorsSlice = createSlice({
	name: aggregatorsNamespase,
	initialState: aggregatorsInitialState,
	reducers,
});

export default aggregatorsSlice;
