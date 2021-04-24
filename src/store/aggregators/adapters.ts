import { createEntityAdapter } from '@reduxjs/toolkit';
import { Aggregator } from './types';
import { sortComparer } from './utils';

const aggregatorsAdapter = createEntityAdapter<Aggregator>({
  selectId: aggregator => aggregator.aggregatorID,
  sortComparer,
});

export { aggregatorsAdapter };
