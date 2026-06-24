'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calculator } from 'lucide-react';

interface Props {
  competitionId: string;
  initialConfig?: { dropHighest?: boolean; dropLowest?: boolean; dropCount?: number } | null;
}

export function ScoringRulesManager({ competitionId, initialConfig }: Props) {
  const [dropHighest, setDropHighest] = useState(initialConfig?.dropHighest ?? false);
  const [dropLowest, setDropLowest] = useState(initialConfig?.dropLowest ?? false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialConfig) {
      setDropHighest(initialConfig.dropHighest ?? false);
      setDropLowest(initialConfig.dropLowest ?? false);
    }
  }, [initialConfig]);

  const save = async (dh: boolean, dl: boolean) => {
    setSaving(true);
    try {
      await fetch(`/api/competitions/${competitionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scoringConfig: { dropHighest: dh, dropLowest: dl, dropCount: 1 } }),
      });
    } catch {} finally {
      setSaving(false);
    }
  };

  const handleToggleHighest = (v: boolean) => { setDropHighest(v); save(v, dropLowest); };
  const handleToggleLowest = (v: boolean) => { setDropLowest(v); save(dropHighest, v); };

  const hasRule = dropHighest || dropLowest;

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              评分规则
            </CardTitle>
            <CardDescription>去掉极端分数，使评分更公平</CardDescription>
          </div>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="font-medium text-sm">去掉最高分</p>
            <p className="text-xs text-muted-foreground">每个评委的维度分中去掉一个最高分</p>
          </div>
          <Switch checked={dropHighest} onCheckedChange={handleToggleHighest} disabled={saving} />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="font-medium text-sm">去掉最低分</p>
            <p className="text-xs text-muted-foreground">每个评委的维度分中去掉一个最低分</p>
          </div>
          <Switch checked={dropLowest} onCheckedChange={handleToggleLowest} disabled={saving} />
        </div>
        {hasRule && (
          <Badge variant="default" className="text-xs">
            已启用：{dropHighest ? '去掉最高分' : ''}{dropHighest && dropLowest ? ' + ' : ''}{dropLowest ? '去掉最低分' : ''}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
