import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GithubWorkflowRunModel } from '../../git-hub.service';
import {
  selectConclusionFilter,
  selectStatusFilter,
  selectWorkflowNamesFilter,
} from '../configuration/configuration.selectors';

export const workflowRunsFeatureKey = 'workflowRuns'
export const selectWorkflowRuns = createFeatureSelector<GithubWorkflowRunModel[]>(workflowRunsFeatureKey)

export const selectWorkflowRunsSortedAndFiltered = createSelector(
  selectWorkflowRuns,
  selectStatusFilter,
  selectConclusionFilter,
  selectWorkflowNamesFilter,
  (
    workflowRuns: GithubWorkflowRunModel[],
    statusFilter: string[],
    conclusionFilter: string[],
    workflowNameFilter: string[],
  ) => workflowRuns
    .filter(it => satisfiesCurrentFilters(it, statusFilter, conclusionFilter, workflowNameFilter))
    .sort((a, b) =>
      b.id.toString().localeCompare(a.id.toString()),
    ),
)

function satisfiesCurrentFilters(
  workflowRun: GithubWorkflowRunModel,
  statusFilter: string[],
  conclusionFilter: string[],
  workflowNameFilter: string[],
): boolean {
  return (workflowRun.status === null || statusFilter.includes(workflowRun.status)) &&
    (workflowRun.conclusion === null || conclusionFilter.includes(workflowRun.conclusion)) &&
    (workflowNameFilter.length === 0 ||
      workflowNameFilter
        .map(filter => filter.toLowerCase())
        .some(filter => workflowRun.name?.toLowerCase().includes(filter))
    )
}
