import { Injectable } from '@angular/core';
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';
import { Octokit } from 'octokit';
import { filter, from, map, mergeAll, mergeMap, Observable, of, toArray, zipWith } from 'rxjs';

const o = new Octokit();
export type GitHubUser = GetResponseDataTypeFromEndpointMethod<typeof o.rest.users.getAuthenticated>;

export interface GitHubTeamModel {
  slug: string,
  organization: {
    login: string
  }
}

export interface GitHubBranchModel {
  name: string,
}

export interface GitHubRepositoryModel {
  name: string,
  owner: {
    login: string,
  },
  archived?: boolean,
}

export interface GithubWorkflowModel {
  id: number,
}

export interface GithubWorkflowRunModel {
  id: number,
  name?: string | null,
  workflow_id: number,
  repository: {
    name: string,
    owner: {
      login: string
    }
  }
  event: string,
  run_number: number,
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

  loadWorkflowRuns(teams: GitHubTeamModel[]): Observable<GithubWorkflowRunModel[]> {
    return of(teams).pipe(
      mergeAll(),
      mergeMap(team => this.loadRepositories(team.slug, team.organization.login)),
      mergeMap(repo => this.loadBranches(repo.owner.login, repo.name).pipe(
        zipWith(this.loadWorkflows(repo.owner.login, repo.name)),
        map(([branches, workflows]) =>
          branches.flatMap(branch => workflows.map(workflow => ([branch, workflow] as const))),
        ),
        mergeAll(),
        map(([branch, workflow]) => ({
          branch: branch.name,
          owner: repo.owner.login,
          repo: repo.name,
          workflow_id: workflow.id,
        })),
      )),
      mergeMap(it => from(this.octokit.rest.actions.listWorkflowRuns(
        {
          owner: it.owner,
          repo: it.repo,
          workflow_id: it.workflow_id,
          branch: it.branch,
          per_page: 1,
        },
      ))),
      map(it => it.data.workflow_runs),
      mergeAll(),
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

  private loadBranches(owner: string, repo: string): Observable<GitHubBranchModel[]> {
    return from(this.octokit.rest.repos.listBranches({ owner, repo })).pipe(
      map(it => it.data),
    )
  }

  private loadWorkflows(owner: string, repo: string): Observable<GithubWorkflowModel[]> {
    return from(this.octokit.rest.actions.listRepoWorkflows({ owner, repo })).pipe(
      map(it => it.data.workflows),
    )
  }
}
