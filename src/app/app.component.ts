import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { GitHubTeamModel, GitHubUser, GithubWorkflowRunModel } from './git-hub.service';
import {
  changeConclusionFilter,
  changePollingInterval,
  changeStatusFilter,
  changeTeamsFilter,
  changeToken,
} from './state/configuration/configuration.actions';
import { selectWorkflowRuns } from './state/workflow/workflow.selectors';
import { selectSortedUserTeams, selectUserProfile } from './state/user/user.selectors';
import { WorkflowRunStatus } from './workflow-run/workflow-run-status.enum';
import {
  selectConclusionFilter,
  selectPollingInterval,
  selectStatusFilter,
  selectTeamsFilter,
} from './state/configuration/configuration.selectors';
import { WorkflowRunConclusion } from './workflow-run/workflow-run-conclusion.enum';

@Component({
  selector: 'actio-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'actio'

  workflowRunStatus = Object.values(WorkflowRunStatus)
  workflowRunConclusions = Object.values(WorkflowRunConclusion)

  user$: Observable<GitHubUser | null>
  isNotLoggedIn$: Observable<boolean>
  teams$: Observable<GitHubTeamModel[]>
  workflowRuns$: Observable<GithubWorkflowRunModel[]>
  selectedTeamsFilter$: Observable<GitHubTeamModel[]>
  selectedStatusFilter$: Observable<string[]>
  selectedConclusionFilter$: Observable<string[]>
  selectedPollingInterval$: Observable<number>

  tokenControl = new FormControl('')

  constructor(private store: Store) {
    this.user$ = store.select(selectUserProfile)
    this.teams$ = store.select(selectSortedUserTeams)
    this.workflowRuns$ = store.select(selectWorkflowRuns)
    this.selectedTeamsFilter$ = store.select(selectTeamsFilter)
    this.selectedStatusFilter$ = store.select(selectStatusFilter)
    this.selectedConclusionFilter$ = store.select(selectConclusionFilter)
    this.selectedPollingInterval$ = store.select(selectPollingInterval)

    this.isNotLoggedIn$ = this.user$.pipe(
      map(it => it === null),
    )

    this.tokenControl.valueChanges
      .subscribe(token => this.store.dispatch(changeToken({ token: token })))
  }

  handleTeamsFilterChange(event: GitHubTeamModel[]) {
    this.store.dispatch(changeTeamsFilter({ filter: event }))
  }

  handleStatusFilterChange(event: string[]) {
    this.store.dispatch(changeStatusFilter({ filter: event }))
  }

  handleConclusionFilterChange(event: string[]) {
    this.store.dispatch(changeConclusionFilter({ filter: event }))
  }

  handlePollingIntervalChange(event: number) {
    this.store.dispatch(changePollingInterval({ interval: event }))
  }

  compareTeams(o1: GitHubTeamModel, o2: GitHubTeamModel) {
    return o1.slug == o2.slug && o1.organization.login == o2.organization.login
  }
}
