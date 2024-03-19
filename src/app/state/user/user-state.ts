import { RateLimit, Team, User } from '../../git-hub.service';

export interface UserState {
  profile: User | null,
  rateLimits: RateLimit,
  teams: Team[],
}
