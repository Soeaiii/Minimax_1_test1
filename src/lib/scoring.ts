/**
 * 评分规则配置
 */
export interface ScoringConfig {
  dropHighest: boolean;  // 是否去掉最高分
  dropLowest: boolean;   // 是否去掉最低分
  dropCount: number;     // 去掉的极端分数数量（默认1）
}

/**
 * 应用去极值规则计算平均分
 * @param scores 原始分数数组
 * @param config 评分规则配置
 * @returns 处理后的平均分
 */
export function applyScoringRules(scores: number[], config?: ScoringConfig | null): number {
  if (!scores || scores.length === 0) return 0;
  if (!config || (!config.dropHighest && !config.dropLowest)) {
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  const sorted = [...scores].sort((a, b) => a - b);
  const dropCount = Math.min(config.dropCount || 1, Math.floor(sorted.length / 3)); // 最多去掉1/3

  let start = 0;
  let end = sorted.length;

  if (config.dropLowest) {
    start = dropCount;
  }
  if (config.dropHighest) {
    end = sorted.length - dropCount;
  }

  if (start >= end) {
    // 如果去掉后没有剩余分数，返回原始平均
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  const remaining = sorted.slice(start, end);
  return remaining.reduce((a, b) => a + b, 0) / remaining.length;
}

/**
 * 按评委分组计算去极值后的总分
 * @param judgeScores Map<judgeId, { scores: number[] }>
 * @param config 评分规则
 * @returns Map<judgeId, number> 每个评委的最终分
 */
export function calculateJudgeTotals(
  judgeScoreMap: Map<string, number[]>,
  config?: ScoringConfig | null,
): Map<string, number> {
  const result = new Map<string, number>();
  judgeScoreMap.forEach((scores, judgeId) => {
    result.set(judgeId, applyScoringRules(scores, config));
  });
  return result;
}

/**
 * 计算节目最终得分（所有评委分的平均）
 * @param judgeTotals 各评委的最终分
 * @param config 评分规则
 * @returns 节目的最终得分
 */
export function calculateProgramFinalScore(
  judgeTotals: Map<string, number>,
  config?: ScoringConfig | null,
): number {
  const values = Array.from(judgeTotals.values());
  if (values.length === 0) return 0;
  return applyScoringRules(values, config);
}
