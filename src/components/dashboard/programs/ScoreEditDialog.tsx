'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Score {
  id: string;
  value: number;
  comment?: string | null;
  judgeId: string;
  scoringCriteria: {
    id: string;
    name: string;
    weight: number;
    maxScore: number;
  };
}

interface Judge {
  id: string;
  name: string;
  email: string;
}

interface ScoringCriteria {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
}

interface ScoreEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId: string;
  score?: Score | null;
  onScoreUpdated: () => void;
  judges: Judge[];
  criteria: ScoringCriteria[];
}

export function ScoreEditDialog({
  open,
  onOpenChange,
  programId,
  score,
  onScoreUpdated,
  judges,
  criteria
}: ScoreEditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    judgeId: '',
    scoringCriteriaId: '',
    value: '',
    comment: ''
  });

  // 当score prop变化时更新表单数据
  useEffect(() => {
    if (score) {
      setFormData({
        judgeId: score.judgeId,
        scoringCriteriaId: score.scoringCriteria.id,
        value: score.value.toString(),
        comment: score.comment || ''
      });
    } else {
      setFormData({
        judgeId: '',
        scoringCriteriaId: '',
        value: '',
        comment: ''
      });
    }
  }, [score]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.judgeId || !formData.scoringCriteriaId || !formData.value) {
      toast.error('请填写所有必填字段');
      return;
    }

    const valueNum = parseFloat(formData.value);

    // 验证分数格式和精度
    if (isNaN(valueNum) || valueNum < 0) {
      toast.error('分数必须是大于等于0的数字');
      return;
    }

    // 验证小数位数不超过2位
    const decimalPlaces = (formData.value.split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      toast.error('分数最多支持小数点后两位');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/programs/${programId}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          judgeId: formData.judgeId,
          scoringCriteriaId: formData.scoringCriteriaId,
          value: valueNum,
          comment: formData.comment || null,
        }),
      });

      if (response.ok) {
        toast.success(score ? '评分修改成功' : '评分添加成功');
        onScoreUpdated();
        onOpenChange(false);
      } else {
        const error = await response.json();
        toast.error(error.error || '操作失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const selectedCriteria = criteria.find(c => c.id === formData.scoringCriteriaId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {score ? '修改评分' : '添加评分'}
          </DialogTitle>
          <DialogDescription>
            {score ? '修改现有的评分记录' : '为此节目添加新的评分记录'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="judgeId">评委 *</Label>
            <Select
              value={formData.judgeId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, judgeId: value }))}
              disabled={!!score} // 编辑时不允许修改评委
            >
              <SelectTrigger>
                <SelectValue placeholder="选择评委" />
              </SelectTrigger>
              <SelectContent>
                {judges.map(judge => (
                  <SelectItem key={judge.id} value={judge.id}>
                    {judge.name} ({judge.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scoringCriteriaId">评分标准 *</Label>
            <Select
              value={formData.scoringCriteriaId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, scoringCriteriaId: value }))}
              disabled={!!score} // 编辑时不允许修改评分标准
            >
              <SelectTrigger>
                <SelectValue placeholder="选择评分标准" />
              </SelectTrigger>
              <SelectContent>
                {criteria.map(criterion => (
                  <SelectItem key={criterion.id} value={criterion.id}>
                    {criterion.name} (满分: {criterion.maxScore}, 权重: {criterion.weight})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">分数 *</Label>
            <p className="text-sm text-muted-foreground">
              请输入分数，支持小数点后两位
            </p>
            <Input
              id="value"
              type="number"
              step="0.01"
              min="0"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              placeholder="输入分数"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">评语 (可选)</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="输入评语..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {score ? '更新评分' : '添加评分'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 