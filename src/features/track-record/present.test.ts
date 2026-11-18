import { ContractValidationError } from '@/contract/errors';
import type { TrackRecordDocument } from '@/contract/types';
import { parseTrackRecord } from '@/contract/validate';

import recordJson from '../../contract/fixtures/track-record.json';
import unavailableJson from '../../contract/fixtures/track-record-unavailable.json';
import { presentTrackRecord } from './present';

const record = recordJson as TrackRecordDocument;
const unavailable = unavailableJson as TrackRecordDocument;

describe('presentTrackRecord', () => {
  test('accepts the v1 fixture and shows week and season picks', () => {
    expect(parseTrackRecord(record).available).toBe(true);
    const model = presentTrackRecord(record);
    expect(model.honest).toContain('The market has the lower log loss');
    expect(model.caveat).toContain('Small sample');
    expect(model.rows.map((row) => row.label)).toEqual([
      '2026 season to date',
      '2026 week 10',
      '2026 week 11, no finals',
    ]);
    expect(model.rows[0]?.correct).toBe('12 of 14');
    expect(model.rows[0]?.marketLogLoss).toBe('0.5200');
    expect(model.rows[0]?.modelLogLoss).toBe('0.6100');
    expect(model.rows[2]?.correct).toBe('No finals yet');
    expect(model.rows[2]?.modelLogLoss).toBe('n/a');
  });

  test('does not invent a record when the archive is unreachable', () => {
    const model = presentTrackRecord(unavailable);
    expect(model.unavailable).toContain('archive');
    expect(model.rows).toEqual([]);
  });

  test('rejects a record that drops a required field', () => {
    const broken = structuredClone(record);
    const week = broken.seasons[0]?.weeks[0];
    if (!week) {
      throw new Error('fixture has no week');
    }
    delete (week as { pick_hits?: number }).pick_hits;
    expect(() => parseTrackRecord(broken)).toThrow(ContractValidationError);
  });
});
