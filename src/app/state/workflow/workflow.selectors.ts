import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WorkflowRun } from '../../git-hub.service';
import {
  selectConclusionFilter,
  selectStatusFilter,
  selectWorkflowNamesFilter,
} from '../configuration/configuration.selectors';

export const workflowRunsFeatureKey = 'workflowRuns'
export const selectWorkflowRuns = createFeatureSelector<WorkflowRun[]>(workflowRunsFeatureKey)

export const selectWorkflowRunsSortedAndFiltered = createSelector(
  selectWorkflowRuns,
  selectStatusFilter,
  selectConclusionFilter,
  selectWorkflowNamesFilter,
  (
    workflowRuns: WorkflowRun[],
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
  workflowRun: WorkflowRun,
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
