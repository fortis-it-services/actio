import {on} from '@ngrx/store';

import {
  addWorkflowNameFilter,
  changeConclusionFilter,
  changePollingInterval,
  changeStatusFilter,
  changeTeamsFilter,
  changeMaxWorkflowRunAge,
  removeWorkflowNameFilter,
} from './configuration.actions';
import { WorkflowRunStatus } from '../../workflow-run-status.enum';
import { WorkflowRunConclusion } from '../../workflow-run-conclusion.enum';
import { ConfigurationState } from './configuration-state';
import { createRehydrateReducer } from '../app-state';
import { configurationFeatureKey } from './configuration.selectors';
import {pollingStarted, pollWorkflowsRunsSuccess, updatePolling} from '../workflow/workflow.actions';

const initialState: ConfigurationState = {
  polling: {
    pollingInterval: 30,
    isPolling: false,
    lastPollStarted: null,
    nextPollPercentage: 0,
  },
  filter: {
    teams: [],
    status: Object.values(WorkflowRunStatus),
    conclusion: Object.values(WorkflowRunConclusion),
    workflowNames: [],
  },
  maxWorkflowRunAge: 14,
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
      workflowNames: state.filter.workflowNames,
    },
  })),
  on(changeStatusFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      status: filter,
      conclusion: state.filter.conclusion,
      workflowNames: state.filter.workflowNames,
    },
  })),
  on(changeConclusionFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      status: state.filter.status,
      conclusion: filter,
      workflowNames: state.filter.workflowNames,
    },
  })),
  on(changePollingInterval, (state, { interval }): ConfigurationState => ({
    ...state,
    polling: {
      pollingInterval: interval ?? initialState.polling.pollingInterval,
      isPolling: state.polling.isPolling,
      lastPollStarted: state.polling.lastPollStarted,
      nextPollPercentage: state.polling.nextPollPercentage,
    },
  })),
  on(addWorkflowNameFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      status: state.filter.status,
      conclusion: state.filter.conclusion,
      workflowNames: [...new Set([...state.filter.workflowNames, filter])],
    },
  })),
  on(removeWorkflowNameFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      status: state.filter.status,
      conclusion: state.filter.conclusion,
      workflowNames: state.filter.workflowNames.filter(it => it !== filter),
    },
  })),
  on(changeMaxWorkflowRunAge, (state, { age }): ConfigurationState => ({
    ...state,
    maxWorkflowRunAge: age,
  })),
  on(pollingStarted, (state): ConfigurationState => ({
    ...state,
    polling: {
      pollingInterval: state.polling.pollingInterval,
      isPolling: true,
      lastPollStarted: new Date(),
      nextPollPercentage: state.polling.nextPollPercentage,
    },
  })),
  on(pollWorkflowsRunsSuccess, (state): ConfigurationState => ({
    ...state,
    polling: {
      pollingInterval: state.polling.pollingInterval,
      isPolling: false,
      lastPollStarted: state.polling.lastPollStarted,
      nextPollPercentage: state.polling.nextPollPercentage,
    },
  })),
  on(updatePolling, (state, {interval}): ConfigurationState => ({
    ...state,
    polling: {
      pollingInterval: state.polling.pollingInterval,
      isPolling: state.polling.isPolling,
      lastPollStarted: state.polling.lastPollStarted,
      nextPollPercentage: state.polling.lastPollStarted ?
        ((new Date().getTime() - state.polling.lastPollStarted.getTime()) / interval) * 100 : 0,
    },
  })),
);
