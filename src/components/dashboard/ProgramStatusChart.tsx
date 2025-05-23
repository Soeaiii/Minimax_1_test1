import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ListMusic } from 'lucide-react';

interface ProgramStatusChartProps {
  data: {
    total: number;
    waiting: number;
    performing: number;
    completed: number;
  };
}

export function ProgramStatusChart({ data }: ProgramStatusChartProps) {
  const { total, waiting, performing, completed } = data;
  
  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const statusItems = [
    {
      label: '等待中',
      value: waiting,
      percentage: getPercentage(waiting),
      color: 'bg-yellow-500',
    },
    {
      label: '表演中',
      value: performing,
      percentage: getPercentage(performing),
      color: 'bg-blue-500',
    },
    {
      label: '已完成',
      value: completed,
      percentage: getPercentage(completed),
      color: 'bg-green-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListMusic className="h-5 w-5" />
          节目状态分布
        </CardTitle>
        <CardDescription>
          所有节目的状态分布情况
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{total}</div>
            <p className="text-sm text-muted-foreground">总节目数</p>
          </div>
          
          <div className="space-y-3">
            {statusItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                  <span className="font-medium">
                    {item.value} ({item.percentage}%)
                  </span>
                </div>
                <Progress 
                  value={item.percentage} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 