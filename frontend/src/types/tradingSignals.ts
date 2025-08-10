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
  // Trade tokens
  { id: 'pair', label: 'Currency Pair', category: 'trade', placeholder: 'EURUSD', description: 'Trading pair symbol', required: true },
  { id: 'type', label: 'Signal Type', category: 'trade', placeholder: 'BUY', description: 'BUY or SELL', required: true },
  { id: 'directionEmoji', label: 'Direction Emoji', category: 'trade', placeholder: '🟢', description: 'Auto emoji based on type' },
  { id: 'entry', label: 'Entry Price', category: 'trade', placeholder: '1.0850', description: 'Main entry price', required: true },
  { id: 'entries', label: 'Entry Prices', category: 'trade', placeholder: '1.0850, 1.0840', description: 'Multiple entry levels' },
  { id: 'target', label: 'Target Price', category: 'trade', placeholder: '1.0920', description: 'Main target price' },
  { id: 'targets', label: 'Target Prices', category: 'trade', placeholder: '1.0900, 1.0920', description: 'Multiple target levels' },
  { id: 'stopLoss', label: 'Stop Loss', category: 'trade', placeholder: '1.0800', description: 'Stop loss level', required: true },
  { id: 'current', label: 'Current Price', category: 'trade', placeholder: '1.0855', description: 'Current market price' },
  { id: 'timeframe', label: 'Timeframe', category: 'trade', placeholder: '1H', description: 'Signal timeframe' },
  { id: 'riskReward', label: 'Risk/Reward', category: 'trade', placeholder: '1:2.5', description: 'Risk to reward ratio' },
  { id: 'rMultiple', label: 'R-Multiple', category: 'trade', placeholder: '2.5R', description: 'Calculated R-multiple' },
  
  // Context tokens
  { id: 'analysis', label: 'Technical Analysis', category: 'context', placeholder: 'Bullish breakout', description: 'Technical setup description' },
  { id: 'marketContext', label: 'Market Context', category: 'context', placeholder: 'USD strength', description: 'Market conditions' },
  { id: 'strategy', label: 'Strategy', category: 'context', placeholder: 'Trend following', description: 'Trading strategy used' },
  { id: 'volatility', label: 'Volatility', category: 'context', placeholder: 'Medium', description: 'Market volatility level' },
  { id: 'session', label: 'Trading Session', category: 'context', placeholder: 'London', description: 'Active trading session' },
  { id: 'catalyst', label: 'Market Catalyst', category: 'context', placeholder: 'NFP release', description: 'News or event driving the signal' },
  { id: 'note', label: 'Additional Notes', category: 'context', placeholder: 'Watch for news', description: 'Custom notes' },
  
  // Performance tokens
  { id: 'confidence', label: 'Confidence Level', category: 'performance', placeholder: '85%', description: 'Signal confidence (0-100%)' },
  { id: 'source', label: 'Signal Source', category: 'performance', placeholder: 'FXLeaders', description: 'Where signal originated' },
  { id: 'timestamp', label: 'Timestamp', category: 'performance', placeholder: '14:30 UTC', description: 'Signal generation time' },
  { id: 'signalId', label: 'Signal ID', category: 'performance', placeholder: 'SIG-001', description: 'Unique signal identifier' },
];

export const SAMPLE_SIGNAL_DATA: SignalData = {
  pair: 'EURUSD',
  type: 'BUY',
  entry: '1.0850',
  entries: ['1.0850', '1.0840'],
  target: '1.0920',
  targets: ['1.0900', '1.0920', '1.0950'],
  stopLoss: '1.0800',
  current: '1.0855',
  timeframe: '1H',
  confidence: 85,
  riskReward: '1:2.5',
  analysis: 'Bullish breakout above key resistance with strong volume confirmation',
  marketContext: 'USD weakness following dovish Fed comments',
  source: 'FXLeaders Premium',
  timestamp: new Date().toISOString(),
  strategy: 'Breakout Trading',
  volatility: 'Medium',
  session: 'London Open',
  catalyst: 'ECB Press Conference',
  signalId: 'SIG-001',
};
