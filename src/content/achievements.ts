/**
 * Participation and involvement records. Awards and placements are NOT asserted
 * here until they can be confirmed — each entry states the event and the work
 * involved only. When a confirmed award/placement becomes available, it can be
 * added back deliberately rather than being published from an unconfirmed claim.
 *
 * `scope` makes team vs solo involvement explicit. `tier` drives the editorial
 * hierarchy in the section: one 'lead' (most prominent), then 'secondary', then
 * compact 'minor' entries.
 */
export type AchievementScope = 'team' | 'solo';
export type AchievementTier = 'lead' | 'secondary' | 'minor';

export type Achievement = {
  id: string;
  /** Event or challenge the involvement belongs to. */
  event: string;
  /** The work involved (project / team), stated neutrally. */
  title: string;
  scope: AchievementScope;
  detail: string;
  period?: string;
  tier: AchievementTier;
};

export const achievements: readonly Achievement[] = [
  {
    id: 'nasa-space-apps-2025',
    event: 'NASA Space Apps Challenge 2025',
    title: 'Your Home in Space',
    scope: 'team',
    detail:
      'Took part as part of a team with “Your Home in Space”, a game-based ' +
      'builder for laying out a spacecraft or space-station habitat.',
    period: '2025',
    tier: 'lead',
  },
  {
    id: 'rsa-cryptography',
    event: 'National Mathematics Day — VTU Belagavi',
    title: 'RSA Cryptography',
    scope: 'solo',
    detail:
      'An RSA cryptography educational website presented at a university-level ' +
      'model presentation / exhibition.',
    period: 'December 2025',
    tier: 'secondary',
  },
  {
    id: 'sih-internal-round',
    event: 'Smart India Hackathon — internal round',
    title: 'Team Phantom Syndicate',
    scope: 'team',
    detail: 'Took part in the internal round with team Phantom Syndicate.',
    period: '2025',
    tier: 'minor',
  },
];

export const tierLabel: Record<AchievementScope, string> = {
  team: 'Team project',
  solo: 'Solo project',
};
