import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { GitHubTeamModel, GitHubUser, GithubWorkflowRunModel } from './git-hub.service';
import {
  addWorkflowNameFilter,
  changeConclusionFilter, changeMaxWorkflowRunAge,
  changePollingInterval,
  changeStatusFilter,
  changeTeamsFilter,
  changeToken, removeWorkflowNameFilter,
} from './state/configuration/configuration.actions';
import { selectWorkflowRuns } from './state/workflow/workflow.selectors';
import { selectSortedUserTeams, selectUserProfile } from './state/user/user.selectors';
import { WorkflowRunStatus } from './workflow-run/workflow-run-status.enum';
import {
  selectConclusionFilter, selectMaxWorkflowRunAge,
  selectPollingInterval,
  selectStatusFilter,
  selectTeamsFilter, selectWorkflowNamesFilter,
} from './state/configuration/configuration.selectors';
import { WorkflowRunConclusion } from './workflow-run/workflow-run-conclusion.enum';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'actio-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'actio'

  workflowRunStatus = Object.values(WorkflowRunStatus)
  workflowRunConclusions = Object.values(WorkflowRunConclusion)
  chipSeparatorKeysCodes: number[] = [ENTER, COMMA]

  user$: Observable<GitHubUser | null>
  teams$: Observable<GitHubTeamModel[]>
  workflowRuns$: Observable<GithubWorkflowRunModel[]>
  workflowNamesFilter$: Observable<string[]>

  pollingIntervalControlKey = 'pollingIntervalControl'
  maxWorkflowRunAgeControlKey = 'workflowRunHistoryControl'
  teamsSelectionControlKey = 'teamsSelectionControl'
  statusSelectionControlKey = 'statusSelectionControl'
  conclusionSelectionControlKey = 'conclusionSelectionControl'
  workflowNameSelectionControlKey = 'workflowNameSelectionControl'

  tokenControl = new UntypedFormControl()

  settingsFormGroup = new UntypedFormGroup({
    [this.pollingIntervalControlKey]: new UntypedFormControl(),
    [this.maxWorkflowRunAgeControlKey]: new UntypedFormControl(),
  })

  configurationFormGroup = new UntypedFormGroup({
    [this.teamsSelectionControlKey]: new UntypedFormControl(),
    [this.statusSelectionControlKey]: new UntypedFormControl(),
    [this.conclusionSelectionControlKey]: new UntypedFormControl(),
    [this.workflowNameSelectionControlKey]: new UntypedFormControl(),
  })

  constructor(private store: Store) {
    this.user$ = store.select(selectUserProfile)
    this.teams$ = store.select(selectSortedUserTeams)
    this.workflowRuns$ = store.select(selectWorkflowRuns)
    this.workflowNamesFilter$ = store.select(selectWorkflowNamesFilter)

    this.enableConfigurationFormGroupAfterLogin()

    this.tokenControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe(it => this.store.dispatch(changeToken({ token: it })))

    this.settingsFormGroup.controls[this.pollingIntervalControlKey].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(it => this.store.dispatch(changePollingInterval({ interval: it })))

    this.store.select(selectPollingInterval)
      .subscribe(it => this.settingsFormGroup.controls[this.pollingIntervalControlKey].setValue(it))

    this.settingsFormGroup.controls[this.maxWorkflowRunAgeControlKey].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(it => this.store.dispatch(changeMaxWorkflowRunAge({ age: it })))

    this.store.select(selectMaxWorkflowRunAge)
      .subscribe(it => this.settingsFormGroup.controls[this.maxWorkflowRunAgeControlKey].setValue(it))

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

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.store.dispatch(addWorkflowNameFilter({ filter: value }))
    }

    event.chipInput!.clear();
  }

  remove(workflowName: string): void {
    this.store.dispatch(removeWorkflowNameFilter({ filter: workflowName }))
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
