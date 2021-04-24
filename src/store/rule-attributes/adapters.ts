import { createEntityAdapter } from '@reduxjs/toolkit';
import { ascend } from 'ramda';
import { RuleAttribute } from './types';

const ruleAttributesAdapter = createEntityAdapter<RuleAttribute>({
  selectId: ruleAttribute => ruleAttribute.attributeID,
  sortComparer: ascend(({ name }) => name),
});

export { ruleAttributesAdapter };
