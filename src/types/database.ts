export interface AiModel {
  id: number;
  rank: number;
  is_new: boolean;
  company: string;
  model: string;
  code_arena: number | null;
  chat_arena: number | null;
  gpqa: number | null;
  swe_bench: number | null;
  context_window: string | null;
  input_price_per_million: number | null;
  output_price_per_million: number | null;
  license: string | null;
}

export type CategorySlug = 
  | 'top-10'
  | 'top-50'
  | 'coding'
  | 'offline'
  | 'tool-use'
  | 'swe'
  | 'reasoning'
  | 'massive-context'
  | 'cost-effective'
  | 'ultra-budget'
  | 'new-trending'
  | 'enterprise';
