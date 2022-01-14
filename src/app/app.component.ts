import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
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
  teams$: Observable<GitHubTeamModel[]>
  workflowRuns$: Observable<GithubWorkflowRunModel[]>

  pollingIntervalControlKey = 'pollingIntervalControl'
  teamsSelectionControlKey = 'teamsSelectionControl'
  statusSelectionControlKey = 'statusSelectionControl'
  conclusionSelectionControlKey = 'conclusionSelectionControl'

  tokenControl = new FormControl()

  configurationFormGroup = new FormGroup({
    [this.pollingIntervalControlKey]: new FormControl(),
    [this.teamsSelectionControlKey]: new FormControl(),
    [this.statusSelectionControlKey]: new FormControl(),
    [this.conclusionSelectionControlKey]: new FormControl(),
  })

  constructor(private store: Store) {
    this.user$ = store.select(selectUserProfile)
    this.teams$ = store.select(selectSortedUserTeams)
    this.workflowRuns$ = store.select(selectWorkflowRuns)

    this.enableConfigurationFormGroupAfterLogin()

    this.tokenControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe(it => this.store.dispatch(changeToken({ token: it })))

    this.configurationFormGroup.controls[this.pollingIntervalControlKey].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(it => this.store.dispatch(changePollingInterval({ interval: it })))

    this.store.select(selectPollingInterval)
      .subscribe(it => this.configurationFormGroup.controls[this.pollingIntervalControlKey].setValue(it))

    this.configurationFormGroup.controls[this.teamsSelectionControlKey].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(it => this.store.dispatch(changeTeamsFilter({ filter: it })))

    this.store.select(selectTeamsFilter)
      .subscribe(it => this.configurationFormGroup.controls[this.teamsSelectionControlKey].setValue(it))

    this.configurationFormGroup.controls[this.statusSelectionControlKey].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(it => this.store.dispatch(changeStatusFilter({ filter: it })))

    this.store.select(selectStatusFilter)
      .subscribe(it => this.configurationFormGroup.controls[this.statusSelectionControlKey].setValue(it))

    this.configurationFormGroup.controls[this.conclusionSelectionControlKey].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(it => this.store.dispatch(changeConclusionFilter({ filter: it })))

    this.store.select(selectConclusionFilter)
      .subscribe(it => this.configurationFormGroup.controls[this.conclusionSelectionControlKey].setValue(it))
  }

  compareTeams(o1: GitHubTeamModel, o2: GitHubTeamModel) {
    return o1.slug == o2.slug && o1.organization.login == o2.organization.login
  }

  private enableConfigurationFormGroupAfterLogin() {
    this.user$.pipe(
      map(it => it !== null),
    )
      .subscribe(isUserAuthenticated => {
          if (isUserAuthenticated) {
            this.configurationFormGroup.enable()
          } else {
            this.configurationFormGroup.disable()
          }
        },
      )
  }
}
