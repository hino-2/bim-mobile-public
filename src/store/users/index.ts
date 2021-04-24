import { createSlice } from '@reduxjs/toolkit';
import { usersNamespase, usersInitialState } from './constants';
import reducers from './reducer';

const usersSlice = createSlice({
  name: usersNamespase,
  initialState: usersInitialState,
  reducers,
});

export default usersSlice;
