import { parseSlate, parseTeams, parseTrackRecord } from '../src/contract/validate';
import { DATA_BASE_URL } from '../src/contract/urls';

type Failure = { file: string; message: string };

function shortMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Unknown error';
  return message.length > 500 ? `${message.slice(0, 500)}...` : message;
}

async function loadJson(file: string): Promise<unknown> {
  const url = `${DATA_BASE_URL}/${file}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return response.json();
}

async function check(file: string, parse: (document: unknown) => unknown, failures: Failure[]) {
  try {
    const document = await loadJson(file);
    parse(document);
    console.log(`ok ${file}`);
    return document;
  } catch (error) {
    failures.push({ file, message: shortMessage(error) });
    return null;
  }
}

function isRealSlate(document: unknown): document is {
  sample: boolean;
  season: number;
  weeks_available: number[];
} {
  if (document === null || typeof document !== 'object') {
    return false;
  }
  const slate = document as { sample?: unknown; season?: unknown; weeks_available?: unknown };
  return (
    slate.sample === false &&
    typeof slate.season === 'number' &&
    Array.isArray(slate.weeks_available)
  );
}

async function main(): Promise<void> {
  const failures: Failure[] = [];
  const latest = await check('latest.json', parseSlate, failures);
  await check('teams.json', parseTeams, failures);
  await check('track_record.json', parseTrackRecord, failures);
  await check('sample.json', parseSlate, failures);

  if (isRealSlate(latest)) {
    for (const week of latest.weeks_available) {
      if (!Number.isInteger(week) || week < 1) {
        failures.push({ file: 'latest.json', message: `weeks_available contains ${String(week)}` });
        continue;
      }
      await check(`predictions/${latest.season}-w${week}.json`, parseSlate, failures);
    }
  }

  if (failures.length > 0) {
    console.error('Live site data failed the vendored v1 schemas.');
    for (const failure of failures) {
      console.error(`- ${failure.file}: ${failure.message}`);
    }
    process.exit(1);
  }
  console.log('Live site data matches the vendored v1 schemas.');
}

main().catch((error: unknown) => {
  console.error(shortMessage(error));
  process.exit(1);
});
