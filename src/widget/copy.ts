import { type en } from '@/i18n/catalog';

import type { WidgetLayout } from './select';

export type Catalog = { [K in keyof typeof en]: string };

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const value = vars[key];
    return value == null ? '' : String(value);
  });
}

export type WidgetCopy = {
  kicker: string;
  match: string | null;
  nameLine: string | null;
  figure: string;
  updated: string;
  a11y: string;
  showLogos: boolean;
  showField: boolean;
};

export function widgetCopy(input: {
  strings: Catalog;
  layout: WidgetLayout;
  offline: boolean;
  empty: 'none' | 'no-games' | 'no-cache';
  when: string;
  updatedAt: string;
  phrase: 'in 10' | 'Toss-up' | 'More than 9 in 10';
  n: number;
  team: string;
  away: string;
  home: string;
}): WidgetCopy {
  const { strings, layout } = input;
  if (input.empty === 'no-cache') {
    return blank(strings['wid.offline.empty'], strings['tb.widget.empty']);
  }
  if (input.empty === 'no-games') {
    return blank(strings['wid.empty'], strings['tb.widget.empty']);
  }

  const short = layout === '4x1';
  const kicker = input.offline
    ? fill(short ? strings['wid.offline.short'] : strings['wid.offline.line'], {
        t: input.updatedAt,
        dt: input.updatedAt,
      })
    : input.when
      ? fill(strings['wid.next'], { when: input.when })
      : strings['wid.next.only'];
  const updated = fill(short ? strings['wid.updated.short'] : strings['wid.updated'], {
    t: input.updatedAt,
    dt: input.updatedAt,
  });

  const tossup = input.phrase === 'Toss-up';
  const withTeam = layout !== '2x2';
  let figure: string;
  let nameLine: string | null = null;
  if (tossup) {
    figure = strings['cover.tossup'];
  } else if (input.phrase === 'More than 9 in 10') {
    figure = withTeam
      ? fill(strings['wid.cover.more9'], { team: input.team })
      : strings['cover.more9'];
    nameLine = withTeam ? null : input.team;
  } else if (withTeam) {
    figure = fill(strings['wid.cover'], { n: input.n, team: input.team });
  } else {
    figure = fill(strings['cover.in10'], { n: input.n });
    nameLine = input.team;
  }

  const a11y = input.offline
    ? fill(strings['tb.widget.offline'], { dt: input.updatedAt })
    : fill(strings['tb.widget'], {
        away: input.away,
        home: input.home,
        team: tossup ? '' : input.team,
        n: input.n,
        dt: input.updatedAt,
      });

  return {
    kicker,
    match:
      layout === '4x2' ? fill(strings['detail.at'], { away: input.away, home: input.home }) : null,
    nameLine,
    figure,
    updated,
    a11y,
    showLogos: layout === '4x2',
    showField: layout === '4x2',
  };
}

function blank(line: string, a11y: string): WidgetCopy {
  return {
    kicker: '',
    match: null,
    nameLine: null,
    figure: line,
    updated: '',
    a11y,
    showLogos: false,
    showField: false,
  };
}
