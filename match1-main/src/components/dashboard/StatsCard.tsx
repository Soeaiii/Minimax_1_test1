import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  progress?: {
    value: number;
    max: number;
    label: string;
  };
  badges?: Array<{
    label: string;
    value: number;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }>;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  progress, 
  badges,
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        
        {trend && (
          <div className="flex items-center mt-2 text-xs">
            <span className={cn(
              "font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}
        
        {progress && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{progress.label}</span>
              <span className="font-medium">{progress.value}/{progress.max}</span>
            </div>
            <Progress 
              value={(progress.value / progress.max) * 100} 
              className="h-2"
            />
          </div>
        )}
        
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {badges.map((badge, index) => (
              <Badge 
                key={index} 
                variant={badge.variant || 'secondary'}
                className="text-xs"
              >
                {badge.label}: {badge.value}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 