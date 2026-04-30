// 用户角色
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'ORGANIZER' | 'JUDGE' | 'USER';

// 比赛状态
export type CompetitionStatus = 'PENDING' | 'ACTIVE' | 'FINISHED' | 'ARCHIVED';

// 排名更新模式
export type RankingUpdateMode = 'REALTIME' | 'BATCH';

// 节目状态
export type ProgramStatus = 'WAITING' | 'PERFORMING' | 'COMPLETED';

// 排名更新类型
export type UpdateType = 'AUTO' | 'MANUAL';

// NextAuth session strategy
export type SessionStrategy = 'jwt' | 'database'; 