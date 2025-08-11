export interface SignalData {
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number | string;
  entries?: (number | string)[];
  target: number | string;
  targets?: (number | string)[];
  stopLoss: number | string;
  current?: number | string;
  timeframe?: string;
  confidence?: number;
  riskReward?: string;
  analysis?: string;
  marketContext?: string;
  source: string;
  timestamp: string;
  strategy?: string;
  volatility?: string;
  session?: string;
  catalyst?: string;
  signalId?: string;
}

export interface AvailableToken {
  id: string;
  label: string;
  category: 'trade' | 'context' | 'performance';
  placeholder: string;
  description: string;
  required?: boolean;
}

export const AVAILABLE_TOKENS: AvailableToken[] = [
  // Essential trade tokens
  { id: 'pair', label: 'Pair', category: 'trade', placeholder: 'EURUSD', description: 'Trading pair', required: true },
  { id: 'type', label: 'Type', category: 'trade', placeholder: 'BUY', description: 'BUY or SELL', required: true },
  { id: 'entry', label: 'Entry', category: 'trade', placeholder: '1.0850', description: 'Entry price', required: true },
  { id: 'target', label: 'Target', category: 'trade', placeholder: '1.0920', description: 'Target price' },
  { id: 'stopLoss', label: 'Stop Loss', category: 'trade', placeholder: '1.0800', description: 'Stop loss', required: true },
  { id: 'timeframe', label: 'Timeframe', category: 'trade', placeholder: '1H', description: 'Signal timeframe' },
  
  // Context tokens
  { id: 'analysis', label: 'Analysis', category: 'context', placeholder: 'Bullish breakout', description: 'Technical analysis' },
  { id: 'source', label: 'Source', category: 'context', placeholder: 'FXLeaders', description: 'Signal source' },
];

export const SAMPLE_SIGNAL_DATA: SignalData = {
  pair: 'EURUSD',
  type: 'BUY',
  entry: '1.0850',
  target: '1.0920',
  stopLoss: '1.0800',
  timeframe: '1H',
  analysis: 'Bullish breakout above key resistance',
  source: 'FXLeaders',
  timestamp: new Date().toISOString(),
};
