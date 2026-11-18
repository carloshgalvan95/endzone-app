import { parseSlate, parseTeams, parseTrackRecord } from '@/contract/validate';
import type { Slate, TeamsDocument, TrackRecordDocument } from '@/contract/types';
import { slateUrl, teamsUrl, trackRecordUrl, type SlateSelection } from '@/contract/urls';

async function fetchJson(url: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new Error(`Could not reach ${url}.`);
  }
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}.`);
  }
  try {
    return await response.json();
  } catch {
    throw new Error(`The response from ${url} was not JSON.`);
  }
}

export async function fetchSlate(selection: SlateSelection): Promise<Slate> {
  return parseSlate(await fetchJson(slateUrl(selection)));
}

export async function fetchTeams(): Promise<TeamsDocument> {
  return parseTeams(await fetchJson(teamsUrl()));
}

export async function fetchTrackRecord(): Promise<TrackRecordDocument> {
  return parseTrackRecord(await fetchJson(trackRecordUrl()));
}
