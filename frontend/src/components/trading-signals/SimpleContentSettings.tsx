import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Code, 
  Send, 
  Calendar as CalendarIcon, 
  Clock,
  Plus,
  Info,
  Eye,
  Settings
} from 'lucide-react';
import { format, addDays, isAfter } from 'date-fns';
import { AVAILABLE_TOKENS, SAMPLE_SIGNAL_DATA } from '@/types/tradingSignals';

const DEFAULT_TEMPLATE = `⚡ NEW SIGNAL: {pair} {type}
💰 Entry: {entry}
🎯 Target: {target}
🛡️ Stop Loss: {stopLoss}
📊 Current: {current}

Risk/Reward: {riskReward}
Source: {source}

#TradingSignal #{pair}`;

export function SimpleContentSettings() {
  // Template state
  const [template, setTemplate] = useState(() => {
    const saved = localStorage.getItem('signal-template');
    return saved || DEFAULT_TEMPLATE;
  });

  // Publishing state
  const [publishMode, setPublishMode] = useState<'immediate' | 'scheduled'>(() => {
    const saved = localStorage.getItem('publish-mode');
    return (saved as 'immediate' | 'scheduled') || 'immediate';
  });

  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [showPreview, setShowPreview] = useState(false);

  // Platform settings
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [qualityFilter, setQualityFilter] = useState('medium');

  // Save to localStorage
  const saveTemplate = useCallback((newTemplate: string) => {
    setTemplate(newTemplate);
    localStorage.setItem('signal-template', newTemplate);
  }, []);

  const savePublishMode = useCallback((mode: 'immediate' | 'scheduled') => {
    setPublishMode(mode);
    localStorage.setItem('publish-mode', mode);
  }, []);

  // Token insertion
  const insertToken = (tokenId: string) => {
    const textarea = document.getElementById('signal-template') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const token = `{${tokenId}}`;
      const newTemplate = template.substring(0, start) + token + template.substring(end);
      saveTemplate(newTemplate);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + token.length, start + token.length);
      }, 0);
    }
  };

  // Preview generation
  const generatePreview = () => {
    let preview = template;
    const data = SAMPLE_SIGNAL_DATA;

    // Replace tokens with sample data
    preview = preview.replace(/\{pair\}/g, data.pair);
    preview = preview.replace(/\{type\}/g, data.type);
    preview = preview.replace(/\{entry\}/g, data.entry.toString());
    preview = preview.replace(/\{target\}/g, data.target?.toString() || '');
    preview = preview.replace(/\{stopLoss\}/g, data.stopLoss.toString());
    preview = preview.replace(/\{current\}/g, data.current?.toString() || '');
    preview = preview.replace(/\{riskReward\}/g, data.riskReward || '');
    preview = preview.replace(/\{source\}/g, data.source);

    return preview;
  };

  const getScheduleStatus = () => {
    if (publishMode === 'immediate') {
      return { valid: true, message: 'Will publish immediately' };
    }
    
    if (publishMode === 'scheduled') {
      if (!scheduledDate) {
        return { valid: false, message: 'Please select a date' };
      }
      
      const scheduleDateTime = new Date(scheduledDate);
      const [hours, minutes] = scheduledTime.split(':');
      scheduleDateTime.setHours(parseInt(hours), parseInt(minutes));
      
      if (isAfter(scheduleDateTime, new Date())) {
        const timeUntil = scheduleDateTime.getTime() - Date.now();
        const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
        const minutesUntil = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
        return { 
          valid: true, 
          message: `Scheduled for ${format(scheduleDateTime, 'PPp')} (in ~${hoursUntil}h ${minutesUntil}m)` 
        };
      } else {
        return { valid: false, message: 'Scheduled time must be in the future' };
      }
    }
    
    return { valid: false, message: 'Invalid configuration' };
  };

  const scheduleStatus = getScheduleStatus();

  return (
    <div className="space-y-6">
      {/* Signal Template */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Signal Template</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveTemplate(DEFAULT_TEMPLATE)}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Token Buttons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Insert Tokens:</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {AVAILABLE_TOKENS.filter(token => ['pair', 'type', 'entry', 'target', 'stopLoss', 'current', 'riskReward', 'source'].includes(token.id)).map((token) => (
                <Button
                  key={token.id}
                  variant="outline"
                  size="sm"
                  onClick={() => insertToken(token.id)}
                  className="text-xs h-8 border-slate-200 hover:bg-slate-50"
                >
                  {token.label}
                </Button>
              ))}
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-slate-600 hover:text-slate-900">
                Show more tokens ({AVAILABLE_TOKENS.length - 8} additional)
              </summary>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {AVAILABLE_TOKENS.filter(token => !['pair', 'type', 'entry', 'target', 'stopLoss', 'current', 'riskReward', 'source'].includes(token.id)).map((token) => (
                  <Button
                    key={token.id}
                    variant="outline"
                    size="sm"
                    onClick={() => insertToken(token.id)}
                    className="text-xs h-7 border-slate-200 hover:bg-slate-50"
                  >
                    {token.label}
                  </Button>
                ))}
              </div>
            </details>
          </div>

          <Separator />

          {/* Template Editor */}
          <div className="space-y-2">
            <Label htmlFor="signal-template">Template Content</Label>
            <Textarea 
              id="signal-template"
              rows={8}
              value={template}
              onChange={(e) => saveTemplate(e.target.value)}
              placeholder="Design your signal template using tokens like {pair}, {type}, {entry}..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-slate-500">
              Use tokens like {`{pair}`}, {`{type}`}, {`{entry}`} etc. Click the buttons above to insert them at your cursor position.
            </p>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="space-y-2">
              <Label>Live Preview</Label>
              <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                {generatePreview()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publishing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Publishing Mode */}
          <div className="space-y-3">
            <Label>Publishing Mode</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={publishMode === 'immediate' ? 'default' : 'outline'}
                onClick={() => savePublishMode('immediate')}
                className={publishMode === 'immediate' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <Send className="w-4 h-4 mr-2" />
                Immediate
              </Button>
              <Button
                variant={publishMode === 'scheduled' ? 'default' : 'outline'}
                onClick={() => savePublishMode('scheduled')}
                className={publishMode === 'scheduled' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                <Clock className="w-4 h-4 mr-2" />
                Scheduled
              </Button>
            </div>
          </div>

          {/* Schedule Configuration */}
          {publishMode === 'scheduled' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        disabled={(date) =>
                          date < new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Schedule Status */}
          <div className={`p-3 rounded-lg border ${
            scheduleStatus.valid 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium">{scheduleStatus.message}</span>
            </div>
          </div>

          <Separator />

          {/* Target Platforms */}
          <div className="space-y-3">
            <Label>Target Platforms</Label>
            <div className="space-y-2">
              {/* Telegram */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">Telegram</div>
                    <div className="text-xs text-blue-700">Primary platform</div>
                  </div>
                </div>
                <Switch
                  checked={telegramEnabled}
                  onCheckedChange={setTelegramEnabled}
                />
              </div>

              {/* Other platforms - disabled */}
              {[
                { name: 'X (Twitter)', icon: '𝕏', note: 'Coming soon' },
                { name: 'Discord', icon: '💬', note: 'Coming soon' }
              ].map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 opacity-60">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-300 rounded-lg flex items-center justify-center">
                      <span className="text-slate-600">{platform.icon}</span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-700">{platform.name}</div>
                      <div className="text-xs text-slate-500">{platform.note}</div>
                    </div>
                  </div>
                  <Switch disabled checked={false} />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quality Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quality-filter">Signal Quality Filter</Label>
              <Select value={qualityFilter} onValueChange={setQualityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All signals</SelectItem>
                  <SelectItem value="medium">Medium quality and above</SelectItem>
                  <SelectItem value="high">High quality only</SelectItem>
                  <SelectItem value="premium">Premium signals only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2 p-2">
                <Badge variant={scheduleStatus.valid && telegramEnabled ? 'default' : 'secondary'}>
                  {scheduleStatus.valid && telegramEnabled ? 'Ready to Publish' : 'Configuration Needed'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
