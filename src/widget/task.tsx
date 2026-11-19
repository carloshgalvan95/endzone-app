import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { teamLogos as logoFlag } from '@/config/features';
import { DATA_BASE_URL, teamsUrl } from '@/contract/urls';
import { parseSlate, parseTeams } from '@/contract/validate';
import { en, es } from '@/i18n/catalog';
import { LOCALE_STORAGE_KEY, resolveLocale, type LocalePreference } from '@/i18n/resolve';
import { monogramLetters } from '@/logos/resolve';
import { coverFromHomeProb } from '@/theme/h2';

import { widgetCopy } from './copy';
import { NextGameWidget, type WidgetMark } from './NextGameWidget';
import { selectNextKickoff, widgetLayout } from './select';

const CACHE_KEY = 'endzone-widget-slate';

async function loadJson(url: string): Promise<unknown | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

async function widgetLocale() {
  const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
  const preference: LocalePreference =
    stored === 'en' || stored === 'es' || stored === 'system' ? stored : 'system';
  const device = getLocales()[0]?.languageCode ?? 'en';
  return resolveLocale(preference, device) === 'es' ? es : en;
}

function formatStamp(iso: string, locale: string): string {
  const time = Date.parse(iso);
  if (!Number.isFinite(time)) {
    return iso;
  }
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(time);
}

function formatWhen(iso: string, locale: string): string {
  const time = Date.parse(iso);
  if (!Number.isFinite(time)) {
    return '';
  }
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(time);
}

function markFor(abbr: string, teams: ReturnType<typeof parseTeams> | null): WidgetMark {
  const team = teams?.teams[abbr];
  const uri =
    logoFlag.enabled && team?.logo?.startsWith('https:') ? (team.logo as `https:${string}`) : null;
  return {
    letters: monogramLetters(abbr, team?.name ?? abbr),
    color: team?.team_color ?? null,
    uri,
  };
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  if (props.widgetAction === 'WIDGET_DELETED' || props.widgetAction === 'WIDGET_CLICK') {
    return;
  }
  const strings = await widgetLocale();
  const locale = strings === es ? 'es' : 'en';
  const layout = widgetLayout(props.widgetInfo.width, props.widgetInfo.height);
  const renderEmpty = (kind: 'no-games' | 'no-cache') => {
    props.renderWidget(
      <NextGameWidget
        game={null}
        width={props.widgetInfo.width}
        height={props.widgetInfo.height}
        copy={widgetCopy({
          strings,
          layout,
          offline: kind === 'no-cache',
          empty: kind,
          when: '',
          updatedAt: '',
          phrase: 'Toss-up',
          n: 5,
          team: '',
          away: '',
          home: '',
        })}
      />,
    );
  };

  let raw: unknown;
  let offline = false;
  const fetched = await loadJson(`${DATA_BASE_URL}/latest.json`);
  if (fetched) {
    raw = fetched;
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fetched));
  } else {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (!cached) {
      renderEmpty('no-cache');
      return;
    }
    offline = true;
    try {
      raw = JSON.parse(cached) as unknown;
    } catch {
      renderEmpty('no-cache');
      return;
    }
  }

  let slate;
  try {
    slate = parseSlate(raw);
  } catch {
    renderEmpty('no-games');
    return;
  }
  const next = selectNextKickoff(
    slate.games.map((game) => ({
      id: game.game_id,
      kickoff: game.kickoff,
      status: game.status,
      away: game.away,
      home: game.home,
      pHome: game.model_home_wp,
    })),
    Date.now(),
  );
  if (!next) {
    renderEmpty('no-games');
    return;
  }

  const teamsRaw = await loadJson(teamsUrl());
  let teams: ReturnType<typeof parseTeams> | null = null;
  if (teamsRaw) {
    try {
      teams = parseTeams(teamsRaw);
    } catch {
      teams = null;
    }
  }
  const cover = coverFromHomeProb(next.pHome);
  const favorite = cover.favorsHome ? next.home : next.away;
  const team = teams?.teams[favorite];
  const favoriteName = team?.name ?? favorite;
  const updatedAt = formatStamp(slate.generated_at, locale);
  props.renderWidget(
    <NextGameWidget
      width={props.widgetInfo.width}
      height={props.widgetInfo.height}
      copy={widgetCopy({
        strings,
        layout,
        offline,
        empty: 'none',
        when: formatWhen(next.kickoff, locale),
        updatedAt,
        phrase: cover.phrase,
        n: cover.n,
        team: favoriteName,
        away: next.away,
        home: next.home,
      })}
      game={{
        id: next.id,
        pHome: next.pHome,
        awayMark: markFor(next.away, teams),
        homeMark: markFor(next.home, teams),
      }}
    />,
  );
}
