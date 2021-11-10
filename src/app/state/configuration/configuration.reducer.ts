import { on } from '@ngrx/store';

import {
  changeConclusionFilter,
  changePollingInterval,
  changeStatusFilter,
  changeTeamsFilter,
} from './configuration.actions';
import { WorkflowRunStatus } from '../../workflow-run/workflow-run-status.enum';
import { WorkflowRunConclusion } from '../../workflow-run/workflow-run-conclusion.enum';
import { ConfigurationState } from './configuration-state';
import { createRehydrateReducer } from '../app-state';
import { configurationFeatureKey } from './configuration.selectors';

const initialState: ConfigurationState = {
  pollingInterval: 30,
  filter: {
    teams: [],
    status: Object.values(WorkflowRunStatus),
    conclusion: Object.values(WorkflowRunConclusion),
  },
};

export const configurationReducer = createRehydrateReducer(
  configurationFeatureKey,
  initialState,
  on(changeTeamsFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: filter,
      status: state.filter.status,
      conclusion: state.filter.conclusion,
    },
  })),
  on(changeStatusFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      status: filter,
      conclusion: state.filter.conclusion,
    },
  })),
  on(changeConclusionFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      status: state.filter.status,
      conclusion: filter,
    },
  })),
  on(changePollingInterval, (state, { interval }): ConfigurationState => ({
    ...state,
    pollingInterval: interval ?? initialState.pollingInterval,
  })),
);
