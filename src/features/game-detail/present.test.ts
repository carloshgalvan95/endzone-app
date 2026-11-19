import type { Game, TeamsDocument } from '@/contract/types';

import finalSlate from '../../contract/fixtures/slate-final.json';
import teamsJson from '../../contract/fixtures/teams.json';
import { presentGameDetail } from './present';

const teams = teamsJson as TeamsDocument;

describe('presentGameDetail', () => {
  test('shows the model, the market, local kickoff, and the final result', () => {
    const game = finalSlate.games[0] as Game;
    const detail = presentGameDetail(game, teams, 'America/Chicago');
    expect(detail.matchup).toBe('Commanders at Giants');
    expect(detail.modelPercent).toBe('71.9%');
    expect(detail.marketPercent).toBe('54.3%');
    expect(detail.diffLabel).toBe('+17.6 pp');
    expect(detail.kickoffLocal).toContain('7:15');
    expect(detail.kickoffLocal).toContain('Nov');
    expect(detail.finalLabel).toContain('Commanders won');
    expect(detail.finalLabel).toContain('Away 24, home 21');
  });

  test('omits the market when the file has no price, and keeps a date without a clock', () => {
    const game = finalSlate.games[1] as Game;
    const detail = presentGameDetail(game, teams, 'UTC');
    expect(detail.marketPercent).toBeNull();
    expect(detail.diffLabel).toBeNull();
    expect(detail.finalLabel).toBeNull();
    expect(detail.kickoffLocal).toContain('No clock time was published');
  });
});
