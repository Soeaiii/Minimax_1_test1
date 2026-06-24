'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Printer, Award, Medal, Star, Trophy } from 'lucide-react';

interface ProgramRanking {
  programId: string;
  programName: string;
  rank: number;
  totalScore: number;
  participants: { id: string; name: string; team?: string }[];
}

const TEMPLATES = [
  { id: 'gold', name: '金奖', color: '#FFD700', bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-400', icon: Medal },
  { id: 'silver', name: '银奖', color: '#C0C0C0', bg: 'from-gray-50 to-slate-100', border: 'border-gray-400', icon: Medal },
  { id: 'bronze', name: '铜奖', color: '#CD7F32', bg: 'from-amber-50 to-orange-50', border: 'border-amber-600', icon: Medal },
  { id: 'excellence', name: '优秀奖', color: '#4F46E5', bg: 'from-indigo-50 to-blue-50', border: 'border-indigo-400', icon: Star },
  { id: 'participation', name: '参赛证书', color: '#6B7280', bg: 'from-gray-50 to-white', border: 'border-gray-300', icon: Award },
];

export default function CertificatePage() {
  const params = useParams();
  const competitionId = params.id as string;
  const [rankings, setRankings] = useState<ProgramRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState('gold');
  const [selectedRank, setSelectedRank] = useState<number | null>(null);
  const [competitionName, setCompetitionName] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/competitions/${competitionId}`);
        const data = await res.json();
        if (!data || data.error) { setLoading(false); return; }
        setCompetitionName(data.name || '');
        const rankingsData = (data.rankings || []).map((r: any) => ({
        programId: r.program?.id || r.programId,
        programName: r.program?.name || '',
        rank: r.rank,
        totalScore: r.totalScore,
        participants: (r.program?.participantPrograms || []).map((pp: any) => ({
          id: pp.participant?.id || pp.participantId,
          name: pp.participant?.name || '',
          team: pp.participant?.team,
        })),
      }));
      setRankings(rankingsData);
      } catch {
        // ignore fetch errors
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [competitionId]);

  const templateDef = TEMPLATES.find(t => t.id === template)!;

  const filteredRankings = selectedRank !== null
    ? rankings.filter(r => r.rank === selectedRank)
    : rankings;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">证书管理</h1>
          <p className="text-muted-foreground">{competitionName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TEMPLATES.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedRank?.toString() || 'all'} onValueChange={v => setSelectedRank(v === 'all' ? null : parseInt(v))}>
            <SelectTrigger className="w-32"><SelectValue placeholder="排名" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {rankings.map(r => <SelectItem key={r.rank} value={r.rank.toString()}>第{r.rank}名</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />打印证书</Button>
        </div>
      </div>

      {/* 证书预览区（可打印） */}
      <div className="certificate-print-area space-y-8">
        {filteredRankings.map((ranking) => (
          <div key={ranking.programId} className={`page-break ${templateDef.border}`}>
            {ranking.participants.map((participant, pi) => (
              <div key={pi} className={`certificate-page ${templateDef.bg} border-4 mx-auto max-w-2xl p-8 rounded-lg bg-gradient-to-br text-center space-y-6 shadow-lg my-4`}
                style={{ borderColor: templateDef.color }}>
                <div className="space-y-2">
                  <Trophy className="h-12 w-12 mx-auto" style={{ color: templateDef.color }} />
                  <h1 className="text-3xl font-serif font-bold" style={{ color: templateDef.color }}>
                    荣 誉 证 书
                  </h1>
                </div>
                <div className="space-y-1 text-lg">
                  <p>{participant.team ? `${participant.team} 的 ` : ''}</p>
                  <p className="font-bold text-2xl">{participant.name}</p>
                </div>
                <div className="space-y-1">
                  <p>在 <strong>{competitionName}</strong></p>
                  <p>节目 <strong>《{ranking.programName}》</strong></p>
                  <p className="mt-2">荣获</p>
                  <p className="text-3xl font-bold" style={{ color: templateDef.color }}>
                    {templateDef.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    总分：{ranking.totalScore.toFixed(1)} 分 &nbsp;|&nbsp; 排名：第 {ranking.rank} 名
                  </p>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground pt-8 border-t">
                  <span>主办方：{competitionName}</span>
                  <span>{new Date().toLocaleDateString('zh-CN')}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  证书编号：{ranking.programId.slice(0, 8)}-{participant.id.slice(0, 8)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {rankings.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">暂无排名数据，请等待比赛完成后生成排名。</div>
      )}

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .certificate-print-area, .certificate-print-area * { visibility: visible; }
          .certificate-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .certificate-page { break-inside: avoid; page-break-after: always; margin: 0 auto; }
        }
      `}</style>
    </div>
  );
}
