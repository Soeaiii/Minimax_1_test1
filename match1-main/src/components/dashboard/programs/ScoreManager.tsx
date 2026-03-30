'use client';

import { useState, useEffect } from 'react';
import { ScoreDisplay } from './ScoreDisplay';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  createdAt: string | Date;
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

interface ScoreManagerProps {
  programId: string;
  competitionId: string;
  initialScores: Score[];
  canEdit: boolean;
}

export function ScoreManager({ programId, competitionId, initialScores, canEdit }: ScoreManagerProps) {
  const [scores, setScores] = useState<Score[]>(initialScores);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [criteria, setCriteria] = useState<ScoringCriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取评委和评分标准数据
  useEffect(() => {
    async function fetchData() {
      try {
        const [judgesResponse, scoresResponse] = await Promise.all([
          fetch(`/api/competitions/${competitionId}/judges-and-criteria`),
          fetch(`/api/programs/${programId}/scores`)
        ]);

        if (judgesResponse.ok) {
          const judgesData = await judgesResponse.json();
          setJudges(judgesData.judges || []);
          setCriteria(judgesData.criteria || []);
        }

        if (scoresResponse.ok) {
          const scoresData = await scoresResponse.json();
          setScores(scoresData);
        }
      } catch (error) {
        setError('获取数据失败');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [programId, competitionId]);

  // 刷新评分数据
  const handleScoresUpdated = async () => {
    try {
      const response = await fetch(`/api/programs/${programId}/scores`);
      if (response.ok) {
        const scoresData = await response.json();
        setScores(scoresData);
      }
    } catch (error) {
      console.error('Error refreshing scores:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <ScoreDisplay
      scores={scores}
      programId={programId}
      judges={judges}
      criteria={criteria}
      canEdit={canEdit}
      onScoresUpdated={handleScoresUpdated}
    />
  );
} 