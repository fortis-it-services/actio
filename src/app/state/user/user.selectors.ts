import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user-state';
import { selectTeamsFilter } from '../configuration/configuration.selectors';
import { GitHubTeamModel } from '../../git-hub.service';

export const userFeatureKey = 'user'
export const selectUserFeature = createFeatureSelector<UserState>(userFeatureKey)

export const selectUserProfile = createSelector(
  selectUserFeature,
  (state: UserState) => state.profile,
)

export const selectUserTeams = createSelector(
  selectUserFeature,
  (state: UserState) => state.teams,
)

export const selectSortedUserTeams = createSelector(
  selectUserFeature,
  (state: UserState) => [...state.teams]
    .sort((a, b) => {
      const sortOrg = a.organization.login.toString().localeCompare(b.organization.login.toString())
      const sortTeam = a.slug.toString().localeCompare(b.slug.toString())

      return sortOrg || sortTeam
    }),
)

export const selectFilteredUserTeams = createSelector(
  selectUserFeature,
  selectTeamsFilter,
  (state: UserState, filter: GitHubTeamModel[]) => {
    return state.teams
      .filter(team => filter.map(it => `${it.organization}-${it.slug}`).includes(`${team.organization}-${team.slug}`))
  },
)
