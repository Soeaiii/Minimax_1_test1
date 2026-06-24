'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Trophy, Medal, Star } from 'lucide-react';

interface CriteriaScore {
  name: string;
  weight: number;
  avgScore: number;
  judgeCount: number;
}

interface ProgramResult {
  id: string;
  name: string;
  order: number;
  status: string;
  criteriaScores: CriteriaScore[];
  ranking: { rank: number; totalScore: number } | null;
}

interface ParticipantResult {
  id: string;
  name: string;
  team?: string;
  programs: ProgramResult[];
}

interface QueryData {
  competitionName: string;
  results: ParticipantResult[];
}

export default function ScoreQueryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const competitionId = params.competitionId as string;
  const token = searchParams.get('token') || '';

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<QueryData | null>(null);

  const handleQuery = async () => {
    if (!name.trim()) {
      setError('请输入姓名');
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/public/score-query/${competitionId}?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim() || undefined }),
      });
      const body = await res.json();
      if (res.ok) {
        setData(body.data);
      } else {
        setError(body.error || '查询失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Medal className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Search className="h-6 w-6" />
            成绩查询
          </CardTitle>
          <CardDescription>输入您的姓名查询比赛成绩</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 查询表单 */}
          <div className="flex gap-2">
            <Input
              placeholder="请输入您的姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
              className="flex-1"
            />
            <Input
              placeholder="联系方式（选填）"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
              className="flex-1"
            />
            <Button onClick={handleQuery} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {/* 查询结果 */}
          {data && data.results.length > 0 && (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                比赛：{data.competitionName}
              </div>
              {data.results.map((participant) => (
                <div key={participant.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{participant.name}</h3>
                      {participant.team && (
                        <p className="text-sm text-muted-foreground">{participant.team}</p>
                      )}
                    </div>
                  </div>

                  {participant.programs.map((program) => (
                    <Card key={program.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{program.name}</p>
                            <p className="text-xs text-muted-foreground">序号 #{program.order}</p>
                          </div>
                          {program.ranking && (
                            <div className="flex items-center gap-1">
                              {getRankBadge(program.ranking.rank)}
                              <span className="font-bold text-lg">
                                第 {program.ranking.rank} 名
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 评分维度 */}
                        {program.criteriaScores.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {program.criteriaScores.map((c, i) => (
                              <div key={i} className="bg-gray-50 rounded p-2 text-center">
                                <div className="text-xs text-muted-foreground">{c.name}</div>
                                <div className="font-bold text-blue-600">{c.avgScore}</div>
                                <div className="text-xs text-muted-foreground">
                                  {c.judgeCount}位评委打分
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {program.ranking && (
                          <div className="text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-sm font-medium">
                                总分: {program.ranking.totalScore.toFixed(1)}
                              </span>
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          )}

          {data && data.results.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              未找到相关成绩
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
