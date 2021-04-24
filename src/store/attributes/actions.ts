import attributesSlice from './index';
import { createAction } from '@reduxjs/toolkit';
import { Attribute, DisplayAttributeRow } from './types';
import { attributesNamespase } from './constants';

const addAttribute = createAction<Attribute>(
  attributesNamespase + '/addAttribute',
);

const editAttribute = createAction<Attribute>(
  attributesNamespase + '/editAttribute',
);

const removeAttribute = createAction<DisplayAttributeRow>(
  attributesNamespase + '/removeAttribute',
);

const getDebounceAttributeValues = createAction<{
  attribute: Attribute;
  value?: string | number;
  page?: number;
}>(attributesNamespase + '/getDebounceAttributeValues');

const initColumns = createAction(attributesNamespase + '/initColumns');

const attributesActions = {
  addAttribute,
  editAttribute,
  removeAttribute,

  getDebounceAttributeValues,

  initColumns,

  ...attributesSlice.actions,
};

export default attributesActions;
