import { UserState } from './user/user-state';
import { ConfigurationState } from './configuration/configuration-state';
import { GithubWorkflowRunModel } from '../git-hub.service';
import {
  Action,
  ActionCreator,
  ActionReducer,
  ActionReducerMap,
  ActionType,
  createReducer,
  ReducerTypes,
} from '@ngrx/store';
import { userReducer } from './user/user.reducer';
import { configurationReducer } from './configuration/configuration.reducer';
import { workflowRunsReducer } from './workflow/workflow.reducer';
import { userFeatureKey } from './user/user.selectors';
import { configurationFeatureKey } from './configuration/configuration.selectors';
import { workflowRunsFeatureKey } from './workflow/workflow.selectors';

export interface AppState {
  [userFeatureKey]: UserState,
  [configurationFeatureKey]: ConfigurationState,
  [workflowRunsFeatureKey]: GithubWorkflowRunModel[],
}

export const reducers: ActionReducerMap<AppState> = {
  [userFeatureKey]: userReducer,
  [configurationFeatureKey]: configurationReducer,
  [workflowRunsFeatureKey]: workflowRunsReducer,
};

// use https://github.com/btroncone/ngrx-store-localstorage when angular 13 is supported
// https://github.com/btroncone/ngrx-store-localstorage/issues/206
// https://github.com/btroncone/ngrx-store-localstorage/pull/208
export function createRehydrateReducer<S, A extends Action = Action>(
  key: string,
  initialState: S,
  ...ons: ReducerTypes<S, ActionCreator[]>[]
): ActionReducer<S, A> {

  const item = localStorage.getItem(key);

  const newInitialState =
    (item && JSON.parse(item)) ?? initialState;

  const newOns: ReducerTypes<S, ActionCreator[]>[] = [];

  ons.forEach((oldOn: ReducerTypes<S, ActionCreator[]>) => {
    const newReducer: ActionReducer<S, A> = (
      state: S | undefined,
      action: ActionType<ActionCreator[][number]>,
    ) => {
      // @ts-ignore
      const newState = oldOn.reducer(state, action);
      localStorage.setItem(key, JSON.stringify(newState));
      return newState;
    };
    // @ts-ignore
    newOns.push({ ...oldOn, reducer: newReducer });
  });
  return createReducer(newInitialState, ...newOns);
}
