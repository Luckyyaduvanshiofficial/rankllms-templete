/**
 * Home chart bundles under `src/data/charts/` — generated from
 * `src/data/ai_models_leaderboard.json` via `npm run extract-charts`.
 */
import chatArenaTop from '../data/charts/chat-arena-top.json';
import codeArenaTop from '../data/charts/code-arena-top.json';
import gpqaVsSwe from '../data/charts/gpqa-vs-swe.json';
import chatVsCodeByRank from '../data/charts/chat-vs-code-by-rank.json';
import inputPriceByRank from '../data/charts/input-price-by-rank.json';
import outputPriceByRank from '../data/charts/output-price-by-rank.json';
import chatArenaTrendByRank from '../data/charts/chat-arena-trend-by-rank.json';

export interface ChartMetaRow {
  model: string;
  company: string;
  rank: number;
  chatArena: number | null;
  codeArena: number | null;
  gpqa: number | null;
  sweBench: number | null;
  inputPricePerMillion: number | null;
  outputPricePerMillion: number | null;
  context: string | null;
}

export interface ExtractedChartBundle {
  sourceFile: string;
  updatedAt: string;
  navigation: { href: string; label: string };
  presentation: {
    title: string;
    subtitle: string;
    chartType: 'bar' | 'line' | 'area';
    height: number;
  };
  chart: {
    labels: string[];
    datasets: { label: string; data: number[]; color?: string }[];
  };
  meta: ChartMetaRow[];
}

const toBundle = (b: unknown): ExtractedChartBundle => b as ExtractedChartBundle;

/** Two-column grid on the home dashboard. */
export const homeChartGrid: ExtractedChartBundle[] = [
  toBundle(chatArenaTop),
  toBundle(codeArenaTop),
  toBundle(gpqaVsSwe),
  toBundle(inputPriceByRank),
  toBundle(outputPriceByRank),
];

/** Full-width charts below the grid. */
export const homeChartFullWidth: ExtractedChartBundle[] = [
  toBundle(chatVsCodeByRank),
  toBundle(chatArenaTrendByRank),
];

export const CHART_DATA_SOURCE_PATH = 'src/data/ai_models_leaderboard.json';
export const CHART_DATA_GENERATED_DIR = 'src/data/charts/';
