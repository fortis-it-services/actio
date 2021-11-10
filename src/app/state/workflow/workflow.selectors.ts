import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GithubWorkflowRunModel } from '../../git-hub.service';
import { selectConclusionFilter, selectStatusFilter } from '../configuration/configuration.selectors';

export const workflowRunsFeatureKey = 'workflowRuns'
export const selectWorkflowRuns = createFeatureSelector<GithubWorkflowRunModel[]>(workflowRunsFeatureKey)

export const selectWorkflowRunsSortedAndFiltered = createSelector(
  selectWorkflowRuns,
  selectStatusFilter,
  selectConclusionFilter,
  (
    workflows: GithubWorkflowRunModel[],
    statusFilter: string[],
    conclusionFilter: string[],
  ) => workflows
    .filter(it => it.status === null || statusFilter.includes(it.status))
    .filter(it => it.conclusion === null || conclusionFilter.includes(it.conclusion))
    .sort((a, b) =>
      b.id.toString().localeCompare(a.id.toString()),
    ),
)
