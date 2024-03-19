import {Injectable} from '@angular/core';
import {GetResponseDataTypeFromEndpointMethod} from '@octokit/types';
import {Octokit} from 'octokit';
import {filter, from, groupBy, map, max, mergeAll, mergeMap, Observable, of, toArray} from 'rxjs';

const o = new Octokit();

// https://stackoverflow.com/questions/41253310/typescript-retrieve-element-type-information-from-array-type
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type User = GetResponseDataTypeFromEndpointMethod<typeof o.rest.users.getAuthenticated>;

export type Team = ArrayElement<GetResponseDataTypeFromEndpointMethod<typeof o.rest.teams.listForAuthenticatedUser>>;

export type Repository = ArrayElement<GetResponseDataTypeFromEndpointMethod<typeof o.rest.repos.listForAuthenticatedUser>>
  | ArrayElement<GetResponseDataTypeFromEndpointMethod<typeof o.rest.teams.listReposInOrg>>;

export type WorkflowRun = ArrayElement<GetResponseDataTypeFromEndpointMethod<typeof o.rest.actions.listWorkflowRunsForRepo>['workflow_runs']>;

export type RateLimit = GetResponseDataTypeFromEndpointMethod<typeof o.rest.rateLimit.get>;

@Injectable({
  providedIn: 'root',
})
export class GitHubService {

  private octokit: Octokit = new Octokit();

  constructor() {
  }

  loadWorkflowRuns(teams: Team[], maxWorkflowRunAge: number): Observable<WorkflowRun[]> {
    return of(teams).pipe(
      mergeAll(),
      mergeMap(it => this.loadRepositories(it.slug, it.organization.login)),
      mergeMap(it => this.loadWorkflowRunsForRepo(it.owner.login, it.name, maxWorkflowRunAge)),
      toArray(),
    )
  }

  checkRateLimit(): Observable<RateLimit> {
    return from(this.octokit.rest.rateLimit.get())
      .pipe(
        map(it => it.data),
      )
  }

  login(token: string): Observable<User> {
    this.octokit = new Octokit({auth: token});

    return from(this.octokit.rest.users.getAuthenticated())
      .pipe(
        map(it => it.data),
      );
  }

  loadTeams(): Observable<Team[]> {
    return from(this.octokit.rest.teams.listForAuthenticatedUser())
      .pipe(
        map(it => it.data),
      )
  }

  private loadRepositories(team_slug: string, org?: string): Observable<Repository> {
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

  private loadWorkflowRunsForRepo(owner: string, repo: string, maxWorkflowRunAge: number): Observable<WorkflowRun> {
    let date = new Date()
    date.setDate(date.getDate() - maxWorkflowRunAge)

    const paginationConfiguration = {
      owner,
      repo,
      created: `>${date.toISOString().split('T')[0]}`,
      per_page: 100,
    }

    return from(this.octokit.paginate(this.octokit.rest.actions.listWorkflowRunsForRepo, paginationConfiguration)).pipe(
      mergeAll(),
      groupBy((it: WorkflowRun) => `${it.workflow_id}${it.head_branch}`),
      mergeMap(it => it.pipe(
        max<WorkflowRun>((a, b) => a.id - b.id),
      )),
    )
  }
}
