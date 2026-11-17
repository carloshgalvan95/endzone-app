import type { Slate, TeamsDocument } from '@/contract/types';

import finalSlateJson from '../contract/fixtures/slate-final.json';
import sampleSlateJson from '../contract/fixtures/slate-sample.json';
import teamsJson from '../contract/fixtures/teams.json';
import { exampleBannerText, presentGame, seasonWeekLabel } from './present';

const finalSlate = finalSlateJson as Slate;
const sampleSlate = sampleSlateJson as Slate;
const teams = teamsJson as TeamsDocument;

describe('presentGame', () => {
  test('shows the final score, the market gap, and team names', () => {
    const game = finalSlate.games[0];
    if (!game) {
      throw new Error('missing game');
    }
    const card = presentGame(game, teams, finalSlate.score_model, finalSlate.threshold_pp);
    expect(card.awayName).toBe('Commanders');
    expect(card.homeName).toBe('Giants');
    expect(card.modelPercent).toBe('71.9%');
    expect(card.marketPercent).toBe('54.3%');
    expect(card.diffLabel).toBe('+17.6 pp');
    expect(card.disagrees).toBe(true);
    expect(card.pick).toBe('home');
    expect(card.finalScore).toEqual({
      away: 24,
      home: 21,
      winner: 'away',
      label: 'Commanders won',
    });
    expect(card.marginLabel).toBe('Home by 7.0');
    expect(card.totalLabel).toBe('47.8');
  });

  test('hides the diff when the market is missing and calls a 50 pick a tie', () => {
    const game = finalSlate.games[1];
    if (!game) {
      throw new Error('missing game');
    }
    const card = presentGame(game, teams, finalSlate.score_model, finalSlate.threshold_pp);
    expect(card.marketPercent).toBe('n/a');
    expect(card.diffLabel).toBeNull();
    expect(card.disagrees).toBe(false);
    expect(card.pick).toBe('tie');
    expect(card.finalScore).toBeNull();
  });

  test('uses the example label and hides estimates that were not accepted', () => {
    expect(exampleBannerText(sampleSlate)).toBe('Example slate. These are not real predictions.');
    expect(seasonWeekLabel(sampleSlate)).toBe('Example data');
    expect(seasonWeekLabel(finalSlate)).toBe('2026 week 10');
    const game = sampleSlate.games[0];
    if (!game) {
      throw new Error('missing game');
    }
    const card = presentGame(game, teams, sampleSlate.score_model, sampleSlate.threshold_pp);
    expect(card.marginLabel).toBeNull();
    expect(card.estimateNote).toContain('pre-registered');
    expect(card.disagrees).toBe(false);
  });
});
