/**
 * Generates focused chart datasets under src/data/charts/ from
 * src/data/ai_models_leaderboard.json (single source of truth).
 *
 * Run: node scripts/extract-chart-datasets.mjs
 * Or:  npm run extract-charts
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sourcePath = join(root, 'src/data/ai_models_leaderboard.json');
const outDir = join(root, 'src/data/charts');

function shorten(text, max = 24) {
  const t = String(text).trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function metaRow(m) {
  return {
    model: m.model,
    company: m.company,
    rank: m.rank,
    chatArena: m.chatArena ?? null,
    codeArena: m.codeArena ?? null,
    gpqa: m.gpqa ?? null,
    sweBench: m.sweBench ?? null,
    inputPricePerMillion: m.inputPricePerMillion ?? null,
    outputPricePerMillion: m.outputPricePerMillion ?? null,
    context: m.context ?? null,
  };
}

function writeChart(filename, payload) {
  writeFileSync(join(outDir, filename), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${filename}`);
}

const raw = JSON.parse(readFileSync(sourcePath, 'utf8'));
const models = raw.models;
const updatedAt = new Date().toISOString();
const sourceFile = 'ai_models_leaderboard.json';

mkdirSync(outDir, { recursive: true });

/* 1 — Chat Arena (highest Elo first) */
{
  const sorted = [...models]
    .filter((m) => m.chatArena != null)
    .sort((a, b) => (b.chatArena ?? 0) - (a.chatArena ?? 0))
    .slice(0, 12);
  writeChart('chat-arena-top.json', {
    sourceFile,
    updatedAt,
    navigation: { href: '/leaderboards/top-10', label: 'Directory · top models' },
    presentation: {
      title: 'Chat Arena leaders',
      subtitle: 'Highest conversational Elo in the dataset (top 12).',
      chartType: 'bar',
      height: 300,
    },
    chart: {
      labels: sorted.map((m) => shorten(m.model)),
      datasets: [
        {
          label: 'Chat Arena Elo',
          data: sorted.map((m) => m.chatArena),
          color: '#8b5cf6',
        },
      ],
    },
    meta: sorted.map(metaRow),
  });
}

/* 2 — Code Arena */
{
  const sorted = [...models]
    .filter((m) => m.codeArena != null)
    .sort((a, b) => (b.codeArena ?? 0) - (a.codeArena ?? 0))
    .slice(0, 12);
  writeChart('code-arena-top.json', {
    sourceFile,
    updatedAt,
    navigation: { href: '/leaderboards/coding', label: 'Coding leaderboard' },
    presentation: {
      title: 'Code Arena leaders',
      subtitle: 'Highest coding Elo in the dataset (top 12).',
      chartType: 'bar',
      height: 300,
    },
    chart: {
      labels: sorted.map((m) => shorten(m.model)),
      datasets: [
        {
          label: 'Code Arena Elo',
          data: sorted.map((m) => m.codeArena),
          color: '#10b981',
        },
      ],
    },
    meta: sorted.map(metaRow),
  });
}

/* 3 — GPQA vs SWE-bench (both present, by rank) */
{
  const filtered = [...models]
    .filter((m) => m.gpqa != null && m.sweBench != null)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);
  writeChart('gpqa-vs-swe.json', {
    sourceFile,
    updatedAt,
    navigation: { href: '/leaderboards/swe', label: 'Agentic / SWE view' },
    presentation: {
      title: 'Reasoning vs agentic coding',
      subtitle: 'GPQA and SWE-bench (%) for top-ranked models with both scores.',
      chartType: 'bar',
      height: 300,
    },
    chart: {
      labels: filtered.map((m) => shorten(m.model)),
      datasets: [
        { label: 'GPQA %', data: filtered.map((m) => m.gpqa), color: '#6366f1' },
        { label: 'SWE-bench %', data: filtered.map((m) => m.sweBench), color: '#06b6d4' },
      ],
    },
    meta: filtered.map(metaRow),
  });
}

