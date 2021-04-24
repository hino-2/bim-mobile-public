import { createAction } from '@reduxjs/toolkit';
import { ruleAttributesNamespace } from './constants';
import ruleAttributesSlice from './index';

const addConditionAttribute = createAction<{
  attributeID: string;
  conditionAttributeID: string;
}>(ruleAttributesNamespace + '/addConditionAttribute');

const removeConditionAttribute = createAction<string>(
  ruleAttributesNamespace + '/removeConditionAttribute',
);

const ruleAttributesActions = {
  addConditionAttribute,
  removeConditionAttribute,
  ...ruleAttributesSlice.actions,
};

export default ruleAttributesActions;
