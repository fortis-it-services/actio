import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, takeUntil, timer } from 'rxjs';
import { loadTeamsSuccess } from '../user/user.actions';
import {
  pollingStarted,
  pollWorkflowsRunsSuccess,
  startPollingWorkflowRuns,
  stopPollingWorkflowRuns,
  updatePolling,
} from './workflow.actions';
import { GitHubService } from '../../git-hub.service';
import { Store } from '@ngrx/store';
import {selectMaxWorkflowRunAge, selectPollingIntervalInMillis} from '../configuration/configuration.selectors';
import {
  changeMaxWorkflowRunAge,
  changePollingInterval,
  changeTeamsFilter,
} from '../configuration/configuration.actions';
import { selectFilteredUserTeams } from '../user/user.selectors';

@Injectable()
export class WorkflowEffects {

  startPollingWorkflowRuns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadTeamsSuccess, stopPollingWorkflowRuns),
      map(_ => startPollingWorkflowRuns()),
    )
  })

  stopPollingWorkflowRuns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(changePollingInterval, changeTeamsFilter, changeMaxWorkflowRunAge),
      map(_ => stopPollingWorkflowRuns()),
    )
  })

  pollWorkflowRuns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(startPollingWorkflowRuns),
      concatLatestFrom(() => this.store.select(selectPollingIntervalInMillis)),
      switchMap(([_, pollingInterval]) =>
        timer(0, pollingInterval).pipe(
          takeUntil(this.actions$.pipe(ofType(stopPollingWorkflowRuns))),
          map(_ => pollingStarted()),
        ),
      ),
    )
  });

  pollingStarted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(pollingStarted),
      concatLatestFrom(() => [
        this.store.select(selectFilteredUserTeams),
        this.store.select(selectMaxWorkflowRunAge),
      ]),
      switchMap(([_, teams, maxWorkflowRunAge]) =>
        this.gitHubService.loadWorkflowRuns(teams, maxWorkflowRunAge)
          .pipe(
            map(workflowRuns => pollWorkflowsRunsSuccess({workflowRuns})),
          ),
      ),
    )
  });

  updatePolling$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(pollWorkflowsRunsSuccess),
      switchMap(_ =>
        timer(0, 100).pipe(
          concatLatestFrom(() => this.store.select(selectPollingIntervalInMillis)),
          map(([_, intervalInMillis]) => updatePolling({interval: intervalInMillis})),
        ),
      ),
    )
  });

  constructor(
    private store: Store,
    private actions$: Actions,
    private gitHubService: GitHubService,
  ) {
  }
}