/* 4 — Chat vs Code line (by official rank) */
{
  const sorted = [...models].sort((a, b) => a.rank - b.rank).slice(0, 12);
  writeChart('chat-vs-code-by-rank.json', {
    sourceFile,
    updatedAt,
    navigation: { href: '/leaderboards/top-10', label: 'Full directory' },
    presentation: {
      title: 'Chat vs Code Arena',
      subtitle: 'Same models in rank order — compare conversational vs coding Elo.',
      chartType: 'line',
      height: 320,
    },
    chart: {
      labels: sorted.map((m) => shorten(m.model)),
      datasets: [
        {
          label: 'Chat Arena',
          data: sorted.map((m) => (m.chatArena == null ? 0 : m.chatArena)),
          color: '#8b5cf6',
        },
        {
          label: 'Code Arena',
          data: sorted.map((m) => (m.codeArena == null ? 0 : m.codeArena)),
          color: '#10b981',
        },
      ],
    },
    meta: sorted.map(metaRow),
  });
}

/* 5 — Input price (top 15 by rank — $/M tokens) */
{
  const sorted = [...models].sort((a, b) => a.rank - b.rank).slice(0, 15);
  writeChart('input-price-by-rank.json', {
    sourceFile,
    updatedAt,
    navigation: { href: '/leaderboards/cost-effective', label: 'Value leaderboards' },
    presentation: {
      title: 'Input price ($/M tokens)',
      subtitle: 'Top 15 models by directory rank — lower can mean better unit economics.',
      chartType: 'bar',
      height: 300,
    },
    chart: {
      labels: sorted.map((m) => shorten(m.model)),
      datasets: [
        {
          label: 'Input $/M',
          data: sorted.map((m) => (m.inputPricePerMillion == null ? 0 : m.inputPricePerMillion)),
          color: '#f59e0b',
        },
      ],
    },
    meta: sorted.map(metaRow),
  });
}

/* 6 — Output price */
{
  const sorted = [...models].sort((a, b) => a.rank - b.rank).slice(0, 15);
  writeChart('output-price-by-rank.json', {
    sourceFile,
    updatedAt,
    navigation: { href: '/leaderboards/cost-effective', label: 'Value leaderboards' },
    presentation: {
      title: 'Output price ($/M tokens)',
      subtitle: 'Top 15 by rank — output-side API cost.',
      chartType: 'bar',
      height: 300,
    },
    chart: {
      labels: sorted.map((m) => shorten(m.model)),
      datasets: [
        {
          label: 'Output $/M',
          data: sorted.map((m) => (m.outputPricePerMillion == null ? 0 : m.outputPricePerMillion)),
          color: '#db2777',
        },
      ],
    },
    meta: sorted.map(metaRow),
  });
}

/* 7 — Area: Chat Arena by rank (first 10) */
{
  const sorted = [...models].sort((a, b) => a.rank - b.rank).slice(0, 10);
  writeChart('chat-arena-trend-by-rank.json', {
    sourceFile,
    updatedAt,
    navigation: { href: '/leaderboards/top-10', label: 'Directory' },
    presentation: {
      title: 'Chat Arena by rank',
      subtitle: 'Rank #1–10 in order — shape of conversational scores at the top of the list.',
      chartType: 'area',
      height: 260,
    },
    chart: {
      labels: sorted.map((m) => shorten(m.model, 20)),
      datasets: [
        {
          label: 'Chat Arena',
          data: sorted.map((m) => (m.chatArena == null ? 0 : m.chatArena)),
          color: '#7c3aed',
        },
      ],
    },
    meta: sorted.map(metaRow),
  });
}

/* Manifest for the app */
writeChart('_manifest.json', {
  sourceFile,
  updatedAt,
  description: 'Auto-generated chart datasets. Regenerate after editing ai_models_leaderboard.json.',
  charts: [
    'chat-arena-top.json',
    'code-arena-top.json',
    'gpqa-vs-swe.json',
    'chat-vs-code-by-rank.json',
    'input-price-by-rank.json',
    'output-price-by-rank.json',
    'chat-arena-trend-by-rank.json',
  ],
});

console.log('Done. Outputs in src/data/charts/');
