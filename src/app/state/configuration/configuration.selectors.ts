import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConfigurationState } from './configuration-state';

export const configurationFeatureKey = 'configuration'
export const selectConfigurationState = createFeatureSelector<ConfigurationState>(configurationFeatureKey);

export const selectTeamsFilter = createSelector(
  selectConfigurationState,
  (state: ConfigurationState) => state.filter.teams,
)

export const selectStatusFilter = createSelector(
  selectConfigurationState,
  (state: ConfigurationState) => state.filter.status,
)

export const selectConclusionFilter = createSelector(
  selectConfigurationState,
  (state: ConfigurationState) => state.filter.conclusion,
)

export const selectPollingInterval = createSelector(
  selectConfigurationState,
  (state: ConfigurationState) => state.pollingInterval || 30,
);

export const selectPollingIntervalInMillis = createSelector(
  selectConfigurationState,
  (state: ConfigurationState) => (state.pollingInterval || 30) * 1000,
);
