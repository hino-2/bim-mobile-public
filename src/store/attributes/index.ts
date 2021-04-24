import { createSlice } from '@reduxjs/toolkit';
import { attributesNamespase, attributesInitialState } from './constants';
import reducers from './reducer';

const attributesSlice = createSlice({
  name: attributesNamespase,
  initialState: attributesInitialState,
  reducers,
});

export default attributesSlice;
