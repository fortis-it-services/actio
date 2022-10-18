import { Injectable } from '@angular/core';
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';
import { Octokit } from 'octokit';
import { filter, from, groupBy, map, max, mergeAll, mergeMap, Observable, of, toArray } from 'rxjs';

const o = new Octokit();
export type GitHubUser = GetResponseDataTypeFromEndpointMethod<typeof o.rest.users.getAuthenticated>;

export interface GitHubTeamModel {
  slug: string,
  organization: {
    login: string
  }
}

export interface GitHubRepositoryModel {
  name: string,
  owner: {
    login: string,
  },
  archived?: boolean,
}

export interface GithubWorkflowRunModel {
  id: number,
  name?: string | null,
  workflow_id: number,
  repository: {
    full_name: string,
  }
  event: string,
  run_number: number,
  run_started_at?: string | null,
  head_branch: string | null,
  status: string | null,
  conclusion: string | null,
  html_url: string,
}

export interface GitHubRateLimitModel {
  resources: any,
  rate: any,
}

@Injectable({
  providedIn: 'root',
})
export class GitHubService {

  private octokit: Octokit = new Octokit();

  constructor() {
  }

  loadWorkflowRuns(teams: GitHubTeamModel[], maxWorkflowRunAge: number): Observable<GithubWorkflowRunModel[]> {
    return of(teams).pipe(
      mergeAll(),
      mergeMap(it => this.loadRepositories(it.slug, it.organization.login)),
      mergeMap(it => this.loadWorkflowRunsForRepo(it.owner.login, it.name, maxWorkflowRunAge)),
      toArray(),
    )
  }

  checkRateLimit(): Observable<GitHubRateLimitModel> {
    return from(this.octokit.rest.rateLimit.get())
      .pipe(
        map(it => it.data),
      )
  }

  login(token: string): Observable<GitHubUser> {
    this.octokit = new Octokit({ auth: token });

    return from(this.octokit.rest.users.getAuthenticated())
      .pipe(
        map(it => it.data),
      );
  }

  loadTeams(): Observable<GitHubTeamModel[]> {
    return from(this.octokit.rest.teams.listForAuthenticatedUser())
      .pipe(
        map(it => it.data),
      )
  }

  private loadRepositories(team_slug: string, org?: string): Observable<GitHubRepositoryModel> {
    return from(this.octokit.paginate(
      this.octokit.rest.teams.listReposInOrg,
      {
        org: org || '',
        team_slug,
      },
    )).pipe(
      mergeAll(),
      filter(it => it.archived == false),
    )
  }

  private loadWorkflowRunsForRepo(owner: string, repo: string, maxWorkflowRunAge: number): Observable<GithubWorkflowRunModel> {
    let date = new Date()
    date.setDate(date.getDate() - maxWorkflowRunAge)

    return from(this.octokit.paginate(
      this.octokit.rest.actions.listWorkflowRunsForRepo,
      {
        owner,
        repo,
        created: `>${date.toISOString().split('T')[0]}`,
        per_page: 100,
      },
    )).pipe(
      mergeAll(),
      groupBy(it => `${it.workflow_id}${it.head_branch}`),
      mergeMap(it => it.pipe(
        max<GithubWorkflowRunModel>((a, b) => a.id - b.id),
      )),
    )
  }
}
