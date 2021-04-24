import { createSlice } from '@reduxjs/toolkit';
import {
  ruleAttributesNamespace,
  ruleAttributesInitialState,
} from './constants';
import reducers from './reducers';

const ruleAttributesSlice = createSlice({
  name: ruleAttributesNamespace,
  initialState: ruleAttributesInitialState,
  reducers,
});

export default ruleAttributesSlice;
