import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

type Checksums = {
  source_commit: string;
  algorithm: string;
  files: Record<string, string>;
};

describe('vendored v1 schemas', () => {
  test('match the recorded sha256 checksums', () => {
    const directory = path.join(process.cwd(), 'contracts', 'v1');
    const recorded = JSON.parse(
      fs.readFileSync(path.join(directory, 'checksums.json'), 'utf8'),
    ) as Checksums;
    expect(recorded.algorithm).toBe('sha256');
    expect(recorded.source_commit).toBe('b9f8342c4e24009ce74a942d82b285626259a43e');

    const names = Object.keys(recorded.files).sort();
    expect(names).toEqual(['slate.schema.json', 'teams.schema.json', 'track_record.schema.json']);

    for (const name of names) {
      const bytes = fs.readFileSync(path.join(directory, name));
      const digest = crypto.createHash('sha256').update(bytes).digest('hex');
      expect(digest).toBe(recorded.files[name]);
    }
  });
});
