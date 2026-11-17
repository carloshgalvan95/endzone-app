import { ContractUpdateRequiredError, ContractValidationError } from './errors';
import finalSlate from './fixtures/slate-final.json';
import sampleSlate from './fixtures/slate-sample.json';
import teams from './fixtures/teams.json';
import trackRecord from './fixtures/track-record-unavailable.json';
import { parseSlate, parseTeams, parseTrackRecord } from './validate';

describe('parse contract documents', () => {
  test('accepts a final slate, a sample slate, teams, and an empty track record', () => {
    expect(parseSlate(finalSlate).week).toBe(10);
    expect(parseSlate(sampleSlate).sample).toBe(true);
    expect(parseTeams(teams).teams.NYG?.name).toBe('Giants');
    expect(parseTrackRecord(trackRecord).available).toBe(false);
  });

  test('treats a missing contract_version as v1', () => {
    const { contract_version: _ignored, ...rest } = finalSlate;
    expect(parseSlate(rest).model_version).toBe('2@prod');
  });

  test('raises an update error for a different major before schema errors', () => {
    expect(() => parseSlate({ contract_version: '2.0.0' })).toThrow(ContractUpdateRequiredError);
  });

  test('raises a validation error when a v1 file drops a required field', () => {
    const broken = structuredClone(finalSlate);
    const game = broken.games[0];
    if (!game) {
      throw new Error('fixture has no game');
    }
    delete (game as { game_id?: string }).game_id;
    expect(() => parseSlate(broken)).toThrow(ContractValidationError);
  });
});
