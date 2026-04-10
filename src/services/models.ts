import { supabase } from '../lib/supabase';
import type { AiModel, CategorySlug } from '../types/database';

const CATEGORY_VIEW_MAP: Record<CategorySlug, string> = {
  'top-10': 'top_10_models',
  'top-50': 'top_50_models',
  coding: 'best_coding_models',
  offline: 'best_offline_models',
  'tool-use': 'best_tool_use_models',
  swe: 'best_swe_models',
  reasoning: 'best_reasoning_models',
  'massive-context': 'massive_context_models',
  'cost-effective': 'cost_effective_models',
  'ultra-budget': 'ultra_budget_models',
  'new-trending': 'new_trending_models',
  enterprise: 'best_enterprise_models',
};

export const CATEGORY_TITLES: Record<CategorySlug, string> = {
  'top-10': 'Top 10 AI Models',
  'top-50': 'Top 50 AI Models',
  coding: 'Best Coding Models',
  offline: 'Best Offline & Open Source Models',
  'tool-use': 'Best Models for Tool Use & Chat',
  swe: 'Best Software Engineering Models',
  reasoning: 'Best Reasoning Models (GPQA)',
  'massive-context': 'Massive Context Window Models',
  'cost-effective': 'Most Cost-Effective Models',
  'ultra-budget': 'Ultra-Budget / Free Models',
  'new-trending': 'New & Trending Models',
  enterprise: 'Best Enterprise Proprietary Models',
};

export async function getModelsByCategory(category: CategorySlug): Promise<AiModel[]> {
  const viewName = CATEGORY_VIEW_MAP[category];
  if (!viewName) throw new Error(`Invalid category: ${category}`);

  const { data, error } = await supabase.from(viewName).select('*');

  if (error) {
    console.error(`Error fetching models for ${category}:`, error);
    return [];
  }

  return data as AiModel[];
}
