import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, takeUntil, timer } from 'rxjs';
import { loadTeamsSuccess } from '../user/user.actions';
import { pollWorkflowsRunsSuccess, startPollingWorkflowRuns, stopPollingWorkflowRuns } from './workflow.actions';
import { GitHubService } from '../../git-hub.service';
import { Store } from '@ngrx/store';
import { selectPollingIntervalInMillis } from '../configuration/configuration.selectors';
import { changePollingInterval, changeTeamsFilter } from '../configuration/configuration.actions';
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
      ofType(changePollingInterval, changeTeamsFilter),
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
          concatLatestFrom(() => this.store.select(selectFilteredUserTeams)),
          switchMap(([_, teams]) =>
            this.gitHubService.loadWorkflowRuns(teams)
              .pipe(
                map(workflowRuns => pollWorkflowsRunsSuccess({ workflowRuns })),
              ),
          ),
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
