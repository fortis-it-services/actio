import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { changeToken } from '../configuration/configuration.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { loadRateLimitSuccess, loadTeamsSuccess, loginFailure, loginSuccess } from './user.actions';
import { GitHubService } from '../../git-hub.service';
import { pollWorkflowsRunsSuccess } from '../workflow/workflow.actions';

@Injectable()
export class UserEffects {

  login$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(changeToken),
        mergeMap(it => this.gitHubService.login(it.token).pipe(
          map(userProfile => loginSuccess({ userProfile })),
          catchError(_ => of(loginFailure())),
        )),
      )
    },
  );

  checkRateLimit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginSuccess, pollWorkflowsRunsSuccess),
      mergeMap(_ => this.gitHubService.checkRateLimit()),
      map(rateLimits => loadRateLimitSuccess({ rateLimits })),
    )
  });

  loadTeams$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginSuccess),
      mergeMap(_ => this.gitHubService.loadTeams()),
      map(teams => loadTeamsSuccess({ teams })),
    )
  });

  constructor(private actions$: Actions, private gitHubService: GitHubService) {
  }

}
