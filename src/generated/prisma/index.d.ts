
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Competition
 * 
 */
export type Competition = $Result.DefaultSelection<Prisma.$CompetitionPayload>
/**
 * Model ScoringCriteria
 * 
 */
export type ScoringCriteria = $Result.DefaultSelection<Prisma.$ScoringCriteriaPayload>
/**
 * Model Participant
 * 
 */
export type Participant = $Result.DefaultSelection<Prisma.$ParticipantPayload>
/**
 * Model Program
 * 
 */
export type Program = $Result.DefaultSelection<Prisma.$ProgramPayload>
/**
 * Model Score
 * 
 */
export type Score = $Result.DefaultSelection<Prisma.$ScorePayload>
/**
 * Model Ranking
 * 
 */
export type Ranking = $Result.DefaultSelection<Prisma.$RankingPayload>
/**
 * Model File
 * 
 */
export type File = $Result.DefaultSelection<Prisma.$FilePayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
  JUDGE: 'JUDGE',
  USER: 'USER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const CompetitionStatus: {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
  ARCHIVED: 'ARCHIVED'
};

export type CompetitionStatus = (typeof CompetitionStatus)[keyof typeof CompetitionStatus]


export const RankingUpdateMode: {
  REALTIME: 'REALTIME',
  BATCH: 'BATCH'
};

export type RankingUpdateMode = (typeof RankingUpdateMode)[keyof typeof RankingUpdateMode]


export const ProgramStatus: {
  WAITING: 'WAITING',
  PERFORMING: 'PERFORMING',
  COMPLETED: 'COMPLETED'
};

export type ProgramStatus = (typeof ProgramStatus)[keyof typeof ProgramStatus]


export const UpdateType: {
  AUTO: 'AUTO',
  MANUAL: 'MANUAL'
};

export type UpdateType = (typeof UpdateType)[keyof typeof UpdateType]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type CompetitionStatus = $Enums.CompetitionStatus

export const CompetitionStatus: typeof $Enums.CompetitionStatus

export type RankingUpdateMode = $Enums.RankingUpdateMode

export const RankingUpdateMode: typeof $Enums.RankingUpdateMode

export type ProgramStatus = $Enums.ProgramStatus

export const ProgramStatus: typeof $Enums.ProgramStatus

export type UpdateType = $Enums.UpdateType

export const UpdateType: typeof $Enums.UpdateType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.competition`: Exposes CRUD operations for the **Competition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Competitions
    * const competitions = await prisma.competition.findMany()
    * ```
    */
  get competition(): Prisma.CompetitionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scoringCriteria`: Exposes CRUD operations for the **ScoringCriteria** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScoringCriteria
    * const scoringCriteria = await prisma.scoringCriteria.findMany()
    * ```
    */
  get scoringCriteria(): Prisma.ScoringCriteriaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.participant`: Exposes CRUD operations for the **Participant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Participants
    * const participants = await prisma.participant.findMany()
    * ```
    */
  get participant(): Prisma.ParticipantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.program`: Exposes CRUD operations for the **Program** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Programs
    * const programs = await prisma.program.findMany()
    * ```
    */
  get program(): Prisma.ProgramDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.score`: Exposes CRUD operations for the **Score** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Scores
    * const scores = await prisma.score.findMany()
    * ```
    */
  get score(): Prisma.ScoreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ranking`: Exposes CRUD operations for the **Ranking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rankings
    * const rankings = await prisma.ranking.findMany()
    * ```
    */
  get ranking(): Prisma.RankingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.file`: Exposes CRUD operations for the **File** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Files
    * const files = await prisma.file.findMany()
    * ```
    */
  get file(): Prisma.FileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Competition: 'Competition',
    ScoringCriteria: 'ScoringCriteria',
    Participant: 'Participant',
    Program: 'Program',
    Score: 'Score',
    Ranking: 'Ranking',
    File: 'File',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "competition" | "scoringCriteria" | "participant" | "program" | "score" | "ranking" | "file" | "auditLog"
      txIsolationLevel: never
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.UserFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.UserAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Competition: {
        payload: Prisma.$CompetitionPayload<ExtArgs>
        fields: Prisma.CompetitionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompetitionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompetitionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompetitionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompetitionPayload>
          }
          findFirst: {
            args: Prisma.CompetitionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompetitionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompetitionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompetitionPayload>
          }
          findMany: {
            args: Prisma.CompetitionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompetitionPayload>[]
          }
          create: {
            args: Prisma.CompetitionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompetitionPayload>
          }
          createMany: {
            args: Prisma.CompetitionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CompetitionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompetitionPayload>
          }
          update: {
            args: Prisma.CompetitionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompetitionPayload>
          }
          deleteMany: {
            args: Prisma.CompetitionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompetitionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CompetitionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompetitionPayload>
          }
          aggregate: {
            args: Prisma.CompetitionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompetition>
          }
          groupBy: {
            args: Prisma.CompetitionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompetitionGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.CompetitionFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.CompetitionAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.CompetitionCountArgs<ExtArgs>
            result: $Utils.Optional<CompetitionCountAggregateOutputType> | number
          }
        }
      }
      ScoringCriteria: {
        payload: Prisma.$ScoringCriteriaPayload<ExtArgs>
        fields: Prisma.ScoringCriteriaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScoringCriteriaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoringCriteriaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScoringCriteriaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoringCriteriaPayload>
          }
          findFirst: {
            args: Prisma.ScoringCriteriaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoringCriteriaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScoringCriteriaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoringCriteriaPayload>
          }
          findMany: {
            args: Prisma.ScoringCriteriaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoringCriteriaPayload>[]
          }
          create: {
            args: Prisma.ScoringCriteriaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoringCriteriaPayload>
          }
          createMany: {
            args: Prisma.ScoringCriteriaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ScoringCriteriaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoringCriteriaPayload>
          }
          update: {
            args: Prisma.ScoringCriteriaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoringCriteriaPayload>
          }
          deleteMany: {
            args: Prisma.ScoringCriteriaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScoringCriteriaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ScoringCriteriaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoringCriteriaPayload>
          }
          aggregate: {
            args: Prisma.ScoringCriteriaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScoringCriteria>
          }
          groupBy: {
            args: Prisma.ScoringCriteriaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScoringCriteriaGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ScoringCriteriaFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ScoringCriteriaAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ScoringCriteriaCountArgs<ExtArgs>
            result: $Utils.Optional<ScoringCriteriaCountAggregateOutputType> | number
          }
        }
      }
      Participant: {
        payload: Prisma.$ParticipantPayload<ExtArgs>
        fields: Prisma.ParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          findFirst: {
            args: Prisma.ParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          findMany: {
            args: Prisma.ParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>[]
          }
          create: {
            args: Prisma.ParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          createMany: {
            args: Prisma.ParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          update: {
            args: Prisma.ParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          deleteMany: {
            args: Prisma.ParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          aggregate: {
            args: Prisma.ParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateParticipant>
          }
          groupBy: {
            args: Prisma.ParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ParticipantGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ParticipantFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ParticipantAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<ParticipantCountAggregateOutputType> | number
          }
        }
      }
      Program: {
        payload: Prisma.$ProgramPayload<ExtArgs>
        fields: Prisma.ProgramFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgramFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgramFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          findFirst: {
            args: Prisma.ProgramFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgramFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          findMany: {
            args: Prisma.ProgramFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>[]
          }
          create: {
            args: Prisma.ProgramCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          createMany: {
            args: Prisma.ProgramCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProgramDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          update: {
            args: Prisma.ProgramUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          deleteMany: {
            args: Prisma.ProgramDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgramUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProgramUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          aggregate: {
            args: Prisma.ProgramAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgram>
          }
          groupBy: {
            args: Prisma.ProgramGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgramGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ProgramFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ProgramAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ProgramCountArgs<ExtArgs>
            result: $Utils.Optional<ProgramCountAggregateOutputType> | number
          }
        }
      }
      Score: {
        payload: Prisma.$ScorePayload<ExtArgs>
        fields: Prisma.ScoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScorePayload>
          }
          findFirst: {
            args: Prisma.ScoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScorePayload>
          }
          findMany: {
            args: Prisma.ScoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScorePayload>[]
          }
          create: {
            args: Prisma.ScoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScorePayload>
          }
          createMany: {
            args: Prisma.ScoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ScoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScorePayload>
          }
          update: {
            args: Prisma.ScoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScorePayload>
          }
          deleteMany: {
            args: Prisma.ScoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ScoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScorePayload>
          }
          aggregate: {
            args: Prisma.ScoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScore>
          }
          groupBy: {
            args: Prisma.ScoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScoreGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ScoreFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ScoreAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ScoreCountArgs<ExtArgs>
            result: $Utils.Optional<ScoreCountAggregateOutputType> | number
          }
        }
      }
      Ranking: {
        payload: Prisma.$RankingPayload<ExtArgs>
        fields: Prisma.RankingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RankingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RankingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingPayload>
          }
          findFirst: {
            args: Prisma.RankingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RankingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingPayload>
          }
          findMany: {
            args: Prisma.RankingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingPayload>[]
          }
          create: {
            args: Prisma.RankingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingPayload>
          }
          createMany: {
            args: Prisma.RankingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RankingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingPayload>
          }
          update: {
            args: Prisma.RankingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingPayload>
          }
          deleteMany: {
            args: Prisma.RankingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RankingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RankingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingPayload>
          }
          aggregate: {
            args: Prisma.RankingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRanking>
          }
          groupBy: {
            args: Prisma.RankingGroupByArgs<ExtArgs>
            result: $Utils.Optional<RankingGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.RankingFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.RankingAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.RankingCountArgs<ExtArgs>
            result: $Utils.Optional<RankingCountAggregateOutputType> | number
          }
        }
      }
      File: {
        payload: Prisma.$FilePayload<ExtArgs>
        fields: Prisma.FileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findFirst: {
            args: Prisma.FileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findMany: {
            args: Prisma.FileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          create: {
            args: Prisma.FileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          createMany: {
            args: Prisma.FileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.FileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          update: {
            args: Prisma.FileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          deleteMany: {
            args: Prisma.FileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          aggregate: {
            args: Prisma.FileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFile>
          }
          groupBy: {
            args: Prisma.FileGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.FileFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.FileAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.FileCountArgs<ExtArgs>
            result: $Utils.Optional<FileCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AuditLogFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AuditLogAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    competition?: CompetitionOmit
    scoringCriteria?: ScoringCriteriaOmit
    participant?: ParticipantOmit
    program?: ProgramOmit
    score?: ScoreOmit
    ranking?: RankingOmit
    file?: FileOmit
    auditLog?: AuditLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    competitions: number
    auditLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    competitions?: boolean | UserCountOutputTypeCountCompetitionsArgs
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCompetitionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompetitionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type CompetitionCountOutputType
   */

  export type CompetitionCountOutputType = {
    programs: number
    scoringCriteria: number
    rankings: number
    files: number
  }

  export type CompetitionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programs?: boolean | CompetitionCountOutputTypeCountProgramsArgs
    scoringCriteria?: boolean | CompetitionCountOutputTypeCountScoringCriteriaArgs
    rankings?: boolean | CompetitionCountOutputTypeCountRankingsArgs
    files?: boolean | CompetitionCountOutputTypeCountFilesArgs
  }

  // Custom InputTypes
  /**
   * CompetitionCountOutputType without action
   */
  export type CompetitionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompetitionCountOutputType
     */
    select?: CompetitionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompetitionCountOutputType without action
   */
  export type CompetitionCountOutputTypeCountProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramWhereInput
  }

  /**
   * CompetitionCountOutputType without action
   */
  export type CompetitionCountOutputTypeCountScoringCriteriaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScoringCriteriaWhereInput
  }

  /**
   * CompetitionCountOutputType without action
   */
  export type CompetitionCountOutputTypeCountRankingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RankingWhereInput
  }

  /**
   * CompetitionCountOutputType without action
   */
  export type CompetitionCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
  }


  /**
   * Count Type ScoringCriteriaCountOutputType
   */

  export type ScoringCriteriaCountOutputType = {
    scores: number
  }

  export type ScoringCriteriaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scores?: boolean | ScoringCriteriaCountOutputTypeCountScoresArgs
  }

  // Custom InputTypes
  /**
   * ScoringCriteriaCountOutputType without action
   */
  export type ScoringCriteriaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteriaCountOutputType
     */
    select?: ScoringCriteriaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ScoringCriteriaCountOutputType without action
   */
  export type ScoringCriteriaCountOutputTypeCountScoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScoreWhereInput
  }


  /**
   * Count Type ParticipantCountOutputType
   */

  export type ParticipantCountOutputType = {
    programs: number
  }

  export type ParticipantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programs?: boolean | ParticipantCountOutputTypeCountProgramsArgs
  }

  // Custom InputTypes
  /**
   * ParticipantCountOutputType without action
   */
  export type ParticipantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantCountOutputType
     */
    select?: ParticipantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ParticipantCountOutputType without action
   */
  export type ParticipantCountOutputTypeCountProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramWhereInput
  }


  /**
   * Count Type ProgramCountOutputType
   */

  export type ProgramCountOutputType = {
    participants: number
    attachments: number
    scores: number
  }

  export type ProgramCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | ProgramCountOutputTypeCountParticipantsArgs
    attachments?: boolean | ProgramCountOutputTypeCountAttachmentsArgs
    scores?: boolean | ProgramCountOutputTypeCountScoresArgs
  }

  // Custom InputTypes
  /**
   * ProgramCountOutputType without action
   */
  export type ProgramCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramCountOutputType
     */
    select?: ProgramCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProgramCountOutputType without action
   */
  export type ProgramCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantWhereInput
  }

  /**
   * ProgramCountOutputType without action
   */
  export type ProgramCountOutputTypeCountAttachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
  }

  /**
   * ProgramCountOutputType without action
   */
  export type ProgramCountOutputTypeCountScoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScoreWhereInput
  }


  /**
   * Count Type FileCountOutputType
   */

  export type FileCountOutputType = {
    programs: number
    competitions: number
    backgroundImageCompetitions: number
  }

  export type FileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programs?: boolean | FileCountOutputTypeCountProgramsArgs
    competitions?: boolean | FileCountOutputTypeCountCompetitionsArgs
    backgroundImageCompetitions?: boolean | FileCountOutputTypeCountBackgroundImageCompetitionsArgs
  }

  // Custom InputTypes
  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileCountOutputType
     */
    select?: FileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramWhereInput
  }

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountCompetitionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompetitionWhereInput
  }

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountBackgroundImageCompetitionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompetitionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    role: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    competitions?: boolean | User$competitionsArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    competitions?: boolean | User$competitionsArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      competitions: Prisma.$CompetitionPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      role: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * @param {UserFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const user = await prisma.user.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: UserFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a User.
     * @param {UserAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const user = await prisma.user.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: UserAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    competitions<T extends User$competitionsArgs<ExtArgs> = {}>(args?: Subset<T, User$competitionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User findRaw
   */
  export type UserFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * User aggregateRaw
   */
  export type UserAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * User.competitions
   */
  export type User$competitionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    where?: CompetitionWhereInput
    orderBy?: CompetitionOrderByWithRelationInput | CompetitionOrderByWithRelationInput[]
    cursor?: CompetitionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CompetitionScalarFieldEnum | CompetitionScalarFieldEnum[]
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Competition
   */

  export type AggregateCompetition = {
    _count: CompetitionCountAggregateOutputType | null
    _min: CompetitionMinAggregateOutputType | null
    _max: CompetitionMaxAggregateOutputType | null
  }

  export type CompetitionMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    organizerId: string | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.CompetitionStatus | null
    backgroundImageId: string | null
    rankingUpdateMode: $Enums.RankingUpdateMode | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompetitionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    organizerId: string | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.CompetitionStatus | null
    backgroundImageId: string | null
    rankingUpdateMode: $Enums.RankingUpdateMode | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompetitionCountAggregateOutputType = {
    id: number
    name: number
    description: number
    organizerId: number
    startTime: number
    endTime: number
    status: number
    backgroundImageId: number
    rankingUpdateMode: number
    createdAt: number
    updatedAt: number
    fileIds: number
    _all: number
  }


  export type CompetitionMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    organizerId?: true
    startTime?: true
    endTime?: true
    status?: true
    backgroundImageId?: true
    rankingUpdateMode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompetitionMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    organizerId?: true
    startTime?: true
    endTime?: true
    status?: true
    backgroundImageId?: true
    rankingUpdateMode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompetitionCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    organizerId?: true
    startTime?: true
    endTime?: true
    status?: true
    backgroundImageId?: true
    rankingUpdateMode?: true
    createdAt?: true
    updatedAt?: true
    fileIds?: true
    _all?: true
  }

  export type CompetitionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Competition to aggregate.
     */
    where?: CompetitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Competitions to fetch.
     */
    orderBy?: CompetitionOrderByWithRelationInput | CompetitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompetitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Competitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Competitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Competitions
    **/
    _count?: true | CompetitionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompetitionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompetitionMaxAggregateInputType
  }

  export type GetCompetitionAggregateType<T extends CompetitionAggregateArgs> = {
        [P in keyof T & keyof AggregateCompetition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompetition[P]>
      : GetScalarType<T[P], AggregateCompetition[P]>
  }




  export type CompetitionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompetitionWhereInput
    orderBy?: CompetitionOrderByWithAggregationInput | CompetitionOrderByWithAggregationInput[]
    by: CompetitionScalarFieldEnum[] | CompetitionScalarFieldEnum
    having?: CompetitionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompetitionCountAggregateInputType | true
    _min?: CompetitionMinAggregateInputType
    _max?: CompetitionMaxAggregateInputType
  }

  export type CompetitionGroupByOutputType = {
    id: string
    name: string
    description: string | null
    organizerId: string
    startTime: Date
    endTime: Date
    status: $Enums.CompetitionStatus
    backgroundImageId: string | null
    rankingUpdateMode: $Enums.RankingUpdateMode
    createdAt: Date
    updatedAt: Date
    fileIds: string[]
    _count: CompetitionCountAggregateOutputType | null
    _min: CompetitionMinAggregateOutputType | null
    _max: CompetitionMaxAggregateOutputType | null
  }

  type GetCompetitionGroupByPayload<T extends CompetitionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompetitionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompetitionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompetitionGroupByOutputType[P]>
            : GetScalarType<T[P], CompetitionGroupByOutputType[P]>
        }
      >
    >


  export type CompetitionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    organizerId?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    backgroundImageId?: boolean
    rankingUpdateMode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fileIds?: boolean
    organizer?: boolean | UserDefaultArgs<ExtArgs>
    programs?: boolean | Competition$programsArgs<ExtArgs>
    scoringCriteria?: boolean | Competition$scoringCriteriaArgs<ExtArgs>
    rankings?: boolean | Competition$rankingsArgs<ExtArgs>
    backgroundImage?: boolean | Competition$backgroundImageArgs<ExtArgs>
    files?: boolean | Competition$filesArgs<ExtArgs>
    _count?: boolean | CompetitionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["competition"]>



  export type CompetitionSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    organizerId?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    backgroundImageId?: boolean
    rankingUpdateMode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fileIds?: boolean
  }

  export type CompetitionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "organizerId" | "startTime" | "endTime" | "status" | "backgroundImageId" | "rankingUpdateMode" | "createdAt" | "updatedAt" | "fileIds", ExtArgs["result"]["competition"]>
  export type CompetitionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizer?: boolean | UserDefaultArgs<ExtArgs>
    programs?: boolean | Competition$programsArgs<ExtArgs>
    scoringCriteria?: boolean | Competition$scoringCriteriaArgs<ExtArgs>
    rankings?: boolean | Competition$rankingsArgs<ExtArgs>
    backgroundImage?: boolean | Competition$backgroundImageArgs<ExtArgs>
    files?: boolean | Competition$filesArgs<ExtArgs>
    _count?: boolean | CompetitionCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CompetitionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Competition"
    objects: {
      organizer: Prisma.$UserPayload<ExtArgs>
      programs: Prisma.$ProgramPayload<ExtArgs>[]
      scoringCriteria: Prisma.$ScoringCriteriaPayload<ExtArgs>[]
      rankings: Prisma.$RankingPayload<ExtArgs>[]
      backgroundImage: Prisma.$FilePayload<ExtArgs> | null
      files: Prisma.$FilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      organizerId: string
      startTime: Date
      endTime: Date
      status: $Enums.CompetitionStatus
      backgroundImageId: string | null
      rankingUpdateMode: $Enums.RankingUpdateMode
      createdAt: Date
      updatedAt: Date
      fileIds: string[]
    }, ExtArgs["result"]["competition"]>
    composites: {}
  }

  type CompetitionGetPayload<S extends boolean | null | undefined | CompetitionDefaultArgs> = $Result.GetResult<Prisma.$CompetitionPayload, S>

  type CompetitionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompetitionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompetitionCountAggregateInputType | true
    }

  export interface CompetitionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Competition'], meta: { name: 'Competition' } }
    /**
     * Find zero or one Competition that matches the filter.
     * @param {CompetitionFindUniqueArgs} args - Arguments to find a Competition
     * @example
     * // Get one Competition
     * const competition = await prisma.competition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompetitionFindUniqueArgs>(args: SelectSubset<T, CompetitionFindUniqueArgs<ExtArgs>>): Prisma__CompetitionClient<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Competition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompetitionFindUniqueOrThrowArgs} args - Arguments to find a Competition
     * @example
     * // Get one Competition
     * const competition = await prisma.competition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompetitionFindUniqueOrThrowArgs>(args: SelectSubset<T, CompetitionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompetitionClient<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Competition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompetitionFindFirstArgs} args - Arguments to find a Competition
     * @example
     * // Get one Competition
     * const competition = await prisma.competition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompetitionFindFirstArgs>(args?: SelectSubset<T, CompetitionFindFirstArgs<ExtArgs>>): Prisma__CompetitionClient<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Competition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompetitionFindFirstOrThrowArgs} args - Arguments to find a Competition
     * @example
     * // Get one Competition
     * const competition = await prisma.competition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompetitionFindFirstOrThrowArgs>(args?: SelectSubset<T, CompetitionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompetitionClient<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Competitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompetitionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Competitions
     * const competitions = await prisma.competition.findMany()
     * 
     * // Get first 10 Competitions
     * const competitions = await prisma.competition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const competitionWithIdOnly = await prisma.competition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompetitionFindManyArgs>(args?: SelectSubset<T, CompetitionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Competition.
     * @param {CompetitionCreateArgs} args - Arguments to create a Competition.
     * @example
     * // Create one Competition
     * const Competition = await prisma.competition.create({
     *   data: {
     *     // ... data to create a Competition
     *   }
     * })
     * 
     */
    create<T extends CompetitionCreateArgs>(args: SelectSubset<T, CompetitionCreateArgs<ExtArgs>>): Prisma__CompetitionClient<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Competitions.
     * @param {CompetitionCreateManyArgs} args - Arguments to create many Competitions.
     * @example
     * // Create many Competitions
     * const competition = await prisma.competition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompetitionCreateManyArgs>(args?: SelectSubset<T, CompetitionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Competition.
     * @param {CompetitionDeleteArgs} args - Arguments to delete one Competition.
     * @example
     * // Delete one Competition
     * const Competition = await prisma.competition.delete({
     *   where: {
     *     // ... filter to delete one Competition
     *   }
     * })
     * 
     */
    delete<T extends CompetitionDeleteArgs>(args: SelectSubset<T, CompetitionDeleteArgs<ExtArgs>>): Prisma__CompetitionClient<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Competition.
     * @param {CompetitionUpdateArgs} args - Arguments to update one Competition.
     * @example
     * // Update one Competition
     * const competition = await prisma.competition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompetitionUpdateArgs>(args: SelectSubset<T, CompetitionUpdateArgs<ExtArgs>>): Prisma__CompetitionClient<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Competitions.
     * @param {CompetitionDeleteManyArgs} args - Arguments to filter Competitions to delete.
     * @example
     * // Delete a few Competitions
     * const { count } = await prisma.competition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompetitionDeleteManyArgs>(args?: SelectSubset<T, CompetitionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Competitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompetitionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Competitions
     * const competition = await prisma.competition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompetitionUpdateManyArgs>(args: SelectSubset<T, CompetitionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Competition.
     * @param {CompetitionUpsertArgs} args - Arguments to update or create a Competition.
     * @example
     * // Update or create a Competition
     * const competition = await prisma.competition.upsert({
     *   create: {
     *     // ... data to create a Competition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Competition we want to update
     *   }
     * })
     */
    upsert<T extends CompetitionUpsertArgs>(args: SelectSubset<T, CompetitionUpsertArgs<ExtArgs>>): Prisma__CompetitionClient<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Competitions that matches the filter.
     * @param {CompetitionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const competition = await prisma.competition.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: CompetitionFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Competition.
     * @param {CompetitionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const competition = await prisma.competition.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: CompetitionAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Competitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompetitionCountArgs} args - Arguments to filter Competitions to count.
     * @example
     * // Count the number of Competitions
     * const count = await prisma.competition.count({
     *   where: {
     *     // ... the filter for the Competitions we want to count
     *   }
     * })
    **/
    count<T extends CompetitionCountArgs>(
      args?: Subset<T, CompetitionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompetitionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Competition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompetitionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompetitionAggregateArgs>(args: Subset<T, CompetitionAggregateArgs>): Prisma.PrismaPromise<GetCompetitionAggregateType<T>>

    /**
     * Group by Competition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompetitionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompetitionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompetitionGroupByArgs['orderBy'] }
        : { orderBy?: CompetitionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompetitionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompetitionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Competition model
   */
  readonly fields: CompetitionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Competition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompetitionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organizer<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    programs<T extends Competition$programsArgs<ExtArgs> = {}>(args?: Subset<T, Competition$programsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    scoringCriteria<T extends Competition$scoringCriteriaArgs<ExtArgs> = {}>(args?: Subset<T, Competition$scoringCriteriaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScoringCriteriaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    rankings<T extends Competition$rankingsArgs<ExtArgs> = {}>(args?: Subset<T, Competition$rankingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RankingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    backgroundImage<T extends Competition$backgroundImageArgs<ExtArgs> = {}>(args?: Subset<T, Competition$backgroundImageArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    files<T extends Competition$filesArgs<ExtArgs> = {}>(args?: Subset<T, Competition$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Competition model
   */
  interface CompetitionFieldRefs {
    readonly id: FieldRef<"Competition", 'String'>
    readonly name: FieldRef<"Competition", 'String'>
    readonly description: FieldRef<"Competition", 'String'>
    readonly organizerId: FieldRef<"Competition", 'String'>
    readonly startTime: FieldRef<"Competition", 'DateTime'>
    readonly endTime: FieldRef<"Competition", 'DateTime'>
    readonly status: FieldRef<"Competition", 'CompetitionStatus'>
    readonly backgroundImageId: FieldRef<"Competition", 'String'>
    readonly rankingUpdateMode: FieldRef<"Competition", 'RankingUpdateMode'>
    readonly createdAt: FieldRef<"Competition", 'DateTime'>
    readonly updatedAt: FieldRef<"Competition", 'DateTime'>
    readonly fileIds: FieldRef<"Competition", 'String[]'>
  }
    

  // Custom InputTypes
  /**
   * Competition findUnique
   */
  export type CompetitionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    /**
     * Filter, which Competition to fetch.
     */
    where: CompetitionWhereUniqueInput
  }

  /**
   * Competition findUniqueOrThrow
   */
  export type CompetitionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    /**
     * Filter, which Competition to fetch.
     */
    where: CompetitionWhereUniqueInput
  }

  /**
   * Competition findFirst
   */
  export type CompetitionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    /**
     * Filter, which Competition to fetch.
     */
    where?: CompetitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Competitions to fetch.
     */
    orderBy?: CompetitionOrderByWithRelationInput | CompetitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Competitions.
     */
    cursor?: CompetitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Competitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Competitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Competitions.
     */
    distinct?: CompetitionScalarFieldEnum | CompetitionScalarFieldEnum[]
  }

  /**
   * Competition findFirstOrThrow
   */
  export type CompetitionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    /**
     * Filter, which Competition to fetch.
     */
    where?: CompetitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Competitions to fetch.
     */
    orderBy?: CompetitionOrderByWithRelationInput | CompetitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Competitions.
     */
    cursor?: CompetitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Competitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Competitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Competitions.
     */
    distinct?: CompetitionScalarFieldEnum | CompetitionScalarFieldEnum[]
  }

  /**
   * Competition findMany
   */
  export type CompetitionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    /**
     * Filter, which Competitions to fetch.
     */
    where?: CompetitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Competitions to fetch.
     */
    orderBy?: CompetitionOrderByWithRelationInput | CompetitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Competitions.
     */
    cursor?: CompetitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Competitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Competitions.
     */
    skip?: number
    distinct?: CompetitionScalarFieldEnum | CompetitionScalarFieldEnum[]
  }

  /**
   * Competition create
   */
  export type CompetitionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    /**
     * The data needed to create a Competition.
     */
    data: XOR<CompetitionCreateInput, CompetitionUncheckedCreateInput>
  }

  /**
   * Competition createMany
   */
  export type CompetitionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Competitions.
     */
    data: CompetitionCreateManyInput | CompetitionCreateManyInput[]
  }

  /**
   * Competition update
   */
  export type CompetitionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    /**
     * The data needed to update a Competition.
     */
    data: XOR<CompetitionUpdateInput, CompetitionUncheckedUpdateInput>
    /**
     * Choose, which Competition to update.
     */
    where: CompetitionWhereUniqueInput
  }

  /**
   * Competition updateMany
   */
  export type CompetitionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Competitions.
     */
    data: XOR<CompetitionUpdateManyMutationInput, CompetitionUncheckedUpdateManyInput>
    /**
     * Filter which Competitions to update
     */
    where?: CompetitionWhereInput
    /**
     * Limit how many Competitions to update.
     */
    limit?: number
  }

  /**
   * Competition upsert
   */
  export type CompetitionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    /**
     * The filter to search for the Competition to update in case it exists.
     */
    where: CompetitionWhereUniqueInput
    /**
     * In case the Competition found by the `where` argument doesn't exist, create a new Competition with this data.
     */
    create: XOR<CompetitionCreateInput, CompetitionUncheckedCreateInput>
    /**
     * In case the Competition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompetitionUpdateInput, CompetitionUncheckedUpdateInput>
  }

  /**
   * Competition delete
   */
  export type CompetitionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    /**
     * Filter which Competition to delete.
     */
    where: CompetitionWhereUniqueInput
  }

  /**
   * Competition deleteMany
   */
  export type CompetitionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Competitions to delete
     */
    where?: CompetitionWhereInput
    /**
     * Limit how many Competitions to delete.
     */
    limit?: number
  }

  /**
   * Competition findRaw
   */
  export type CompetitionFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Competition aggregateRaw
   */
  export type CompetitionAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Competition.programs
   */
  export type Competition$programsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    where?: ProgramWhereInput
    orderBy?: ProgramOrderByWithRelationInput | ProgramOrderByWithRelationInput[]
    cursor?: ProgramWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[]
  }

  /**
   * Competition.scoringCriteria
   */
  export type Competition$scoringCriteriaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteria
     */
    select?: ScoringCriteriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoringCriteria
     */
    omit?: ScoringCriteriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoringCriteriaInclude<ExtArgs> | null
    where?: ScoringCriteriaWhereInput
    orderBy?: ScoringCriteriaOrderByWithRelationInput | ScoringCriteriaOrderByWithRelationInput[]
    cursor?: ScoringCriteriaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScoringCriteriaScalarFieldEnum | ScoringCriteriaScalarFieldEnum[]
  }

  /**
   * Competition.rankings
   */
  export type Competition$rankingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
    where?: RankingWhereInput
    orderBy?: RankingOrderByWithRelationInput | RankingOrderByWithRelationInput[]
    cursor?: RankingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RankingScalarFieldEnum | RankingScalarFieldEnum[]
  }

  /**
   * Competition.backgroundImage
   */
  export type Competition$backgroundImageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    where?: FileWhereInput
  }

  /**
   * Competition.files
   */
  export type Competition$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    where?: FileWhereInput
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    cursor?: FileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * Competition without action
   */
  export type CompetitionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
  }


  /**
   * Model ScoringCriteria
   */

  export type AggregateScoringCriteria = {
    _count: ScoringCriteriaCountAggregateOutputType | null
    _avg: ScoringCriteriaAvgAggregateOutputType | null
    _sum: ScoringCriteriaSumAggregateOutputType | null
    _min: ScoringCriteriaMinAggregateOutputType | null
    _max: ScoringCriteriaMaxAggregateOutputType | null
  }

  export type ScoringCriteriaAvgAggregateOutputType = {
    weight: number | null
    maxScore: number | null
  }

  export type ScoringCriteriaSumAggregateOutputType = {
    weight: number | null
    maxScore: number | null
  }

  export type ScoringCriteriaMinAggregateOutputType = {
    id: string | null
    name: string | null
    weight: number | null
    maxScore: number | null
    competitionId: string | null
  }

  export type ScoringCriteriaMaxAggregateOutputType = {
    id: string | null
    name: string | null
    weight: number | null
    maxScore: number | null
    competitionId: string | null
  }

  export type ScoringCriteriaCountAggregateOutputType = {
    id: number
    name: number
    weight: number
    maxScore: number
    competitionId: number
    _all: number
  }


  export type ScoringCriteriaAvgAggregateInputType = {
    weight?: true
    maxScore?: true
  }

  export type ScoringCriteriaSumAggregateInputType = {
    weight?: true
    maxScore?: true
  }

  export type ScoringCriteriaMinAggregateInputType = {
    id?: true
    name?: true
    weight?: true
    maxScore?: true
    competitionId?: true
  }

  export type ScoringCriteriaMaxAggregateInputType = {
    id?: true
    name?: true
    weight?: true
    maxScore?: true
    competitionId?: true
  }

  export type ScoringCriteriaCountAggregateInputType = {
    id?: true
    name?: true
    weight?: true
    maxScore?: true
    competitionId?: true
    _all?: true
  }

  export type ScoringCriteriaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScoringCriteria to aggregate.
     */
    where?: ScoringCriteriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoringCriteria to fetch.
     */
    orderBy?: ScoringCriteriaOrderByWithRelationInput | ScoringCriteriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScoringCriteriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoringCriteria from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoringCriteria.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScoringCriteria
    **/
    _count?: true | ScoringCriteriaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScoringCriteriaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScoringCriteriaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScoringCriteriaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScoringCriteriaMaxAggregateInputType
  }

  export type GetScoringCriteriaAggregateType<T extends ScoringCriteriaAggregateArgs> = {
        [P in keyof T & keyof AggregateScoringCriteria]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScoringCriteria[P]>
      : GetScalarType<T[P], AggregateScoringCriteria[P]>
  }




  export type ScoringCriteriaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScoringCriteriaWhereInput
    orderBy?: ScoringCriteriaOrderByWithAggregationInput | ScoringCriteriaOrderByWithAggregationInput[]
    by: ScoringCriteriaScalarFieldEnum[] | ScoringCriteriaScalarFieldEnum
    having?: ScoringCriteriaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScoringCriteriaCountAggregateInputType | true
    _avg?: ScoringCriteriaAvgAggregateInputType
    _sum?: ScoringCriteriaSumAggregateInputType
    _min?: ScoringCriteriaMinAggregateInputType
    _max?: ScoringCriteriaMaxAggregateInputType
  }

  export type ScoringCriteriaGroupByOutputType = {
    id: string
    name: string
    weight: number
    maxScore: number
    competitionId: string
    _count: ScoringCriteriaCountAggregateOutputType | null
    _avg: ScoringCriteriaAvgAggregateOutputType | null
    _sum: ScoringCriteriaSumAggregateOutputType | null
    _min: ScoringCriteriaMinAggregateOutputType | null
    _max: ScoringCriteriaMaxAggregateOutputType | null
  }

  type GetScoringCriteriaGroupByPayload<T extends ScoringCriteriaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScoringCriteriaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScoringCriteriaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScoringCriteriaGroupByOutputType[P]>
            : GetScalarType<T[P], ScoringCriteriaGroupByOutputType[P]>
        }
      >
    >


  export type ScoringCriteriaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    weight?: boolean
    maxScore?: boolean
    competitionId?: boolean
    competition?: boolean | CompetitionDefaultArgs<ExtArgs>
    scores?: boolean | ScoringCriteria$scoresArgs<ExtArgs>
    _count?: boolean | ScoringCriteriaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scoringCriteria"]>



  export type ScoringCriteriaSelectScalar = {
    id?: boolean
    name?: boolean
    weight?: boolean
    maxScore?: boolean
    competitionId?: boolean
  }

  export type ScoringCriteriaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "weight" | "maxScore" | "competitionId", ExtArgs["result"]["scoringCriteria"]>
  export type ScoringCriteriaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    competition?: boolean | CompetitionDefaultArgs<ExtArgs>
    scores?: boolean | ScoringCriteria$scoresArgs<ExtArgs>
    _count?: boolean | ScoringCriteriaCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ScoringCriteriaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScoringCriteria"
    objects: {
      competition: Prisma.$CompetitionPayload<ExtArgs>
      scores: Prisma.$ScorePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      weight: number
      maxScore: number
      competitionId: string
    }, ExtArgs["result"]["scoringCriteria"]>
    composites: {}
  }

  type ScoringCriteriaGetPayload<S extends boolean | null | undefined | ScoringCriteriaDefaultArgs> = $Result.GetResult<Prisma.$ScoringCriteriaPayload, S>

  type ScoringCriteriaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScoringCriteriaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScoringCriteriaCountAggregateInputType | true
    }

  export interface ScoringCriteriaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScoringCriteria'], meta: { name: 'ScoringCriteria' } }
    /**
     * Find zero or one ScoringCriteria that matches the filter.
     * @param {ScoringCriteriaFindUniqueArgs} args - Arguments to find a ScoringCriteria
     * @example
     * // Get one ScoringCriteria
     * const scoringCriteria = await prisma.scoringCriteria.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScoringCriteriaFindUniqueArgs>(args: SelectSubset<T, ScoringCriteriaFindUniqueArgs<ExtArgs>>): Prisma__ScoringCriteriaClient<$Result.GetResult<Prisma.$ScoringCriteriaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScoringCriteria that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScoringCriteriaFindUniqueOrThrowArgs} args - Arguments to find a ScoringCriteria
     * @example
     * // Get one ScoringCriteria
     * const scoringCriteria = await prisma.scoringCriteria.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScoringCriteriaFindUniqueOrThrowArgs>(args: SelectSubset<T, ScoringCriteriaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScoringCriteriaClient<$Result.GetResult<Prisma.$ScoringCriteriaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScoringCriteria that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoringCriteriaFindFirstArgs} args - Arguments to find a ScoringCriteria
     * @example
     * // Get one ScoringCriteria
     * const scoringCriteria = await prisma.scoringCriteria.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScoringCriteriaFindFirstArgs>(args?: SelectSubset<T, ScoringCriteriaFindFirstArgs<ExtArgs>>): Prisma__ScoringCriteriaClient<$Result.GetResult<Prisma.$ScoringCriteriaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScoringCriteria that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoringCriteriaFindFirstOrThrowArgs} args - Arguments to find a ScoringCriteria
     * @example
     * // Get one ScoringCriteria
     * const scoringCriteria = await prisma.scoringCriteria.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScoringCriteriaFindFirstOrThrowArgs>(args?: SelectSubset<T, ScoringCriteriaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScoringCriteriaClient<$Result.GetResult<Prisma.$ScoringCriteriaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScoringCriteria that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoringCriteriaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScoringCriteria
     * const scoringCriteria = await prisma.scoringCriteria.findMany()
     * 
     * // Get first 10 ScoringCriteria
     * const scoringCriteria = await prisma.scoringCriteria.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scoringCriteriaWithIdOnly = await prisma.scoringCriteria.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScoringCriteriaFindManyArgs>(args?: SelectSubset<T, ScoringCriteriaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScoringCriteriaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScoringCriteria.
     * @param {ScoringCriteriaCreateArgs} args - Arguments to create a ScoringCriteria.
     * @example
     * // Create one ScoringCriteria
     * const ScoringCriteria = await prisma.scoringCriteria.create({
     *   data: {
     *     // ... data to create a ScoringCriteria
     *   }
     * })
     * 
     */
    create<T extends ScoringCriteriaCreateArgs>(args: SelectSubset<T, ScoringCriteriaCreateArgs<ExtArgs>>): Prisma__ScoringCriteriaClient<$Result.GetResult<Prisma.$ScoringCriteriaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScoringCriteria.
     * @param {ScoringCriteriaCreateManyArgs} args - Arguments to create many ScoringCriteria.
     * @example
     * // Create many ScoringCriteria
     * const scoringCriteria = await prisma.scoringCriteria.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScoringCriteriaCreateManyArgs>(args?: SelectSubset<T, ScoringCriteriaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ScoringCriteria.
     * @param {ScoringCriteriaDeleteArgs} args - Arguments to delete one ScoringCriteria.
     * @example
     * // Delete one ScoringCriteria
     * const ScoringCriteria = await prisma.scoringCriteria.delete({
     *   where: {
     *     // ... filter to delete one ScoringCriteria
     *   }
     * })
     * 
     */
    delete<T extends ScoringCriteriaDeleteArgs>(args: SelectSubset<T, ScoringCriteriaDeleteArgs<ExtArgs>>): Prisma__ScoringCriteriaClient<$Result.GetResult<Prisma.$ScoringCriteriaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScoringCriteria.
     * @param {ScoringCriteriaUpdateArgs} args - Arguments to update one ScoringCriteria.
     * @example
     * // Update one ScoringCriteria
     * const scoringCriteria = await prisma.scoringCriteria.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScoringCriteriaUpdateArgs>(args: SelectSubset<T, ScoringCriteriaUpdateArgs<ExtArgs>>): Prisma__ScoringCriteriaClient<$Result.GetResult<Prisma.$ScoringCriteriaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScoringCriteria.
     * @param {ScoringCriteriaDeleteManyArgs} args - Arguments to filter ScoringCriteria to delete.
     * @example
     * // Delete a few ScoringCriteria
     * const { count } = await prisma.scoringCriteria.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScoringCriteriaDeleteManyArgs>(args?: SelectSubset<T, ScoringCriteriaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScoringCriteria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoringCriteriaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScoringCriteria
     * const scoringCriteria = await prisma.scoringCriteria.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScoringCriteriaUpdateManyArgs>(args: SelectSubset<T, ScoringCriteriaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ScoringCriteria.
     * @param {ScoringCriteriaUpsertArgs} args - Arguments to update or create a ScoringCriteria.
     * @example
     * // Update or create a ScoringCriteria
     * const scoringCriteria = await prisma.scoringCriteria.upsert({
     *   create: {
     *     // ... data to create a ScoringCriteria
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScoringCriteria we want to update
     *   }
     * })
     */
    upsert<T extends ScoringCriteriaUpsertArgs>(args: SelectSubset<T, ScoringCriteriaUpsertArgs<ExtArgs>>): Prisma__ScoringCriteriaClient<$Result.GetResult<Prisma.$ScoringCriteriaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScoringCriteria that matches the filter.
     * @param {ScoringCriteriaFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const scoringCriteria = await prisma.scoringCriteria.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ScoringCriteriaFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a ScoringCriteria.
     * @param {ScoringCriteriaAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const scoringCriteria = await prisma.scoringCriteria.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: ScoringCriteriaAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of ScoringCriteria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoringCriteriaCountArgs} args - Arguments to filter ScoringCriteria to count.
     * @example
     * // Count the number of ScoringCriteria
     * const count = await prisma.scoringCriteria.count({
     *   where: {
     *     // ... the filter for the ScoringCriteria we want to count
     *   }
     * })
    **/
    count<T extends ScoringCriteriaCountArgs>(
      args?: Subset<T, ScoringCriteriaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScoringCriteriaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScoringCriteria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoringCriteriaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScoringCriteriaAggregateArgs>(args: Subset<T, ScoringCriteriaAggregateArgs>): Prisma.PrismaPromise<GetScoringCriteriaAggregateType<T>>

    /**
     * Group by ScoringCriteria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoringCriteriaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScoringCriteriaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScoringCriteriaGroupByArgs['orderBy'] }
        : { orderBy?: ScoringCriteriaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScoringCriteriaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScoringCriteriaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScoringCriteria model
   */
  readonly fields: ScoringCriteriaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScoringCriteria.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScoringCriteriaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    competition<T extends CompetitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompetitionDefaultArgs<ExtArgs>>): Prisma__CompetitionClient<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    scores<T extends ScoringCriteria$scoresArgs<ExtArgs> = {}>(args?: Subset<T, ScoringCriteria$scoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ScoringCriteria model
   */
  interface ScoringCriteriaFieldRefs {
    readonly id: FieldRef<"ScoringCriteria", 'String'>
    readonly name: FieldRef<"ScoringCriteria", 'String'>
    readonly weight: FieldRef<"ScoringCriteria", 'Float'>
    readonly maxScore: FieldRef<"ScoringCriteria", 'Float'>
    readonly competitionId: FieldRef<"ScoringCriteria", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ScoringCriteria findUnique
   */
  export type ScoringCriteriaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteria
     */
    select?: ScoringCriteriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoringCriteria
     */
    omit?: ScoringCriteriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoringCriteriaInclude<ExtArgs> | null
    /**
     * Filter, which ScoringCriteria to fetch.
     */
    where: ScoringCriteriaWhereUniqueInput
  }

  /**
   * ScoringCriteria findUniqueOrThrow
   */
  export type ScoringCriteriaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteria
     */
    select?: ScoringCriteriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoringCriteria
     */
    omit?: ScoringCriteriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoringCriteriaInclude<ExtArgs> | null
    /**
     * Filter, which ScoringCriteria to fetch.
     */
    where: ScoringCriteriaWhereUniqueInput
  }

  /**
   * ScoringCriteria findFirst
   */
  export type ScoringCriteriaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteria
     */
    select?: ScoringCriteriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoringCriteria
     */
    omit?: ScoringCriteriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoringCriteriaInclude<ExtArgs> | null
    /**
     * Filter, which ScoringCriteria to fetch.
     */
    where?: ScoringCriteriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoringCriteria to fetch.
     */
    orderBy?: ScoringCriteriaOrderByWithRelationInput | ScoringCriteriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScoringCriteria.
     */
    cursor?: ScoringCriteriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoringCriteria from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoringCriteria.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScoringCriteria.
     */
    distinct?: ScoringCriteriaScalarFieldEnum | ScoringCriteriaScalarFieldEnum[]
  }

  /**
   * ScoringCriteria findFirstOrThrow
   */
  export type ScoringCriteriaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteria
     */
    select?: ScoringCriteriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoringCriteria
     */
    omit?: ScoringCriteriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoringCriteriaInclude<ExtArgs> | null
    /**
     * Filter, which ScoringCriteria to fetch.
     */
    where?: ScoringCriteriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoringCriteria to fetch.
     */
    orderBy?: ScoringCriteriaOrderByWithRelationInput | ScoringCriteriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScoringCriteria.
     */
    cursor?: ScoringCriteriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoringCriteria from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoringCriteria.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScoringCriteria.
     */
    distinct?: ScoringCriteriaScalarFieldEnum | ScoringCriteriaScalarFieldEnum[]
  }

  /**
   * ScoringCriteria findMany
   */
  export type ScoringCriteriaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteria
     */
    select?: ScoringCriteriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoringCriteria
     */
    omit?: ScoringCriteriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoringCriteriaInclude<ExtArgs> | null
    /**
     * Filter, which ScoringCriteria to fetch.
     */
    where?: ScoringCriteriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoringCriteria to fetch.
     */
    orderBy?: ScoringCriteriaOrderByWithRelationInput | ScoringCriteriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScoringCriteria.
     */
    cursor?: ScoringCriteriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoringCriteria from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoringCriteria.
     */
    skip?: number
    distinct?: ScoringCriteriaScalarFieldEnum | ScoringCriteriaScalarFieldEnum[]
  }

  /**
   * ScoringCriteria create
   */
  export type ScoringCriteriaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteria
     */
    select?: ScoringCriteriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoringCriteria
     */
    omit?: ScoringCriteriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoringCriteriaInclude<ExtArgs> | null
    /**
     * The data needed to create a ScoringCriteria.
     */
    data: XOR<ScoringCriteriaCreateInput, ScoringCriteriaUncheckedCreateInput>
  }

  /**
   * ScoringCriteria createMany
   */
  export type ScoringCriteriaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScoringCriteria.
     */
    data: ScoringCriteriaCreateManyInput | ScoringCriteriaCreateManyInput[]
  }

  /**
   * ScoringCriteria update
   */
  export type ScoringCriteriaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteria
     */
    select?: ScoringCriteriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoringCriteria
     */
    omit?: ScoringCriteriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoringCriteriaInclude<ExtArgs> | null
    /**
     * The data needed to update a ScoringCriteria.
     */
    data: XOR<ScoringCriteriaUpdateInput, ScoringCriteriaUncheckedUpdateInput>
    /**
     * Choose, which ScoringCriteria to update.
     */
    where: ScoringCriteriaWhereUniqueInput
  }

  /**
   * ScoringCriteria updateMany
   */
  export type ScoringCriteriaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScoringCriteria.
     */
    data: XOR<ScoringCriteriaUpdateManyMutationInput, ScoringCriteriaUncheckedUpdateManyInput>
    /**
     * Filter which ScoringCriteria to update
     */
    where?: ScoringCriteriaWhereInput
    /**
     * Limit how many ScoringCriteria to update.
     */
    limit?: number
  }

  /**
   * ScoringCriteria upsert
   */
  export type ScoringCriteriaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteria
     */
    select?: ScoringCriteriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoringCriteria
     */
    omit?: ScoringCriteriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoringCriteriaInclude<ExtArgs> | null
    /**
     * The filter to search for the ScoringCriteria to update in case it exists.
     */
    where: ScoringCriteriaWhereUniqueInput
    /**
     * In case the ScoringCriteria found by the `where` argument doesn't exist, create a new ScoringCriteria with this data.
     */
    create: XOR<ScoringCriteriaCreateInput, ScoringCriteriaUncheckedCreateInput>
    /**
     * In case the ScoringCriteria was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScoringCriteriaUpdateInput, ScoringCriteriaUncheckedUpdateInput>
  }

  /**
   * ScoringCriteria delete
   */
  export type ScoringCriteriaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteria
     */
    select?: ScoringCriteriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoringCriteria
     */
    omit?: ScoringCriteriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoringCriteriaInclude<ExtArgs> | null
    /**
     * Filter which ScoringCriteria to delete.
     */
    where: ScoringCriteriaWhereUniqueInput
  }

  /**
   * ScoringCriteria deleteMany
   */
  export type ScoringCriteriaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScoringCriteria to delete
     */
    where?: ScoringCriteriaWhereInput
    /**
     * Limit how many ScoringCriteria to delete.
     */
    limit?: number
  }

  /**
   * ScoringCriteria findRaw
   */
  export type ScoringCriteriaFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ScoringCriteria aggregateRaw
   */
  export type ScoringCriteriaAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ScoringCriteria.scores
   */
  export type ScoringCriteria$scoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
    where?: ScoreWhereInput
    orderBy?: ScoreOrderByWithRelationInput | ScoreOrderByWithRelationInput[]
    cursor?: ScoreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScoreScalarFieldEnum | ScoreScalarFieldEnum[]
  }

  /**
   * ScoringCriteria without action
   */
  export type ScoringCriteriaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoringCriteria
     */
    select?: ScoringCriteriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoringCriteria
     */
    omit?: ScoringCriteriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoringCriteriaInclude<ExtArgs> | null
  }


  /**
   * Model Participant
   */

  export type AggregateParticipant = {
    _count: ParticipantCountAggregateOutputType | null
    _min: ParticipantMinAggregateOutputType | null
    _max: ParticipantMaxAggregateOutputType | null
  }

  export type ParticipantMinAggregateOutputType = {
    id: string | null
    name: string | null
    bio: string | null
    team: string | null
    contact: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ParticipantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    bio: string | null
    team: string | null
    contact: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ParticipantCountAggregateOutputType = {
    id: number
    name: number
    bio: number
    team: number
    contact: number
    createdAt: number
    updatedAt: number
    programIds: number
    _all: number
  }


  export type ParticipantMinAggregateInputType = {
    id?: true
    name?: true
    bio?: true
    team?: true
    contact?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ParticipantMaxAggregateInputType = {
    id?: true
    name?: true
    bio?: true
    team?: true
    contact?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ParticipantCountAggregateInputType = {
    id?: true
    name?: true
    bio?: true
    team?: true
    contact?: true
    createdAt?: true
    updatedAt?: true
    programIds?: true
    _all?: true
  }

  export type ParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Participant to aggregate.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Participants
    **/
    _count?: true | ParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ParticipantMaxAggregateInputType
  }

  export type GetParticipantAggregateType<T extends ParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateParticipant[P]>
      : GetScalarType<T[P], AggregateParticipant[P]>
  }




  export type ParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantWhereInput
    orderBy?: ParticipantOrderByWithAggregationInput | ParticipantOrderByWithAggregationInput[]
    by: ParticipantScalarFieldEnum[] | ParticipantScalarFieldEnum
    having?: ParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ParticipantCountAggregateInputType | true
    _min?: ParticipantMinAggregateInputType
    _max?: ParticipantMaxAggregateInputType
  }

  export type ParticipantGroupByOutputType = {
    id: string
    name: string
    bio: string | null
    team: string | null
    contact: string | null
    createdAt: Date
    updatedAt: Date
    programIds: string[]
    _count: ParticipantCountAggregateOutputType | null
    _min: ParticipantMinAggregateOutputType | null
    _max: ParticipantMaxAggregateOutputType | null
  }

  type GetParticipantGroupByPayload<T extends ParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], ParticipantGroupByOutputType[P]>
        }
      >
    >


  export type ParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    bio?: boolean
    team?: boolean
    contact?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    programIds?: boolean
    programs?: boolean | Participant$programsArgs<ExtArgs>
    _count?: boolean | ParticipantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participant"]>



  export type ParticipantSelectScalar = {
    id?: boolean
    name?: boolean
    bio?: boolean
    team?: boolean
    contact?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    programIds?: boolean
  }

  export type ParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "bio" | "team" | "contact" | "createdAt" | "updatedAt" | "programIds", ExtArgs["result"]["participant"]>
  export type ParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programs?: boolean | Participant$programsArgs<ExtArgs>
    _count?: boolean | ParticipantCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Participant"
    objects: {
      programs: Prisma.$ProgramPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      bio: string | null
      team: string | null
      contact: string | null
      createdAt: Date
      updatedAt: Date
      programIds: string[]
    }, ExtArgs["result"]["participant"]>
    composites: {}
  }

  type ParticipantGetPayload<S extends boolean | null | undefined | ParticipantDefaultArgs> = $Result.GetResult<Prisma.$ParticipantPayload, S>

  type ParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ParticipantCountAggregateInputType | true
    }

  export interface ParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Participant'], meta: { name: 'Participant' } }
    /**
     * Find zero or one Participant that matches the filter.
     * @param {ParticipantFindUniqueArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ParticipantFindUniqueArgs>(args: SelectSubset<T, ParticipantFindUniqueArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Participant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ParticipantFindUniqueOrThrowArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, ParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Participant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindFirstArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ParticipantFindFirstArgs>(args?: SelectSubset<T, ParticipantFindFirstArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Participant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindFirstOrThrowArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, ParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Participants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Participants
     * const participants = await prisma.participant.findMany()
     * 
     * // Get first 10 Participants
     * const participants = await prisma.participant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const participantWithIdOnly = await prisma.participant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ParticipantFindManyArgs>(args?: SelectSubset<T, ParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Participant.
     * @param {ParticipantCreateArgs} args - Arguments to create a Participant.
     * @example
     * // Create one Participant
     * const Participant = await prisma.participant.create({
     *   data: {
     *     // ... data to create a Participant
     *   }
     * })
     * 
     */
    create<T extends ParticipantCreateArgs>(args: SelectSubset<T, ParticipantCreateArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Participants.
     * @param {ParticipantCreateManyArgs} args - Arguments to create many Participants.
     * @example
     * // Create many Participants
     * const participant = await prisma.participant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ParticipantCreateManyArgs>(args?: SelectSubset<T, ParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Participant.
     * @param {ParticipantDeleteArgs} args - Arguments to delete one Participant.
     * @example
     * // Delete one Participant
     * const Participant = await prisma.participant.delete({
     *   where: {
     *     // ... filter to delete one Participant
     *   }
     * })
     * 
     */
    delete<T extends ParticipantDeleteArgs>(args: SelectSubset<T, ParticipantDeleteArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Participant.
     * @param {ParticipantUpdateArgs} args - Arguments to update one Participant.
     * @example
     * // Update one Participant
     * const participant = await prisma.participant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ParticipantUpdateArgs>(args: SelectSubset<T, ParticipantUpdateArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Participants.
     * @param {ParticipantDeleteManyArgs} args - Arguments to filter Participants to delete.
     * @example
     * // Delete a few Participants
     * const { count } = await prisma.participant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ParticipantDeleteManyArgs>(args?: SelectSubset<T, ParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Participants
     * const participant = await prisma.participant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ParticipantUpdateManyArgs>(args: SelectSubset<T, ParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Participant.
     * @param {ParticipantUpsertArgs} args - Arguments to update or create a Participant.
     * @example
     * // Update or create a Participant
     * const participant = await prisma.participant.upsert({
     *   create: {
     *     // ... data to create a Participant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Participant we want to update
     *   }
     * })
     */
    upsert<T extends ParticipantUpsertArgs>(args: SelectSubset<T, ParticipantUpsertArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Participants that matches the filter.
     * @param {ParticipantFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const participant = await prisma.participant.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ParticipantFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Participant.
     * @param {ParticipantAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const participant = await prisma.participant.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: ParticipantAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantCountArgs} args - Arguments to filter Participants to count.
     * @example
     * // Count the number of Participants
     * const count = await prisma.participant.count({
     *   where: {
     *     // ... the filter for the Participants we want to count
     *   }
     * })
    **/
    count<T extends ParticipantCountArgs>(
      args?: Subset<T, ParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Participant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ParticipantAggregateArgs>(args: Subset<T, ParticipantAggregateArgs>): Prisma.PrismaPromise<GetParticipantAggregateType<T>>

    /**
     * Group by Participant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ParticipantGroupByArgs['orderBy'] }
        : { orderBy?: ParticipantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Participant model
   */
  readonly fields: ParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Participant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    programs<T extends Participant$programsArgs<ExtArgs> = {}>(args?: Subset<T, Participant$programsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Participant model
   */
  interface ParticipantFieldRefs {
    readonly id: FieldRef<"Participant", 'String'>
    readonly name: FieldRef<"Participant", 'String'>
    readonly bio: FieldRef<"Participant", 'String'>
    readonly team: FieldRef<"Participant", 'String'>
    readonly contact: FieldRef<"Participant", 'String'>
    readonly createdAt: FieldRef<"Participant", 'DateTime'>
    readonly updatedAt: FieldRef<"Participant", 'DateTime'>
    readonly programIds: FieldRef<"Participant", 'String[]'>
  }
    

  // Custom InputTypes
  /**
   * Participant findUnique
   */
  export type ParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant findUniqueOrThrow
   */
  export type ParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant findFirst
   */
  export type ParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participants.
     */
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant findFirstOrThrow
   */
  export type ParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participants.
     */
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant findMany
   */
  export type ParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participants to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant create
   */
  export type ParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a Participant.
     */
    data: XOR<ParticipantCreateInput, ParticipantUncheckedCreateInput>
  }

  /**
   * Participant createMany
   */
  export type ParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Participants.
     */
    data: ParticipantCreateManyInput | ParticipantCreateManyInput[]
  }

  /**
   * Participant update
   */
  export type ParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a Participant.
     */
    data: XOR<ParticipantUpdateInput, ParticipantUncheckedUpdateInput>
    /**
     * Choose, which Participant to update.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant updateMany
   */
  export type ParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Participants.
     */
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyInput>
    /**
     * Filter which Participants to update
     */
    where?: ParticipantWhereInput
    /**
     * Limit how many Participants to update.
     */
    limit?: number
  }

  /**
   * Participant upsert
   */
  export type ParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the Participant to update in case it exists.
     */
    where: ParticipantWhereUniqueInput
    /**
     * In case the Participant found by the `where` argument doesn't exist, create a new Participant with this data.
     */
    create: XOR<ParticipantCreateInput, ParticipantUncheckedCreateInput>
    /**
     * In case the Participant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ParticipantUpdateInput, ParticipantUncheckedUpdateInput>
  }

  /**
   * Participant delete
   */
  export type ParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter which Participant to delete.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant deleteMany
   */
  export type ParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Participants to delete
     */
    where?: ParticipantWhereInput
    /**
     * Limit how many Participants to delete.
     */
    limit?: number
  }

  /**
   * Participant findRaw
   */
  export type ParticipantFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Participant aggregateRaw
   */
  export type ParticipantAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Participant.programs
   */
  export type Participant$programsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    where?: ProgramWhereInput
    orderBy?: ProgramOrderByWithRelationInput | ProgramOrderByWithRelationInput[]
    cursor?: ProgramWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[]
  }

  /**
   * Participant without action
   */
  export type ParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
  }


  /**
   * Model Program
   */

  export type AggregateProgram = {
    _count: ProgramCountAggregateOutputType | null
    _avg: ProgramAvgAggregateOutputType | null
    _sum: ProgramSumAggregateOutputType | null
    _min: ProgramMinAggregateOutputType | null
    _max: ProgramMaxAggregateOutputType | null
  }

  export type ProgramAvgAggregateOutputType = {
    order: number | null
  }

  export type ProgramSumAggregateOutputType = {
    order: number | null
  }

  export type ProgramMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    order: number | null
    currentStatus: $Enums.ProgramStatus | null
    competitionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgramMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    order: number | null
    currentStatus: $Enums.ProgramStatus | null
    competitionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgramCountAggregateOutputType = {
    id: number
    name: number
    description: number
    order: number
    currentStatus: number
    competitionId: number
    createdAt: number
    updatedAt: number
    participantIds: number
    fileIds: number
    _all: number
  }


  export type ProgramAvgAggregateInputType = {
    order?: true
  }

  export type ProgramSumAggregateInputType = {
    order?: true
  }

  export type ProgramMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    order?: true
    currentStatus?: true
    competitionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgramMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    order?: true
    currentStatus?: true
    competitionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgramCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    order?: true
    currentStatus?: true
    competitionId?: true
    createdAt?: true
    updatedAt?: true
    participantIds?: true
    fileIds?: true
    _all?: true
  }

  export type ProgramAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Program to aggregate.
     */
    where?: ProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramOrderByWithRelationInput | ProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Programs
    **/
    _count?: true | ProgramCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProgramAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProgramSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgramMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgramMaxAggregateInputType
  }

  export type GetProgramAggregateType<T extends ProgramAggregateArgs> = {
        [P in keyof T & keyof AggregateProgram]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgram[P]>
      : GetScalarType<T[P], AggregateProgram[P]>
  }




  export type ProgramGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramWhereInput
    orderBy?: ProgramOrderByWithAggregationInput | ProgramOrderByWithAggregationInput[]
    by: ProgramScalarFieldEnum[] | ProgramScalarFieldEnum
    having?: ProgramScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgramCountAggregateInputType | true
    _avg?: ProgramAvgAggregateInputType
    _sum?: ProgramSumAggregateInputType
    _min?: ProgramMinAggregateInputType
    _max?: ProgramMaxAggregateInputType
  }

  export type ProgramGroupByOutputType = {
    id: string
    name: string
    description: string | null
    order: number
    currentStatus: $Enums.ProgramStatus
    competitionId: string
    createdAt: Date
    updatedAt: Date
    participantIds: string[]
    fileIds: string[]
    _count: ProgramCountAggregateOutputType | null
    _avg: ProgramAvgAggregateOutputType | null
    _sum: ProgramSumAggregateOutputType | null
    _min: ProgramMinAggregateOutputType | null
    _max: ProgramMaxAggregateOutputType | null
  }

  type GetProgramGroupByPayload<T extends ProgramGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgramGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgramGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgramGroupByOutputType[P]>
            : GetScalarType<T[P], ProgramGroupByOutputType[P]>
        }
      >
    >


  export type ProgramSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    order?: boolean
    currentStatus?: boolean
    competitionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    participantIds?: boolean
    fileIds?: boolean
    competition?: boolean | CompetitionDefaultArgs<ExtArgs>
    participants?: boolean | Program$participantsArgs<ExtArgs>
    attachments?: boolean | Program$attachmentsArgs<ExtArgs>
    scores?: boolean | Program$scoresArgs<ExtArgs>
    ranking?: boolean | Program$rankingArgs<ExtArgs>
    _count?: boolean | ProgramCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["program"]>



  export type ProgramSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    order?: boolean
    currentStatus?: boolean
    competitionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    participantIds?: boolean
    fileIds?: boolean
  }

  export type ProgramOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "order" | "currentStatus" | "competitionId" | "createdAt" | "updatedAt" | "participantIds" | "fileIds", ExtArgs["result"]["program"]>
  export type ProgramInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    competition?: boolean | CompetitionDefaultArgs<ExtArgs>
    participants?: boolean | Program$participantsArgs<ExtArgs>
    attachments?: boolean | Program$attachmentsArgs<ExtArgs>
    scores?: boolean | Program$scoresArgs<ExtArgs>
    ranking?: boolean | Program$rankingArgs<ExtArgs>
    _count?: boolean | ProgramCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProgramPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Program"
    objects: {
      competition: Prisma.$CompetitionPayload<ExtArgs>
      participants: Prisma.$ParticipantPayload<ExtArgs>[]
      attachments: Prisma.$FilePayload<ExtArgs>[]
      scores: Prisma.$ScorePayload<ExtArgs>[]
      ranking: Prisma.$RankingPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      order: number
      currentStatus: $Enums.ProgramStatus
      competitionId: string
      createdAt: Date
      updatedAt: Date
      participantIds: string[]
      fileIds: string[]
    }, ExtArgs["result"]["program"]>
    composites: {}
  }

  type ProgramGetPayload<S extends boolean | null | undefined | ProgramDefaultArgs> = $Result.GetResult<Prisma.$ProgramPayload, S>

  type ProgramCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProgramFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProgramCountAggregateInputType | true
    }

  export interface ProgramDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Program'], meta: { name: 'Program' } }
    /**
     * Find zero or one Program that matches the filter.
     * @param {ProgramFindUniqueArgs} args - Arguments to find a Program
     * @example
     * // Get one Program
     * const program = await prisma.program.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgramFindUniqueArgs>(args: SelectSubset<T, ProgramFindUniqueArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Program that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProgramFindUniqueOrThrowArgs} args - Arguments to find a Program
     * @example
     * // Get one Program
     * const program = await prisma.program.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgramFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgramFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Program that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramFindFirstArgs} args - Arguments to find a Program
     * @example
     * // Get one Program
     * const program = await prisma.program.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgramFindFirstArgs>(args?: SelectSubset<T, ProgramFindFirstArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Program that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramFindFirstOrThrowArgs} args - Arguments to find a Program
     * @example
     * // Get one Program
     * const program = await prisma.program.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgramFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgramFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Programs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Programs
     * const programs = await prisma.program.findMany()
     * 
     * // Get first 10 Programs
     * const programs = await prisma.program.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const programWithIdOnly = await prisma.program.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgramFindManyArgs>(args?: SelectSubset<T, ProgramFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Program.
     * @param {ProgramCreateArgs} args - Arguments to create a Program.
     * @example
     * // Create one Program
     * const Program = await prisma.program.create({
     *   data: {
     *     // ... data to create a Program
     *   }
     * })
     * 
     */
    create<T extends ProgramCreateArgs>(args: SelectSubset<T, ProgramCreateArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Programs.
     * @param {ProgramCreateManyArgs} args - Arguments to create many Programs.
     * @example
     * // Create many Programs
     * const program = await prisma.program.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgramCreateManyArgs>(args?: SelectSubset<T, ProgramCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Program.
     * @param {ProgramDeleteArgs} args - Arguments to delete one Program.
     * @example
     * // Delete one Program
     * const Program = await prisma.program.delete({
     *   where: {
     *     // ... filter to delete one Program
     *   }
     * })
     * 
     */
    delete<T extends ProgramDeleteArgs>(args: SelectSubset<T, ProgramDeleteArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Program.
     * @param {ProgramUpdateArgs} args - Arguments to update one Program.
     * @example
     * // Update one Program
     * const program = await prisma.program.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgramUpdateArgs>(args: SelectSubset<T, ProgramUpdateArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Programs.
     * @param {ProgramDeleteManyArgs} args - Arguments to filter Programs to delete.
     * @example
     * // Delete a few Programs
     * const { count } = await prisma.program.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgramDeleteManyArgs>(args?: SelectSubset<T, ProgramDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Programs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Programs
     * const program = await prisma.program.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgramUpdateManyArgs>(args: SelectSubset<T, ProgramUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Program.
     * @param {ProgramUpsertArgs} args - Arguments to update or create a Program.
     * @example
     * // Update or create a Program
     * const program = await prisma.program.upsert({
     *   create: {
     *     // ... data to create a Program
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Program we want to update
     *   }
     * })
     */
    upsert<T extends ProgramUpsertArgs>(args: SelectSubset<T, ProgramUpsertArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Programs that matches the filter.
     * @param {ProgramFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const program = await prisma.program.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ProgramFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Program.
     * @param {ProgramAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const program = await prisma.program.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: ProgramAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Programs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramCountArgs} args - Arguments to filter Programs to count.
     * @example
     * // Count the number of Programs
     * const count = await prisma.program.count({
     *   where: {
     *     // ... the filter for the Programs we want to count
     *   }
     * })
    **/
    count<T extends ProgramCountArgs>(
      args?: Subset<T, ProgramCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgramCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Program.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProgramAggregateArgs>(args: Subset<T, ProgramAggregateArgs>): Prisma.PrismaPromise<GetProgramAggregateType<T>>

    /**
     * Group by Program.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProgramGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgramGroupByArgs['orderBy'] }
        : { orderBy?: ProgramGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProgramGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgramGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Program model
   */
  readonly fields: ProgramFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Program.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgramClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    competition<T extends CompetitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompetitionDefaultArgs<ExtArgs>>): Prisma__CompetitionClient<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    participants<T extends Program$participantsArgs<ExtArgs> = {}>(args?: Subset<T, Program$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    attachments<T extends Program$attachmentsArgs<ExtArgs> = {}>(args?: Subset<T, Program$attachmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    scores<T extends Program$scoresArgs<ExtArgs> = {}>(args?: Subset<T, Program$scoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ranking<T extends Program$rankingArgs<ExtArgs> = {}>(args?: Subset<T, Program$rankingArgs<ExtArgs>>): Prisma__RankingClient<$Result.GetResult<Prisma.$RankingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Program model
   */
  interface ProgramFieldRefs {
    readonly id: FieldRef<"Program", 'String'>
    readonly name: FieldRef<"Program", 'String'>
    readonly description: FieldRef<"Program", 'String'>
    readonly order: FieldRef<"Program", 'Int'>
    readonly currentStatus: FieldRef<"Program", 'ProgramStatus'>
    readonly competitionId: FieldRef<"Program", 'String'>
    readonly createdAt: FieldRef<"Program", 'DateTime'>
    readonly updatedAt: FieldRef<"Program", 'DateTime'>
    readonly participantIds: FieldRef<"Program", 'String[]'>
    readonly fileIds: FieldRef<"Program", 'String[]'>
  }
    

  // Custom InputTypes
  /**
   * Program findUnique
   */
  export type ProgramFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter, which Program to fetch.
     */
    where: ProgramWhereUniqueInput
  }

  /**
   * Program findUniqueOrThrow
   */
  export type ProgramFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter, which Program to fetch.
     */
    where: ProgramWhereUniqueInput
  }

  /**
   * Program findFirst
   */
  export type ProgramFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter, which Program to fetch.
     */
    where?: ProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramOrderByWithRelationInput | ProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Programs.
     */
    cursor?: ProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Programs.
     */
    distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[]
  }

  /**
   * Program findFirstOrThrow
   */
  export type ProgramFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter, which Program to fetch.
     */
    where?: ProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramOrderByWithRelationInput | ProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Programs.
     */
    cursor?: ProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Programs.
     */
    distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[]
  }

  /**
   * Program findMany
   */
  export type ProgramFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter, which Programs to fetch.
     */
    where?: ProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramOrderByWithRelationInput | ProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Programs.
     */
    cursor?: ProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[]
  }

  /**
   * Program create
   */
  export type ProgramCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * The data needed to create a Program.
     */
    data: XOR<ProgramCreateInput, ProgramUncheckedCreateInput>
  }

  /**
   * Program createMany
   */
  export type ProgramCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Programs.
     */
    data: ProgramCreateManyInput | ProgramCreateManyInput[]
  }

  /**
   * Program update
   */
  export type ProgramUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * The data needed to update a Program.
     */
    data: XOR<ProgramUpdateInput, ProgramUncheckedUpdateInput>
    /**
     * Choose, which Program to update.
     */
    where: ProgramWhereUniqueInput
  }

  /**
   * Program updateMany
   */
  export type ProgramUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Programs.
     */
    data: XOR<ProgramUpdateManyMutationInput, ProgramUncheckedUpdateManyInput>
    /**
     * Filter which Programs to update
     */
    where?: ProgramWhereInput
    /**
     * Limit how many Programs to update.
     */
    limit?: number
  }

  /**
   * Program upsert
   */
  export type ProgramUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * The filter to search for the Program to update in case it exists.
     */
    where: ProgramWhereUniqueInput
    /**
     * In case the Program found by the `where` argument doesn't exist, create a new Program with this data.
     */
    create: XOR<ProgramCreateInput, ProgramUncheckedCreateInput>
    /**
     * In case the Program was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgramUpdateInput, ProgramUncheckedUpdateInput>
  }

  /**
   * Program delete
   */
  export type ProgramDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter which Program to delete.
     */
    where: ProgramWhereUniqueInput
  }

  /**
   * Program deleteMany
   */
  export type ProgramDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Programs to delete
     */
    where?: ProgramWhereInput
    /**
     * Limit how many Programs to delete.
     */
    limit?: number
  }

  /**
   * Program findRaw
   */
  export type ProgramFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Program aggregateRaw
   */
  export type ProgramAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Program.participants
   */
  export type Program$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    where?: ParticipantWhereInput
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    cursor?: ParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Program.attachments
   */
  export type Program$attachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    where?: FileWhereInput
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    cursor?: FileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * Program.scores
   */
  export type Program$scoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
    where?: ScoreWhereInput
    orderBy?: ScoreOrderByWithRelationInput | ScoreOrderByWithRelationInput[]
    cursor?: ScoreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScoreScalarFieldEnum | ScoreScalarFieldEnum[]
  }

  /**
   * Program.ranking
   */
  export type Program$rankingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
    where?: RankingWhereInput
  }

  /**
   * Program without action
   */
  export type ProgramDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
  }


  /**
   * Model Score
   */

  export type AggregateScore = {
    _count: ScoreCountAggregateOutputType | null
    _avg: ScoreAvgAggregateOutputType | null
    _sum: ScoreSumAggregateOutputType | null
    _min: ScoreMinAggregateOutputType | null
    _max: ScoreMaxAggregateOutputType | null
  }

  export type ScoreAvgAggregateOutputType = {
    value: number | null
  }

  export type ScoreSumAggregateOutputType = {
    value: number | null
  }

  export type ScoreMinAggregateOutputType = {
    id: string | null
    value: number | null
    comment: string | null
    programId: string | null
    scoringCriteriaId: string | null
    judgeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScoreMaxAggregateOutputType = {
    id: string | null
    value: number | null
    comment: string | null
    programId: string | null
    scoringCriteriaId: string | null
    judgeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScoreCountAggregateOutputType = {
    id: number
    value: number
    comment: number
    programId: number
    scoringCriteriaId: number
    judgeId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ScoreAvgAggregateInputType = {
    value?: true
  }

  export type ScoreSumAggregateInputType = {
    value?: true
  }

  export type ScoreMinAggregateInputType = {
    id?: true
    value?: true
    comment?: true
    programId?: true
    scoringCriteriaId?: true
    judgeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScoreMaxAggregateInputType = {
    id?: true
    value?: true
    comment?: true
    programId?: true
    scoringCriteriaId?: true
    judgeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScoreCountAggregateInputType = {
    id?: true
    value?: true
    comment?: true
    programId?: true
    scoringCriteriaId?: true
    judgeId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ScoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Score to aggregate.
     */
    where?: ScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scores to fetch.
     */
    orderBy?: ScoreOrderByWithRelationInput | ScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Scores
    **/
    _count?: true | ScoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScoreAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScoreSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScoreMaxAggregateInputType
  }

  export type GetScoreAggregateType<T extends ScoreAggregateArgs> = {
        [P in keyof T & keyof AggregateScore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScore[P]>
      : GetScalarType<T[P], AggregateScore[P]>
  }




  export type ScoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScoreWhereInput
    orderBy?: ScoreOrderByWithAggregationInput | ScoreOrderByWithAggregationInput[]
    by: ScoreScalarFieldEnum[] | ScoreScalarFieldEnum
    having?: ScoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScoreCountAggregateInputType | true
    _avg?: ScoreAvgAggregateInputType
    _sum?: ScoreSumAggregateInputType
    _min?: ScoreMinAggregateInputType
    _max?: ScoreMaxAggregateInputType
  }

  export type ScoreGroupByOutputType = {
    id: string
    value: number
    comment: string | null
    programId: string
    scoringCriteriaId: string
    judgeId: string
    createdAt: Date
    updatedAt: Date
    _count: ScoreCountAggregateOutputType | null
    _avg: ScoreAvgAggregateOutputType | null
    _sum: ScoreSumAggregateOutputType | null
    _min: ScoreMinAggregateOutputType | null
    _max: ScoreMaxAggregateOutputType | null
  }

  type GetScoreGroupByPayload<T extends ScoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScoreGroupByOutputType[P]>
            : GetScalarType<T[P], ScoreGroupByOutputType[P]>
        }
      >
    >


  export type ScoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    value?: boolean
    comment?: boolean
    programId?: boolean
    scoringCriteriaId?: boolean
    judgeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    program?: boolean | ProgramDefaultArgs<ExtArgs>
    scoringCriteria?: boolean | ScoringCriteriaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["score"]>



  export type ScoreSelectScalar = {
    id?: boolean
    value?: boolean
    comment?: boolean
    programId?: boolean
    scoringCriteriaId?: boolean
    judgeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ScoreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "value" | "comment" | "programId" | "scoringCriteriaId" | "judgeId" | "createdAt" | "updatedAt", ExtArgs["result"]["score"]>
  export type ScoreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramDefaultArgs<ExtArgs>
    scoringCriteria?: boolean | ScoringCriteriaDefaultArgs<ExtArgs>
  }

  export type $ScorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Score"
    objects: {
      program: Prisma.$ProgramPayload<ExtArgs>
      scoringCriteria: Prisma.$ScoringCriteriaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      value: number
      comment: string | null
      programId: string
      scoringCriteriaId: string
      judgeId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["score"]>
    composites: {}
  }

  type ScoreGetPayload<S extends boolean | null | undefined | ScoreDefaultArgs> = $Result.GetResult<Prisma.$ScorePayload, S>

  type ScoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScoreCountAggregateInputType | true
    }

  export interface ScoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Score'], meta: { name: 'Score' } }
    /**
     * Find zero or one Score that matches the filter.
     * @param {ScoreFindUniqueArgs} args - Arguments to find a Score
     * @example
     * // Get one Score
     * const score = await prisma.score.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScoreFindUniqueArgs>(args: SelectSubset<T, ScoreFindUniqueArgs<ExtArgs>>): Prisma__ScoreClient<$Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Score that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScoreFindUniqueOrThrowArgs} args - Arguments to find a Score
     * @example
     * // Get one Score
     * const score = await prisma.score.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScoreFindUniqueOrThrowArgs>(args: SelectSubset<T, ScoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScoreClient<$Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Score that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreFindFirstArgs} args - Arguments to find a Score
     * @example
     * // Get one Score
     * const score = await prisma.score.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScoreFindFirstArgs>(args?: SelectSubset<T, ScoreFindFirstArgs<ExtArgs>>): Prisma__ScoreClient<$Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Score that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreFindFirstOrThrowArgs} args - Arguments to find a Score
     * @example
     * // Get one Score
     * const score = await prisma.score.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScoreFindFirstOrThrowArgs>(args?: SelectSubset<T, ScoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScoreClient<$Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Scores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Scores
     * const scores = await prisma.score.findMany()
     * 
     * // Get first 10 Scores
     * const scores = await prisma.score.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scoreWithIdOnly = await prisma.score.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScoreFindManyArgs>(args?: SelectSubset<T, ScoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Score.
     * @param {ScoreCreateArgs} args - Arguments to create a Score.
     * @example
     * // Create one Score
     * const Score = await prisma.score.create({
     *   data: {
     *     // ... data to create a Score
     *   }
     * })
     * 
     */
    create<T extends ScoreCreateArgs>(args: SelectSubset<T, ScoreCreateArgs<ExtArgs>>): Prisma__ScoreClient<$Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Scores.
     * @param {ScoreCreateManyArgs} args - Arguments to create many Scores.
     * @example
     * // Create many Scores
     * const score = await prisma.score.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScoreCreateManyArgs>(args?: SelectSubset<T, ScoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Score.
     * @param {ScoreDeleteArgs} args - Arguments to delete one Score.
     * @example
     * // Delete one Score
     * const Score = await prisma.score.delete({
     *   where: {
     *     // ... filter to delete one Score
     *   }
     * })
     * 
     */
    delete<T extends ScoreDeleteArgs>(args: SelectSubset<T, ScoreDeleteArgs<ExtArgs>>): Prisma__ScoreClient<$Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Score.
     * @param {ScoreUpdateArgs} args - Arguments to update one Score.
     * @example
     * // Update one Score
     * const score = await prisma.score.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScoreUpdateArgs>(args: SelectSubset<T, ScoreUpdateArgs<ExtArgs>>): Prisma__ScoreClient<$Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Scores.
     * @param {ScoreDeleteManyArgs} args - Arguments to filter Scores to delete.
     * @example
     * // Delete a few Scores
     * const { count } = await prisma.score.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScoreDeleteManyArgs>(args?: SelectSubset<T, ScoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Scores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Scores
     * const score = await prisma.score.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScoreUpdateManyArgs>(args: SelectSubset<T, ScoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Score.
     * @param {ScoreUpsertArgs} args - Arguments to update or create a Score.
     * @example
     * // Update or create a Score
     * const score = await prisma.score.upsert({
     *   create: {
     *     // ... data to create a Score
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Score we want to update
     *   }
     * })
     */
    upsert<T extends ScoreUpsertArgs>(args: SelectSubset<T, ScoreUpsertArgs<ExtArgs>>): Prisma__ScoreClient<$Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Scores that matches the filter.
     * @param {ScoreFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const score = await prisma.score.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ScoreFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Score.
     * @param {ScoreAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const score = await prisma.score.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: ScoreAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Scores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreCountArgs} args - Arguments to filter Scores to count.
     * @example
     * // Count the number of Scores
     * const count = await prisma.score.count({
     *   where: {
     *     // ... the filter for the Scores we want to count
     *   }
     * })
    **/
    count<T extends ScoreCountArgs>(
      args?: Subset<T, ScoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Score.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScoreAggregateArgs>(args: Subset<T, ScoreAggregateArgs>): Prisma.PrismaPromise<GetScoreAggregateType<T>>

    /**
     * Group by Score.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScoreGroupByArgs['orderBy'] }
        : { orderBy?: ScoreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Score model
   */
  readonly fields: ScoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Score.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    program<T extends ProgramDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProgramDefaultArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    scoringCriteria<T extends ScoringCriteriaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ScoringCriteriaDefaultArgs<ExtArgs>>): Prisma__ScoringCriteriaClient<$Result.GetResult<Prisma.$ScoringCriteriaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Score model
   */
  interface ScoreFieldRefs {
    readonly id: FieldRef<"Score", 'String'>
    readonly value: FieldRef<"Score", 'Float'>
    readonly comment: FieldRef<"Score", 'String'>
    readonly programId: FieldRef<"Score", 'String'>
    readonly scoringCriteriaId: FieldRef<"Score", 'String'>
    readonly judgeId: FieldRef<"Score", 'String'>
    readonly createdAt: FieldRef<"Score", 'DateTime'>
    readonly updatedAt: FieldRef<"Score", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Score findUnique
   */
  export type ScoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
    /**
     * Filter, which Score to fetch.
     */
    where: ScoreWhereUniqueInput
  }

  /**
   * Score findUniqueOrThrow
   */
  export type ScoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
    /**
     * Filter, which Score to fetch.
     */
    where: ScoreWhereUniqueInput
  }

  /**
   * Score findFirst
   */
  export type ScoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
    /**
     * Filter, which Score to fetch.
     */
    where?: ScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scores to fetch.
     */
    orderBy?: ScoreOrderByWithRelationInput | ScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Scores.
     */
    cursor?: ScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Scores.
     */
    distinct?: ScoreScalarFieldEnum | ScoreScalarFieldEnum[]
  }

  /**
   * Score findFirstOrThrow
   */
  export type ScoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
    /**
     * Filter, which Score to fetch.
     */
    where?: ScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scores to fetch.
     */
    orderBy?: ScoreOrderByWithRelationInput | ScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Scores.
     */
    cursor?: ScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Scores.
     */
    distinct?: ScoreScalarFieldEnum | ScoreScalarFieldEnum[]
  }

  /**
   * Score findMany
   */
  export type ScoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
    /**
     * Filter, which Scores to fetch.
     */
    where?: ScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scores to fetch.
     */
    orderBy?: ScoreOrderByWithRelationInput | ScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Scores.
     */
    cursor?: ScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scores.
     */
    skip?: number
    distinct?: ScoreScalarFieldEnum | ScoreScalarFieldEnum[]
  }

  /**
   * Score create
   */
  export type ScoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
    /**
     * The data needed to create a Score.
     */
    data: XOR<ScoreCreateInput, ScoreUncheckedCreateInput>
  }

  /**
   * Score createMany
   */
  export type ScoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Scores.
     */
    data: ScoreCreateManyInput | ScoreCreateManyInput[]
  }

  /**
   * Score update
   */
  export type ScoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
    /**
     * The data needed to update a Score.
     */
    data: XOR<ScoreUpdateInput, ScoreUncheckedUpdateInput>
    /**
     * Choose, which Score to update.
     */
    where: ScoreWhereUniqueInput
  }

  /**
   * Score updateMany
   */
  export type ScoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Scores.
     */
    data: XOR<ScoreUpdateManyMutationInput, ScoreUncheckedUpdateManyInput>
    /**
     * Filter which Scores to update
     */
    where?: ScoreWhereInput
    /**
     * Limit how many Scores to update.
     */
    limit?: number
  }

  /**
   * Score upsert
   */
  export type ScoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
    /**
     * The filter to search for the Score to update in case it exists.
     */
    where: ScoreWhereUniqueInput
    /**
     * In case the Score found by the `where` argument doesn't exist, create a new Score with this data.
     */
    create: XOR<ScoreCreateInput, ScoreUncheckedCreateInput>
    /**
     * In case the Score was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScoreUpdateInput, ScoreUncheckedUpdateInput>
  }

  /**
   * Score delete
   */
  export type ScoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
    /**
     * Filter which Score to delete.
     */
    where: ScoreWhereUniqueInput
  }

  /**
   * Score deleteMany
   */
  export type ScoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Scores to delete
     */
    where?: ScoreWhereInput
    /**
     * Limit how many Scores to delete.
     */
    limit?: number
  }

  /**
   * Score findRaw
   */
  export type ScoreFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Score aggregateRaw
   */
  export type ScoreAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Score without action
   */
  export type ScoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: ScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Score
     */
    omit?: ScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreInclude<ExtArgs> | null
  }


  /**
   * Model Ranking
   */

  export type AggregateRanking = {
    _count: RankingCountAggregateOutputType | null
    _avg: RankingAvgAggregateOutputType | null
    _sum: RankingSumAggregateOutputType | null
    _min: RankingMinAggregateOutputType | null
    _max: RankingMaxAggregateOutputType | null
  }

  export type RankingAvgAggregateOutputType = {
    rank: number | null
    totalScore: number | null
  }

  export type RankingSumAggregateOutputType = {
    rank: number | null
    totalScore: number | null
  }

  export type RankingMinAggregateOutputType = {
    id: string | null
    rank: number | null
    totalScore: number | null
    updateType: $Enums.UpdateType | null
    competitionId: string | null
    programId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RankingMaxAggregateOutputType = {
    id: string | null
    rank: number | null
    totalScore: number | null
    updateType: $Enums.UpdateType | null
    competitionId: string | null
    programId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RankingCountAggregateOutputType = {
    id: number
    rank: number
    totalScore: number
    updateType: number
    competitionId: number
    programId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RankingAvgAggregateInputType = {
    rank?: true
    totalScore?: true
  }

  export type RankingSumAggregateInputType = {
    rank?: true
    totalScore?: true
  }

  export type RankingMinAggregateInputType = {
    id?: true
    rank?: true
    totalScore?: true
    updateType?: true
    competitionId?: true
    programId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RankingMaxAggregateInputType = {
    id?: true
    rank?: true
    totalScore?: true
    updateType?: true
    competitionId?: true
    programId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RankingCountAggregateInputType = {
    id?: true
    rank?: true
    totalScore?: true
    updateType?: true
    competitionId?: true
    programId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RankingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ranking to aggregate.
     */
    where?: RankingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rankings to fetch.
     */
    orderBy?: RankingOrderByWithRelationInput | RankingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RankingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rankings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rankings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rankings
    **/
    _count?: true | RankingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RankingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RankingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RankingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RankingMaxAggregateInputType
  }

  export type GetRankingAggregateType<T extends RankingAggregateArgs> = {
        [P in keyof T & keyof AggregateRanking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRanking[P]>
      : GetScalarType<T[P], AggregateRanking[P]>
  }




  export type RankingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RankingWhereInput
    orderBy?: RankingOrderByWithAggregationInput | RankingOrderByWithAggregationInput[]
    by: RankingScalarFieldEnum[] | RankingScalarFieldEnum
    having?: RankingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RankingCountAggregateInputType | true
    _avg?: RankingAvgAggregateInputType
    _sum?: RankingSumAggregateInputType
    _min?: RankingMinAggregateInputType
    _max?: RankingMaxAggregateInputType
  }

  export type RankingGroupByOutputType = {
    id: string
    rank: number
    totalScore: number
    updateType: $Enums.UpdateType
    competitionId: string
    programId: string
    createdAt: Date
    updatedAt: Date
    _count: RankingCountAggregateOutputType | null
    _avg: RankingAvgAggregateOutputType | null
    _sum: RankingSumAggregateOutputType | null
    _min: RankingMinAggregateOutputType | null
    _max: RankingMaxAggregateOutputType | null
  }

  type GetRankingGroupByPayload<T extends RankingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RankingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RankingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RankingGroupByOutputType[P]>
            : GetScalarType<T[P], RankingGroupByOutputType[P]>
        }
      >
    >


  export type RankingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rank?: boolean
    totalScore?: boolean
    updateType?: boolean
    competitionId?: boolean
    programId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    competition?: boolean | CompetitionDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ranking"]>



  export type RankingSelectScalar = {
    id?: boolean
    rank?: boolean
    totalScore?: boolean
    updateType?: boolean
    competitionId?: boolean
    programId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RankingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "rank" | "totalScore" | "updateType" | "competitionId" | "programId" | "createdAt" | "updatedAt", ExtArgs["result"]["ranking"]>
  export type RankingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    competition?: boolean | CompetitionDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }

  export type $RankingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ranking"
    objects: {
      competition: Prisma.$CompetitionPayload<ExtArgs>
      program: Prisma.$ProgramPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      rank: number
      totalScore: number
      updateType: $Enums.UpdateType
      competitionId: string
      programId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ranking"]>
    composites: {}
  }

  type RankingGetPayload<S extends boolean | null | undefined | RankingDefaultArgs> = $Result.GetResult<Prisma.$RankingPayload, S>

  type RankingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RankingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RankingCountAggregateInputType | true
    }

  export interface RankingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ranking'], meta: { name: 'Ranking' } }
    /**
     * Find zero or one Ranking that matches the filter.
     * @param {RankingFindUniqueArgs} args - Arguments to find a Ranking
     * @example
     * // Get one Ranking
     * const ranking = await prisma.ranking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RankingFindUniqueArgs>(args: SelectSubset<T, RankingFindUniqueArgs<ExtArgs>>): Prisma__RankingClient<$Result.GetResult<Prisma.$RankingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ranking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RankingFindUniqueOrThrowArgs} args - Arguments to find a Ranking
     * @example
     * // Get one Ranking
     * const ranking = await prisma.ranking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RankingFindUniqueOrThrowArgs>(args: SelectSubset<T, RankingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RankingClient<$Result.GetResult<Prisma.$RankingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ranking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingFindFirstArgs} args - Arguments to find a Ranking
     * @example
     * // Get one Ranking
     * const ranking = await prisma.ranking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RankingFindFirstArgs>(args?: SelectSubset<T, RankingFindFirstArgs<ExtArgs>>): Prisma__RankingClient<$Result.GetResult<Prisma.$RankingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ranking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingFindFirstOrThrowArgs} args - Arguments to find a Ranking
     * @example
     * // Get one Ranking
     * const ranking = await prisma.ranking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RankingFindFirstOrThrowArgs>(args?: SelectSubset<T, RankingFindFirstOrThrowArgs<ExtArgs>>): Prisma__RankingClient<$Result.GetResult<Prisma.$RankingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rankings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rankings
     * const rankings = await prisma.ranking.findMany()
     * 
     * // Get first 10 Rankings
     * const rankings = await prisma.ranking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rankingWithIdOnly = await prisma.ranking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RankingFindManyArgs>(args?: SelectSubset<T, RankingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RankingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ranking.
     * @param {RankingCreateArgs} args - Arguments to create a Ranking.
     * @example
     * // Create one Ranking
     * const Ranking = await prisma.ranking.create({
     *   data: {
     *     // ... data to create a Ranking
     *   }
     * })
     * 
     */
    create<T extends RankingCreateArgs>(args: SelectSubset<T, RankingCreateArgs<ExtArgs>>): Prisma__RankingClient<$Result.GetResult<Prisma.$RankingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Rankings.
     * @param {RankingCreateManyArgs} args - Arguments to create many Rankings.
     * @example
     * // Create many Rankings
     * const ranking = await prisma.ranking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RankingCreateManyArgs>(args?: SelectSubset<T, RankingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Ranking.
     * @param {RankingDeleteArgs} args - Arguments to delete one Ranking.
     * @example
     * // Delete one Ranking
     * const Ranking = await prisma.ranking.delete({
     *   where: {
     *     // ... filter to delete one Ranking
     *   }
     * })
     * 
     */
    delete<T extends RankingDeleteArgs>(args: SelectSubset<T, RankingDeleteArgs<ExtArgs>>): Prisma__RankingClient<$Result.GetResult<Prisma.$RankingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ranking.
     * @param {RankingUpdateArgs} args - Arguments to update one Ranking.
     * @example
     * // Update one Ranking
     * const ranking = await prisma.ranking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RankingUpdateArgs>(args: SelectSubset<T, RankingUpdateArgs<ExtArgs>>): Prisma__RankingClient<$Result.GetResult<Prisma.$RankingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Rankings.
     * @param {RankingDeleteManyArgs} args - Arguments to filter Rankings to delete.
     * @example
     * // Delete a few Rankings
     * const { count } = await prisma.ranking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RankingDeleteManyArgs>(args?: SelectSubset<T, RankingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rankings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rankings
     * const ranking = await prisma.ranking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RankingUpdateManyArgs>(args: SelectSubset<T, RankingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Ranking.
     * @param {RankingUpsertArgs} args - Arguments to update or create a Ranking.
     * @example
     * // Update or create a Ranking
     * const ranking = await prisma.ranking.upsert({
     *   create: {
     *     // ... data to create a Ranking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ranking we want to update
     *   }
     * })
     */
    upsert<T extends RankingUpsertArgs>(args: SelectSubset<T, RankingUpsertArgs<ExtArgs>>): Prisma__RankingClient<$Result.GetResult<Prisma.$RankingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rankings that matches the filter.
     * @param {RankingFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const ranking = await prisma.ranking.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: RankingFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Ranking.
     * @param {RankingAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const ranking = await prisma.ranking.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: RankingAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Rankings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingCountArgs} args - Arguments to filter Rankings to count.
     * @example
     * // Count the number of Rankings
     * const count = await prisma.ranking.count({
     *   where: {
     *     // ... the filter for the Rankings we want to count
     *   }
     * })
    **/
    count<T extends RankingCountArgs>(
      args?: Subset<T, RankingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RankingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ranking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RankingAggregateArgs>(args: Subset<T, RankingAggregateArgs>): Prisma.PrismaPromise<GetRankingAggregateType<T>>

    /**
     * Group by Ranking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RankingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RankingGroupByArgs['orderBy'] }
        : { orderBy?: RankingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RankingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRankingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ranking model
   */
  readonly fields: RankingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ranking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RankingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    competition<T extends CompetitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompetitionDefaultArgs<ExtArgs>>): Prisma__CompetitionClient<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    program<T extends ProgramDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProgramDefaultArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ranking model
   */
  interface RankingFieldRefs {
    readonly id: FieldRef<"Ranking", 'String'>
    readonly rank: FieldRef<"Ranking", 'Int'>
    readonly totalScore: FieldRef<"Ranking", 'Float'>
    readonly updateType: FieldRef<"Ranking", 'UpdateType'>
    readonly competitionId: FieldRef<"Ranking", 'String'>
    readonly programId: FieldRef<"Ranking", 'String'>
    readonly createdAt: FieldRef<"Ranking", 'DateTime'>
    readonly updatedAt: FieldRef<"Ranking", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ranking findUnique
   */
  export type RankingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
    /**
     * Filter, which Ranking to fetch.
     */
    where: RankingWhereUniqueInput
  }

  /**
   * Ranking findUniqueOrThrow
   */
  export type RankingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
    /**
     * Filter, which Ranking to fetch.
     */
    where: RankingWhereUniqueInput
  }

  /**
   * Ranking findFirst
   */
  export type RankingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
    /**
     * Filter, which Ranking to fetch.
     */
    where?: RankingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rankings to fetch.
     */
    orderBy?: RankingOrderByWithRelationInput | RankingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rankings.
     */
    cursor?: RankingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rankings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rankings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rankings.
     */
    distinct?: RankingScalarFieldEnum | RankingScalarFieldEnum[]
  }

  /**
   * Ranking findFirstOrThrow
   */
  export type RankingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
    /**
     * Filter, which Ranking to fetch.
     */
    where?: RankingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rankings to fetch.
     */
    orderBy?: RankingOrderByWithRelationInput | RankingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rankings.
     */
    cursor?: RankingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rankings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rankings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rankings.
     */
    distinct?: RankingScalarFieldEnum | RankingScalarFieldEnum[]
  }

  /**
   * Ranking findMany
   */
  export type RankingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
    /**
     * Filter, which Rankings to fetch.
     */
    where?: RankingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rankings to fetch.
     */
    orderBy?: RankingOrderByWithRelationInput | RankingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rankings.
     */
    cursor?: RankingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rankings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rankings.
     */
    skip?: number
    distinct?: RankingScalarFieldEnum | RankingScalarFieldEnum[]
  }

  /**
   * Ranking create
   */
  export type RankingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
    /**
     * The data needed to create a Ranking.
     */
    data: XOR<RankingCreateInput, RankingUncheckedCreateInput>
  }

  /**
   * Ranking createMany
   */
  export type RankingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rankings.
     */
    data: RankingCreateManyInput | RankingCreateManyInput[]
  }

  /**
   * Ranking update
   */
  export type RankingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
    /**
     * The data needed to update a Ranking.
     */
    data: XOR<RankingUpdateInput, RankingUncheckedUpdateInput>
    /**
     * Choose, which Ranking to update.
     */
    where: RankingWhereUniqueInput
  }

  /**
   * Ranking updateMany
   */
  export type RankingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rankings.
     */
    data: XOR<RankingUpdateManyMutationInput, RankingUncheckedUpdateManyInput>
    /**
     * Filter which Rankings to update
     */
    where?: RankingWhereInput
    /**
     * Limit how many Rankings to update.
     */
    limit?: number
  }

  /**
   * Ranking upsert
   */
  export type RankingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
    /**
     * The filter to search for the Ranking to update in case it exists.
     */
    where: RankingWhereUniqueInput
    /**
     * In case the Ranking found by the `where` argument doesn't exist, create a new Ranking with this data.
     */
    create: XOR<RankingCreateInput, RankingUncheckedCreateInput>
    /**
     * In case the Ranking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RankingUpdateInput, RankingUncheckedUpdateInput>
  }

  /**
   * Ranking delete
   */
  export type RankingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
    /**
     * Filter which Ranking to delete.
     */
    where: RankingWhereUniqueInput
  }

  /**
   * Ranking deleteMany
   */
  export type RankingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rankings to delete
     */
    where?: RankingWhereInput
    /**
     * Limit how many Rankings to delete.
     */
    limit?: number
  }

  /**
   * Ranking findRaw
   */
  export type RankingFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Ranking aggregateRaw
   */
  export type RankingAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Ranking without action
   */
  export type RankingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ranking
     */
    select?: RankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ranking
     */
    omit?: RankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingInclude<ExtArgs> | null
  }


  /**
   * Model File
   */

  export type AggregateFile = {
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  export type FileAvgAggregateOutputType = {
    size: number | null
  }

  export type FileSumAggregateOutputType = {
    size: number | null
  }

  export type FileMinAggregateOutputType = {
    id: string | null
    filename: string | null
    path: string | null
    mimetype: string | null
    size: number | null
    createdAt: Date | null
  }

  export type FileMaxAggregateOutputType = {
    id: string | null
    filename: string | null
    path: string | null
    mimetype: string | null
    size: number | null
    createdAt: Date | null
  }

  export type FileCountAggregateOutputType = {
    id: number
    filename: number
    path: number
    mimetype: number
    size: number
    createdAt: number
    programIds: number
    competitionIds: number
    _all: number
  }


  export type FileAvgAggregateInputType = {
    size?: true
  }

  export type FileSumAggregateInputType = {
    size?: true
  }

  export type FileMinAggregateInputType = {
    id?: true
    filename?: true
    path?: true
    mimetype?: true
    size?: true
    createdAt?: true
  }

  export type FileMaxAggregateInputType = {
    id?: true
    filename?: true
    path?: true
    mimetype?: true
    size?: true
    createdAt?: true
  }

  export type FileCountAggregateInputType = {
    id?: true
    filename?: true
    path?: true
    mimetype?: true
    size?: true
    createdAt?: true
    programIds?: true
    competitionIds?: true
    _all?: true
  }

  export type FileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which File to aggregate.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Files
    **/
    _count?: true | FileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileMaxAggregateInputType
  }

  export type GetFileAggregateType<T extends FileAggregateArgs> = {
        [P in keyof T & keyof AggregateFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFile[P]>
      : GetScalarType<T[P], AggregateFile[P]>
  }




  export type FileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
    orderBy?: FileOrderByWithAggregationInput | FileOrderByWithAggregationInput[]
    by: FileScalarFieldEnum[] | FileScalarFieldEnum
    having?: FileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileCountAggregateInputType | true
    _avg?: FileAvgAggregateInputType
    _sum?: FileSumAggregateInputType
    _min?: FileMinAggregateInputType
    _max?: FileMaxAggregateInputType
  }

  export type FileGroupByOutputType = {
    id: string
    filename: string
    path: string
    mimetype: string
    size: number
    createdAt: Date
    programIds: string[]
    competitionIds: string[]
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  type GetFileGroupByPayload<T extends FileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileGroupByOutputType[P]>
            : GetScalarType<T[P], FileGroupByOutputType[P]>
        }
      >
    >


  export type FileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filename?: boolean
    path?: boolean
    mimetype?: boolean
    size?: boolean
    createdAt?: boolean
    programIds?: boolean
    competitionIds?: boolean
    programs?: boolean | File$programsArgs<ExtArgs>
    competitions?: boolean | File$competitionsArgs<ExtArgs>
    backgroundImageCompetitions?: boolean | File$backgroundImageCompetitionsArgs<ExtArgs>
    _count?: boolean | FileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["file"]>



  export type FileSelectScalar = {
    id?: boolean
    filename?: boolean
    path?: boolean
    mimetype?: boolean
    size?: boolean
    createdAt?: boolean
    programIds?: boolean
    competitionIds?: boolean
  }

  export type FileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "filename" | "path" | "mimetype" | "size" | "createdAt" | "programIds" | "competitionIds", ExtArgs["result"]["file"]>
  export type FileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programs?: boolean | File$programsArgs<ExtArgs>
    competitions?: boolean | File$competitionsArgs<ExtArgs>
    backgroundImageCompetitions?: boolean | File$backgroundImageCompetitionsArgs<ExtArgs>
    _count?: boolean | FileCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $FilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "File"
    objects: {
      programs: Prisma.$ProgramPayload<ExtArgs>[]
      competitions: Prisma.$CompetitionPayload<ExtArgs>[]
      backgroundImageCompetitions: Prisma.$CompetitionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      filename: string
      path: string
      mimetype: string
      size: number
      createdAt: Date
      programIds: string[]
      competitionIds: string[]
    }, ExtArgs["result"]["file"]>
    composites: {}
  }

  type FileGetPayload<S extends boolean | null | undefined | FileDefaultArgs> = $Result.GetResult<Prisma.$FilePayload, S>

  type FileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FileCountAggregateInputType | true
    }

  export interface FileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['File'], meta: { name: 'File' } }
    /**
     * Find zero or one File that matches the filter.
     * @param {FileFindUniqueArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileFindUniqueArgs>(args: SelectSubset<T, FileFindUniqueArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one File that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FileFindUniqueOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileFindUniqueOrThrowArgs>(args: SelectSubset<T, FileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first File that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileFindFirstArgs>(args?: SelectSubset<T, FileFindFirstArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first File that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileFindFirstOrThrowArgs>(args?: SelectSubset<T, FileFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Files
     * const files = await prisma.file.findMany()
     * 
     * // Get first 10 Files
     * const files = await prisma.file.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileWithIdOnly = await prisma.file.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileFindManyArgs>(args?: SelectSubset<T, FileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a File.
     * @param {FileCreateArgs} args - Arguments to create a File.
     * @example
     * // Create one File
     * const File = await prisma.file.create({
     *   data: {
     *     // ... data to create a File
     *   }
     * })
     * 
     */
    create<T extends FileCreateArgs>(args: SelectSubset<T, FileCreateArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Files.
     * @param {FileCreateManyArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const file = await prisma.file.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileCreateManyArgs>(args?: SelectSubset<T, FileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a File.
     * @param {FileDeleteArgs} args - Arguments to delete one File.
     * @example
     * // Delete one File
     * const File = await prisma.file.delete({
     *   where: {
     *     // ... filter to delete one File
     *   }
     * })
     * 
     */
    delete<T extends FileDeleteArgs>(args: SelectSubset<T, FileDeleteArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one File.
     * @param {FileUpdateArgs} args - Arguments to update one File.
     * @example
     * // Update one File
     * const file = await prisma.file.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileUpdateArgs>(args: SelectSubset<T, FileUpdateArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Files.
     * @param {FileDeleteManyArgs} args - Arguments to filter Files to delete.
     * @example
     * // Delete a few Files
     * const { count } = await prisma.file.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileDeleteManyArgs>(args?: SelectSubset<T, FileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Files
     * const file = await prisma.file.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileUpdateManyArgs>(args: SelectSubset<T, FileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one File.
     * @param {FileUpsertArgs} args - Arguments to update or create a File.
     * @example
     * // Update or create a File
     * const file = await prisma.file.upsert({
     *   create: {
     *     // ... data to create a File
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the File we want to update
     *   }
     * })
     */
    upsert<T extends FileUpsertArgs>(args: SelectSubset<T, FileUpsertArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Files that matches the filter.
     * @param {FileFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const file = await prisma.file.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: FileFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a File.
     * @param {FileAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const file = await prisma.file.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: FileAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileCountArgs} args - Arguments to filter Files to count.
     * @example
     * // Count the number of Files
     * const count = await prisma.file.count({
     *   where: {
     *     // ... the filter for the Files we want to count
     *   }
     * })
    **/
    count<T extends FileCountArgs>(
      args?: Subset<T, FileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileAggregateArgs>(args: Subset<T, FileAggregateArgs>): Prisma.PrismaPromise<GetFileAggregateType<T>>

    /**
     * Group by File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileGroupByArgs['orderBy'] }
        : { orderBy?: FileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the File model
   */
  readonly fields: FileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for File.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    programs<T extends File$programsArgs<ExtArgs> = {}>(args?: Subset<T, File$programsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    competitions<T extends File$competitionsArgs<ExtArgs> = {}>(args?: Subset<T, File$competitionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    backgroundImageCompetitions<T extends File$backgroundImageCompetitionsArgs<ExtArgs> = {}>(args?: Subset<T, File$backgroundImageCompetitionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompetitionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the File model
   */
  interface FileFieldRefs {
    readonly id: FieldRef<"File", 'String'>
    readonly filename: FieldRef<"File", 'String'>
    readonly path: FieldRef<"File", 'String'>
    readonly mimetype: FieldRef<"File", 'String'>
    readonly size: FieldRef<"File", 'Int'>
    readonly createdAt: FieldRef<"File", 'DateTime'>
    readonly programIds: FieldRef<"File", 'String[]'>
    readonly competitionIds: FieldRef<"File", 'String[]'>
  }
    

  // Custom InputTypes
  /**
   * File findUnique
   */
  export type FileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File findUniqueOrThrow
   */
  export type FileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File findFirst
   */
  export type FileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File findFirstOrThrow
   */
  export type FileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File findMany
   */
  export type FileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which Files to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File create
   */
  export type FileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The data needed to create a File.
     */
    data: XOR<FileCreateInput, FileUncheckedCreateInput>
  }

  /**
   * File createMany
   */
  export type FileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Files.
     */
    data: FileCreateManyInput | FileCreateManyInput[]
  }

  /**
   * File update
   */
  export type FileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The data needed to update a File.
     */
    data: XOR<FileUpdateInput, FileUncheckedUpdateInput>
    /**
     * Choose, which File to update.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File updateMany
   */
  export type FileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Files.
     */
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FileWhereInput
    /**
     * Limit how many Files to update.
     */
    limit?: number
  }

  /**
   * File upsert
   */
  export type FileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The filter to search for the File to update in case it exists.
     */
    where: FileWhereUniqueInput
    /**
     * In case the File found by the `where` argument doesn't exist, create a new File with this data.
     */
    create: XOR<FileCreateInput, FileUncheckedCreateInput>
    /**
     * In case the File was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileUpdateInput, FileUncheckedUpdateInput>
  }

  /**
   * File delete
   */
  export type FileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter which File to delete.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File deleteMany
   */
  export type FileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Files to delete
     */
    where?: FileWhereInput
    /**
     * Limit how many Files to delete.
     */
    limit?: number
  }

  /**
   * File findRaw
   */
  export type FileFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * File aggregateRaw
   */
  export type FileAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * File.programs
   */
  export type File$programsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    where?: ProgramWhereInput
    orderBy?: ProgramOrderByWithRelationInput | ProgramOrderByWithRelationInput[]
    cursor?: ProgramWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[]
  }

  /**
   * File.competitions
   */
  export type File$competitionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    where?: CompetitionWhereInput
    orderBy?: CompetitionOrderByWithRelationInput | CompetitionOrderByWithRelationInput[]
    cursor?: CompetitionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CompetitionScalarFieldEnum | CompetitionScalarFieldEnum[]
  }

  /**
   * File.backgroundImageCompetitions
   */
  export type File$backgroundImageCompetitionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competition
     */
    select?: CompetitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Competition
     */
    omit?: CompetitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompetitionInclude<ExtArgs> | null
    where?: CompetitionWhereInput
    orderBy?: CompetitionOrderByWithRelationInput | CompetitionOrderByWithRelationInput[]
    cursor?: CompetitionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CompetitionScalarFieldEnum | CompetitionScalarFieldEnum[]
  }

  /**
   * File without action
   */
  export type FileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    userId: string | null
    action: string | null
    targetId: string | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    userId: string | null
    action: string | null
    targetId: string | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    timestamp: number
    userId: number
    action: number
    targetId: number
    details: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    timestamp?: true
    userId?: true
    action?: true
    targetId?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    timestamp?: true
    userId?: true
    action?: true
    targetId?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    timestamp?: true
    userId?: true
    action?: true
    targetId?: true
    details?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    timestamp: Date
    userId: string
    action: string
    targetId: string | null
    details: JsonValue | null
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    userId?: boolean
    action?: boolean
    targetId?: boolean
    details?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>



  export type AuditLogSelectScalar = {
    id?: boolean
    timestamp?: boolean
    userId?: boolean
    action?: boolean
    targetId?: boolean
    details?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "timestamp" | "userId" | "action" | "targetId" | "details", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      userId: string
      action: string
      targetId: string | null
      details: Prisma.JsonValue | null
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * @param {AuditLogFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const auditLog = await prisma.auditLog.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AuditLogFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a AuditLog.
     * @param {AuditLogAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const auditLog = await prisma.auditLog.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: AuditLogAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly timestamp: FieldRef<"AuditLog", 'DateTime'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly targetId: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog findRaw
   */
  export type AuditLogFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AuditLog aggregateRaw
   */
  export type AuditLogAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CompetitionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    organizerId: 'organizerId',
    startTime: 'startTime',
    endTime: 'endTime',
    status: 'status',
    backgroundImageId: 'backgroundImageId',
    rankingUpdateMode: 'rankingUpdateMode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    fileIds: 'fileIds'
  };

  export type CompetitionScalarFieldEnum = (typeof CompetitionScalarFieldEnum)[keyof typeof CompetitionScalarFieldEnum]


  export const ScoringCriteriaScalarFieldEnum: {
    id: 'id',
    name: 'name',
    weight: 'weight',
    maxScore: 'maxScore',
    competitionId: 'competitionId'
  };

  export type ScoringCriteriaScalarFieldEnum = (typeof ScoringCriteriaScalarFieldEnum)[keyof typeof ScoringCriteriaScalarFieldEnum]


  export const ParticipantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    bio: 'bio',
    team: 'team',
    contact: 'contact',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    programIds: 'programIds'
  };

  export type ParticipantScalarFieldEnum = (typeof ParticipantScalarFieldEnum)[keyof typeof ParticipantScalarFieldEnum]


  export const ProgramScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    order: 'order',
    currentStatus: 'currentStatus',
    competitionId: 'competitionId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    participantIds: 'participantIds',
    fileIds: 'fileIds'
  };

  export type ProgramScalarFieldEnum = (typeof ProgramScalarFieldEnum)[keyof typeof ProgramScalarFieldEnum]


  export const ScoreScalarFieldEnum: {
    id: 'id',
    value: 'value',
    comment: 'comment',
    programId: 'programId',
    scoringCriteriaId: 'scoringCriteriaId',
    judgeId: 'judgeId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ScoreScalarFieldEnum = (typeof ScoreScalarFieldEnum)[keyof typeof ScoreScalarFieldEnum]


  export const RankingScalarFieldEnum: {
    id: 'id',
    rank: 'rank',
    totalScore: 'totalScore',
    updateType: 'updateType',
    competitionId: 'competitionId',
    programId: 'programId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RankingScalarFieldEnum = (typeof RankingScalarFieldEnum)[keyof typeof RankingScalarFieldEnum]


  export const FileScalarFieldEnum: {
    id: 'id',
    filename: 'filename',
    path: 'path',
    mimetype: 'mimetype',
    size: 'size',
    createdAt: 'createdAt',
    programIds: 'programIds',
    competitionIds: 'competitionIds'
  };

  export type FileScalarFieldEnum = (typeof FileScalarFieldEnum)[keyof typeof FileScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    timestamp: 'timestamp',
    userId: 'userId',
    action: 'action',
    targetId: 'targetId',
    details: 'details'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'CompetitionStatus'
   */
  export type EnumCompetitionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompetitionStatus'>
    


  /**
   * Reference to a field of type 'CompetitionStatus[]'
   */
  export type ListEnumCompetitionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompetitionStatus[]'>
    


  /**
   * Reference to a field of type 'RankingUpdateMode'
   */
  export type EnumRankingUpdateModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RankingUpdateMode'>
    


  /**
   * Reference to a field of type 'RankingUpdateMode[]'
   */
  export type ListEnumRankingUpdateModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RankingUpdateMode[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'ProgramStatus'
   */
  export type EnumProgramStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProgramStatus'>
    


  /**
   * Reference to a field of type 'ProgramStatus[]'
   */
  export type ListEnumProgramStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProgramStatus[]'>
    


  /**
   * Reference to a field of type 'UpdateType'
   */
  export type EnumUpdateTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UpdateType'>
    


  /**
   * Reference to a field of type 'UpdateType[]'
   */
  export type ListEnumUpdateTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UpdateType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    competitions?: CompetitionListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    competitions?: CompetitionOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    competitions?: CompetitionListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type CompetitionWhereInput = {
    AND?: CompetitionWhereInput | CompetitionWhereInput[]
    OR?: CompetitionWhereInput[]
    NOT?: CompetitionWhereInput | CompetitionWhereInput[]
    id?: StringFilter<"Competition"> | string
    name?: StringFilter<"Competition"> | string
    description?: StringNullableFilter<"Competition"> | string | null
    organizerId?: StringFilter<"Competition"> | string
    startTime?: DateTimeFilter<"Competition"> | Date | string
    endTime?: DateTimeFilter<"Competition"> | Date | string
    status?: EnumCompetitionStatusFilter<"Competition"> | $Enums.CompetitionStatus
    backgroundImageId?: StringNullableFilter<"Competition"> | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFilter<"Competition"> | $Enums.RankingUpdateMode
    createdAt?: DateTimeFilter<"Competition"> | Date | string
    updatedAt?: DateTimeFilter<"Competition"> | Date | string
    fileIds?: StringNullableListFilter<"Competition">
    organizer?: XOR<UserScalarRelationFilter, UserWhereInput>
    programs?: ProgramListRelationFilter
    scoringCriteria?: ScoringCriteriaListRelationFilter
    rankings?: RankingListRelationFilter
    backgroundImage?: XOR<FileNullableScalarRelationFilter, FileWhereInput> | null
    files?: FileListRelationFilter
  }

  export type CompetitionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    organizerId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    backgroundImageId?: SortOrder
    rankingUpdateMode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fileIds?: SortOrder
    organizer?: UserOrderByWithRelationInput
    programs?: ProgramOrderByRelationAggregateInput
    scoringCriteria?: ScoringCriteriaOrderByRelationAggregateInput
    rankings?: RankingOrderByRelationAggregateInput
    backgroundImage?: FileOrderByWithRelationInput
    files?: FileOrderByRelationAggregateInput
  }

  export type CompetitionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CompetitionWhereInput | CompetitionWhereInput[]
    OR?: CompetitionWhereInput[]
    NOT?: CompetitionWhereInput | CompetitionWhereInput[]
    name?: StringFilter<"Competition"> | string
    description?: StringNullableFilter<"Competition"> | string | null
    organizerId?: StringFilter<"Competition"> | string
    startTime?: DateTimeFilter<"Competition"> | Date | string
    endTime?: DateTimeFilter<"Competition"> | Date | string
    status?: EnumCompetitionStatusFilter<"Competition"> | $Enums.CompetitionStatus
    backgroundImageId?: StringNullableFilter<"Competition"> | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFilter<"Competition"> | $Enums.RankingUpdateMode
    createdAt?: DateTimeFilter<"Competition"> | Date | string
    updatedAt?: DateTimeFilter<"Competition"> | Date | string
    fileIds?: StringNullableListFilter<"Competition">
    organizer?: XOR<UserScalarRelationFilter, UserWhereInput>
    programs?: ProgramListRelationFilter
    scoringCriteria?: ScoringCriteriaListRelationFilter
    rankings?: RankingListRelationFilter
    backgroundImage?: XOR<FileNullableScalarRelationFilter, FileWhereInput> | null
    files?: FileListRelationFilter
  }, "id">

  export type CompetitionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    organizerId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    backgroundImageId?: SortOrder
    rankingUpdateMode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fileIds?: SortOrder
    _count?: CompetitionCountOrderByAggregateInput
    _max?: CompetitionMaxOrderByAggregateInput
    _min?: CompetitionMinOrderByAggregateInput
  }

  export type CompetitionScalarWhereWithAggregatesInput = {
    AND?: CompetitionScalarWhereWithAggregatesInput | CompetitionScalarWhereWithAggregatesInput[]
    OR?: CompetitionScalarWhereWithAggregatesInput[]
    NOT?: CompetitionScalarWhereWithAggregatesInput | CompetitionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Competition"> | string
    name?: StringWithAggregatesFilter<"Competition"> | string
    description?: StringNullableWithAggregatesFilter<"Competition"> | string | null
    organizerId?: StringWithAggregatesFilter<"Competition"> | string
    startTime?: DateTimeWithAggregatesFilter<"Competition"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"Competition"> | Date | string
    status?: EnumCompetitionStatusWithAggregatesFilter<"Competition"> | $Enums.CompetitionStatus
    backgroundImageId?: StringNullableWithAggregatesFilter<"Competition"> | string | null
    rankingUpdateMode?: EnumRankingUpdateModeWithAggregatesFilter<"Competition"> | $Enums.RankingUpdateMode
    createdAt?: DateTimeWithAggregatesFilter<"Competition"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Competition"> | Date | string
    fileIds?: StringNullableListFilter<"Competition">
  }

  export type ScoringCriteriaWhereInput = {
    AND?: ScoringCriteriaWhereInput | ScoringCriteriaWhereInput[]
    OR?: ScoringCriteriaWhereInput[]
    NOT?: ScoringCriteriaWhereInput | ScoringCriteriaWhereInput[]
    id?: StringFilter<"ScoringCriteria"> | string
    name?: StringFilter<"ScoringCriteria"> | string
    weight?: FloatFilter<"ScoringCriteria"> | number
    maxScore?: FloatFilter<"ScoringCriteria"> | number
    competitionId?: StringFilter<"ScoringCriteria"> | string
    competition?: XOR<CompetitionScalarRelationFilter, CompetitionWhereInput>
    scores?: ScoreListRelationFilter
  }

  export type ScoringCriteriaOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    weight?: SortOrder
    maxScore?: SortOrder
    competitionId?: SortOrder
    competition?: CompetitionOrderByWithRelationInput
    scores?: ScoreOrderByRelationAggregateInput
  }

  export type ScoringCriteriaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScoringCriteriaWhereInput | ScoringCriteriaWhereInput[]
    OR?: ScoringCriteriaWhereInput[]
    NOT?: ScoringCriteriaWhereInput | ScoringCriteriaWhereInput[]
    name?: StringFilter<"ScoringCriteria"> | string
    weight?: FloatFilter<"ScoringCriteria"> | number
    maxScore?: FloatFilter<"ScoringCriteria"> | number
    competitionId?: StringFilter<"ScoringCriteria"> | string
    competition?: XOR<CompetitionScalarRelationFilter, CompetitionWhereInput>
    scores?: ScoreListRelationFilter
  }, "id">

  export type ScoringCriteriaOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    weight?: SortOrder
    maxScore?: SortOrder
    competitionId?: SortOrder
    _count?: ScoringCriteriaCountOrderByAggregateInput
    _avg?: ScoringCriteriaAvgOrderByAggregateInput
    _max?: ScoringCriteriaMaxOrderByAggregateInput
    _min?: ScoringCriteriaMinOrderByAggregateInput
    _sum?: ScoringCriteriaSumOrderByAggregateInput
  }

  export type ScoringCriteriaScalarWhereWithAggregatesInput = {
    AND?: ScoringCriteriaScalarWhereWithAggregatesInput | ScoringCriteriaScalarWhereWithAggregatesInput[]
    OR?: ScoringCriteriaScalarWhereWithAggregatesInput[]
    NOT?: ScoringCriteriaScalarWhereWithAggregatesInput | ScoringCriteriaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ScoringCriteria"> | string
    name?: StringWithAggregatesFilter<"ScoringCriteria"> | string
    weight?: FloatWithAggregatesFilter<"ScoringCriteria"> | number
    maxScore?: FloatWithAggregatesFilter<"ScoringCriteria"> | number
    competitionId?: StringWithAggregatesFilter<"ScoringCriteria"> | string
  }

  export type ParticipantWhereInput = {
    AND?: ParticipantWhereInput | ParticipantWhereInput[]
    OR?: ParticipantWhereInput[]
    NOT?: ParticipantWhereInput | ParticipantWhereInput[]
    id?: StringFilter<"Participant"> | string
    name?: StringFilter<"Participant"> | string
    bio?: StringNullableFilter<"Participant"> | string | null
    team?: StringNullableFilter<"Participant"> | string | null
    contact?: StringNullableFilter<"Participant"> | string | null
    createdAt?: DateTimeFilter<"Participant"> | Date | string
    updatedAt?: DateTimeFilter<"Participant"> | Date | string
    programIds?: StringNullableListFilter<"Participant">
    programs?: ProgramListRelationFilter
  }

  export type ParticipantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    bio?: SortOrder
    team?: SortOrder
    contact?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    programIds?: SortOrder
    programs?: ProgramOrderByRelationAggregateInput
  }

  export type ParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ParticipantWhereInput | ParticipantWhereInput[]
    OR?: ParticipantWhereInput[]
    NOT?: ParticipantWhereInput | ParticipantWhereInput[]
    name?: StringFilter<"Participant"> | string
    bio?: StringNullableFilter<"Participant"> | string | null
    team?: StringNullableFilter<"Participant"> | string | null
    contact?: StringNullableFilter<"Participant"> | string | null
    createdAt?: DateTimeFilter<"Participant"> | Date | string
    updatedAt?: DateTimeFilter<"Participant"> | Date | string
    programIds?: StringNullableListFilter<"Participant">
    programs?: ProgramListRelationFilter
  }, "id">

  export type ParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    bio?: SortOrder
    team?: SortOrder
    contact?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    programIds?: SortOrder
    _count?: ParticipantCountOrderByAggregateInput
    _max?: ParticipantMaxOrderByAggregateInput
    _min?: ParticipantMinOrderByAggregateInput
  }

  export type ParticipantScalarWhereWithAggregatesInput = {
    AND?: ParticipantScalarWhereWithAggregatesInput | ParticipantScalarWhereWithAggregatesInput[]
    OR?: ParticipantScalarWhereWithAggregatesInput[]
    NOT?: ParticipantScalarWhereWithAggregatesInput | ParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Participant"> | string
    name?: StringWithAggregatesFilter<"Participant"> | string
    bio?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    team?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    contact?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Participant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Participant"> | Date | string
    programIds?: StringNullableListFilter<"Participant">
  }

  export type ProgramWhereInput = {
    AND?: ProgramWhereInput | ProgramWhereInput[]
    OR?: ProgramWhereInput[]
    NOT?: ProgramWhereInput | ProgramWhereInput[]
    id?: StringFilter<"Program"> | string
    name?: StringFilter<"Program"> | string
    description?: StringNullableFilter<"Program"> | string | null
    order?: IntFilter<"Program"> | number
    currentStatus?: EnumProgramStatusFilter<"Program"> | $Enums.ProgramStatus
    competitionId?: StringFilter<"Program"> | string
    createdAt?: DateTimeFilter<"Program"> | Date | string
    updatedAt?: DateTimeFilter<"Program"> | Date | string
    participantIds?: StringNullableListFilter<"Program">
    fileIds?: StringNullableListFilter<"Program">
    competition?: XOR<CompetitionScalarRelationFilter, CompetitionWhereInput>
    participants?: ParticipantListRelationFilter
    attachments?: FileListRelationFilter
    scores?: ScoreListRelationFilter
    ranking?: XOR<RankingNullableScalarRelationFilter, RankingWhereInput> | null
  }

  export type ProgramOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    order?: SortOrder
    currentStatus?: SortOrder
    competitionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    participantIds?: SortOrder
    fileIds?: SortOrder
    competition?: CompetitionOrderByWithRelationInput
    participants?: ParticipantOrderByRelationAggregateInput
    attachments?: FileOrderByRelationAggregateInput
    scores?: ScoreOrderByRelationAggregateInput
    ranking?: RankingOrderByWithRelationInput
  }

  export type ProgramWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProgramWhereInput | ProgramWhereInput[]
    OR?: ProgramWhereInput[]
    NOT?: ProgramWhereInput | ProgramWhereInput[]
    name?: StringFilter<"Program"> | string
    description?: StringNullableFilter<"Program"> | string | null
    order?: IntFilter<"Program"> | number
    currentStatus?: EnumProgramStatusFilter<"Program"> | $Enums.ProgramStatus
    competitionId?: StringFilter<"Program"> | string
    createdAt?: DateTimeFilter<"Program"> | Date | string
    updatedAt?: DateTimeFilter<"Program"> | Date | string
    participantIds?: StringNullableListFilter<"Program">
    fileIds?: StringNullableListFilter<"Program">
    competition?: XOR<CompetitionScalarRelationFilter, CompetitionWhereInput>
    participants?: ParticipantListRelationFilter
    attachments?: FileListRelationFilter
    scores?: ScoreListRelationFilter
    ranking?: XOR<RankingNullableScalarRelationFilter, RankingWhereInput> | null
  }, "id">

  export type ProgramOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    order?: SortOrder
    currentStatus?: SortOrder
    competitionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    participantIds?: SortOrder
    fileIds?: SortOrder
    _count?: ProgramCountOrderByAggregateInput
    _avg?: ProgramAvgOrderByAggregateInput
    _max?: ProgramMaxOrderByAggregateInput
    _min?: ProgramMinOrderByAggregateInput
    _sum?: ProgramSumOrderByAggregateInput
  }

  export type ProgramScalarWhereWithAggregatesInput = {
    AND?: ProgramScalarWhereWithAggregatesInput | ProgramScalarWhereWithAggregatesInput[]
    OR?: ProgramScalarWhereWithAggregatesInput[]
    NOT?: ProgramScalarWhereWithAggregatesInput | ProgramScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Program"> | string
    name?: StringWithAggregatesFilter<"Program"> | string
    description?: StringNullableWithAggregatesFilter<"Program"> | string | null
    order?: IntWithAggregatesFilter<"Program"> | number
    currentStatus?: EnumProgramStatusWithAggregatesFilter<"Program"> | $Enums.ProgramStatus
    competitionId?: StringWithAggregatesFilter<"Program"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Program"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Program"> | Date | string
    participantIds?: StringNullableListFilter<"Program">
    fileIds?: StringNullableListFilter<"Program">
  }

  export type ScoreWhereInput = {
    AND?: ScoreWhereInput | ScoreWhereInput[]
    OR?: ScoreWhereInput[]
    NOT?: ScoreWhereInput | ScoreWhereInput[]
    id?: StringFilter<"Score"> | string
    value?: FloatFilter<"Score"> | number
    comment?: StringNullableFilter<"Score"> | string | null
    programId?: StringFilter<"Score"> | string
    scoringCriteriaId?: StringFilter<"Score"> | string
    judgeId?: StringFilter<"Score"> | string
    createdAt?: DateTimeFilter<"Score"> | Date | string
    updatedAt?: DateTimeFilter<"Score"> | Date | string
    program?: XOR<ProgramScalarRelationFilter, ProgramWhereInput>
    scoringCriteria?: XOR<ScoringCriteriaScalarRelationFilter, ScoringCriteriaWhereInput>
  }

  export type ScoreOrderByWithRelationInput = {
    id?: SortOrder
    value?: SortOrder
    comment?: SortOrder
    programId?: SortOrder
    scoringCriteriaId?: SortOrder
    judgeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    program?: ProgramOrderByWithRelationInput
    scoringCriteria?: ScoringCriteriaOrderByWithRelationInput
  }

  export type ScoreWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScoreWhereInput | ScoreWhereInput[]
    OR?: ScoreWhereInput[]
    NOT?: ScoreWhereInput | ScoreWhereInput[]
    value?: FloatFilter<"Score"> | number
    comment?: StringNullableFilter<"Score"> | string | null
    programId?: StringFilter<"Score"> | string
    scoringCriteriaId?: StringFilter<"Score"> | string
    judgeId?: StringFilter<"Score"> | string
    createdAt?: DateTimeFilter<"Score"> | Date | string
    updatedAt?: DateTimeFilter<"Score"> | Date | string
    program?: XOR<ProgramScalarRelationFilter, ProgramWhereInput>
    scoringCriteria?: XOR<ScoringCriteriaScalarRelationFilter, ScoringCriteriaWhereInput>
  }, "id">

  export type ScoreOrderByWithAggregationInput = {
    id?: SortOrder
    value?: SortOrder
    comment?: SortOrder
    programId?: SortOrder
    scoringCriteriaId?: SortOrder
    judgeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ScoreCountOrderByAggregateInput
    _avg?: ScoreAvgOrderByAggregateInput
    _max?: ScoreMaxOrderByAggregateInput
    _min?: ScoreMinOrderByAggregateInput
    _sum?: ScoreSumOrderByAggregateInput
  }

  export type ScoreScalarWhereWithAggregatesInput = {
    AND?: ScoreScalarWhereWithAggregatesInput | ScoreScalarWhereWithAggregatesInput[]
    OR?: ScoreScalarWhereWithAggregatesInput[]
    NOT?: ScoreScalarWhereWithAggregatesInput | ScoreScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Score"> | string
    value?: FloatWithAggregatesFilter<"Score"> | number
    comment?: StringNullableWithAggregatesFilter<"Score"> | string | null
    programId?: StringWithAggregatesFilter<"Score"> | string
    scoringCriteriaId?: StringWithAggregatesFilter<"Score"> | string
    judgeId?: StringWithAggregatesFilter<"Score"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Score"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Score"> | Date | string
  }

  export type RankingWhereInput = {
    AND?: RankingWhereInput | RankingWhereInput[]
    OR?: RankingWhereInput[]
    NOT?: RankingWhereInput | RankingWhereInput[]
    id?: StringFilter<"Ranking"> | string
    rank?: IntFilter<"Ranking"> | number
    totalScore?: FloatFilter<"Ranking"> | number
    updateType?: EnumUpdateTypeFilter<"Ranking"> | $Enums.UpdateType
    competitionId?: StringFilter<"Ranking"> | string
    programId?: StringFilter<"Ranking"> | string
    createdAt?: DateTimeFilter<"Ranking"> | Date | string
    updatedAt?: DateTimeFilter<"Ranking"> | Date | string
    competition?: XOR<CompetitionScalarRelationFilter, CompetitionWhereInput>
    program?: XOR<ProgramScalarRelationFilter, ProgramWhereInput>
  }

  export type RankingOrderByWithRelationInput = {
    id?: SortOrder
    rank?: SortOrder
    totalScore?: SortOrder
    updateType?: SortOrder
    competitionId?: SortOrder
    programId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    competition?: CompetitionOrderByWithRelationInput
    program?: ProgramOrderByWithRelationInput
  }

  export type RankingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    programId?: string
    AND?: RankingWhereInput | RankingWhereInput[]
    OR?: RankingWhereInput[]
    NOT?: RankingWhereInput | RankingWhereInput[]
    rank?: IntFilter<"Ranking"> | number
    totalScore?: FloatFilter<"Ranking"> | number
    updateType?: EnumUpdateTypeFilter<"Ranking"> | $Enums.UpdateType
    competitionId?: StringFilter<"Ranking"> | string
    createdAt?: DateTimeFilter<"Ranking"> | Date | string
    updatedAt?: DateTimeFilter<"Ranking"> | Date | string
    competition?: XOR<CompetitionScalarRelationFilter, CompetitionWhereInput>
    program?: XOR<ProgramScalarRelationFilter, ProgramWhereInput>
  }, "id" | "programId">

  export type RankingOrderByWithAggregationInput = {
    id?: SortOrder
    rank?: SortOrder
    totalScore?: SortOrder
    updateType?: SortOrder
    competitionId?: SortOrder
    programId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RankingCountOrderByAggregateInput
    _avg?: RankingAvgOrderByAggregateInput
    _max?: RankingMaxOrderByAggregateInput
    _min?: RankingMinOrderByAggregateInput
    _sum?: RankingSumOrderByAggregateInput
  }

  export type RankingScalarWhereWithAggregatesInput = {
    AND?: RankingScalarWhereWithAggregatesInput | RankingScalarWhereWithAggregatesInput[]
    OR?: RankingScalarWhereWithAggregatesInput[]
    NOT?: RankingScalarWhereWithAggregatesInput | RankingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ranking"> | string
    rank?: IntWithAggregatesFilter<"Ranking"> | number
    totalScore?: FloatWithAggregatesFilter<"Ranking"> | number
    updateType?: EnumUpdateTypeWithAggregatesFilter<"Ranking"> | $Enums.UpdateType
    competitionId?: StringWithAggregatesFilter<"Ranking"> | string
    programId?: StringWithAggregatesFilter<"Ranking"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Ranking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Ranking"> | Date | string
  }

  export type FileWhereInput = {
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    id?: StringFilter<"File"> | string
    filename?: StringFilter<"File"> | string
    path?: StringFilter<"File"> | string
    mimetype?: StringFilter<"File"> | string
    size?: IntFilter<"File"> | number
    createdAt?: DateTimeFilter<"File"> | Date | string
    programIds?: StringNullableListFilter<"File">
    competitionIds?: StringNullableListFilter<"File">
    programs?: ProgramListRelationFilter
    competitions?: CompetitionListRelationFilter
    backgroundImageCompetitions?: CompetitionListRelationFilter
  }

  export type FileOrderByWithRelationInput = {
    id?: SortOrder
    filename?: SortOrder
    path?: SortOrder
    mimetype?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    programIds?: SortOrder
    competitionIds?: SortOrder
    programs?: ProgramOrderByRelationAggregateInput
    competitions?: CompetitionOrderByRelationAggregateInput
    backgroundImageCompetitions?: CompetitionOrderByRelationAggregateInput
  }

  export type FileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    filename?: StringFilter<"File"> | string
    path?: StringFilter<"File"> | string
    mimetype?: StringFilter<"File"> | string
    size?: IntFilter<"File"> | number
    createdAt?: DateTimeFilter<"File"> | Date | string
    programIds?: StringNullableListFilter<"File">
    competitionIds?: StringNullableListFilter<"File">
    programs?: ProgramListRelationFilter
    competitions?: CompetitionListRelationFilter
    backgroundImageCompetitions?: CompetitionListRelationFilter
  }, "id">

  export type FileOrderByWithAggregationInput = {
    id?: SortOrder
    filename?: SortOrder
    path?: SortOrder
    mimetype?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    programIds?: SortOrder
    competitionIds?: SortOrder
    _count?: FileCountOrderByAggregateInput
    _avg?: FileAvgOrderByAggregateInput
    _max?: FileMaxOrderByAggregateInput
    _min?: FileMinOrderByAggregateInput
    _sum?: FileSumOrderByAggregateInput
  }

  export type FileScalarWhereWithAggregatesInput = {
    AND?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    OR?: FileScalarWhereWithAggregatesInput[]
    NOT?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"File"> | string
    filename?: StringWithAggregatesFilter<"File"> | string
    path?: StringWithAggregatesFilter<"File"> | string
    mimetype?: StringWithAggregatesFilter<"File"> | string
    size?: IntWithAggregatesFilter<"File"> | number
    createdAt?: DateTimeWithAggregatesFilter<"File"> | Date | string
    programIds?: StringNullableListFilter<"File">
    competitionIds?: StringNullableListFilter<"File">
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    targetId?: StringNullableFilter<"AuditLog"> | string | null
    details?: JsonNullableFilter<"AuditLog">
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetId?: SortOrder
    details?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    targetId?: StringNullableFilter<"AuditLog"> | string | null
    details?: JsonNullableFilter<"AuditLog">
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetId?: SortOrder
    details?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    timestamp?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
    userId?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    targetId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    details?: JsonNullableWithAggregatesFilter<"AuditLog">
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    competitions?: CompetitionCreateNestedManyWithoutOrganizerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    competitions?: CompetitionUncheckedCreateNestedManyWithoutOrganizerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competitions?: CompetitionUpdateManyWithoutOrganizerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competitions?: CompetitionUncheckedUpdateManyWithoutOrganizerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompetitionCreateInput = {
    id?: string
    name: string
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer: UserCreateNestedOneWithoutCompetitionsInput
    programs?: ProgramCreateNestedManyWithoutCompetitionInput
    scoringCriteria?: ScoringCriteriaCreateNestedManyWithoutCompetitionInput
    rankings?: RankingCreateNestedManyWithoutCompetitionInput
    backgroundImage?: FileCreateNestedOneWithoutBackgroundImageCompetitionsInput
    files?: FileCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    organizerId: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    backgroundImageId?: string | null
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    fileIds?: CompetitionCreatefileIdsInput | string[]
    programs?: ProgramUncheckedCreateNestedManyWithoutCompetitionInput
    scoringCriteria?: ScoringCriteriaUncheckedCreateNestedManyWithoutCompetitionInput
    rankings?: RankingUncheckedCreateNestedManyWithoutCompetitionInput
    files?: FileUncheckedCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneRequiredWithoutCompetitionsNestedInput
    programs?: ProgramUpdateManyWithoutCompetitionNestedInput
    scoringCriteria?: ScoringCriteriaUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUpdateManyWithoutCompetitionNestedInput
    backgroundImage?: FileUpdateOneWithoutBackgroundImageCompetitionsNestedInput
    files?: FileUpdateManyWithoutCompetitionsNestedInput
  }

  export type CompetitionUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    backgroundImageId?: NullableStringFieldUpdateOperationsInput | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileIds?: CompetitionUpdatefileIdsInput | string[]
    programs?: ProgramUncheckedUpdateManyWithoutCompetitionNestedInput
    scoringCriteria?: ScoringCriteriaUncheckedUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUncheckedUpdateManyWithoutCompetitionNestedInput
    files?: FileUncheckedUpdateManyWithoutCompetitionsNestedInput
  }

  export type CompetitionCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    organizerId: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    backgroundImageId?: string | null
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    fileIds?: CompetitionCreatefileIdsInput | string[]
  }

  export type CompetitionUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompetitionUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    backgroundImageId?: NullableStringFieldUpdateOperationsInput | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileIds?: CompetitionUpdatefileIdsInput | string[]
  }

  export type ScoringCriteriaCreateInput = {
    id?: string
    name: string
    weight: number
    maxScore: number
    competition: CompetitionCreateNestedOneWithoutScoringCriteriaInput
    scores?: ScoreCreateNestedManyWithoutScoringCriteriaInput
  }

  export type ScoringCriteriaUncheckedCreateInput = {
    id?: string
    name: string
    weight: number
    maxScore: number
    competitionId: string
    scores?: ScoreUncheckedCreateNestedManyWithoutScoringCriteriaInput
  }

  export type ScoringCriteriaUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    maxScore?: FloatFieldUpdateOperationsInput | number
    competition?: CompetitionUpdateOneRequiredWithoutScoringCriteriaNestedInput
    scores?: ScoreUpdateManyWithoutScoringCriteriaNestedInput
  }

  export type ScoringCriteriaUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    maxScore?: FloatFieldUpdateOperationsInput | number
    competitionId?: StringFieldUpdateOperationsInput | string
    scores?: ScoreUncheckedUpdateManyWithoutScoringCriteriaNestedInput
  }

  export type ScoringCriteriaCreateManyInput = {
    id?: string
    name: string
    weight: number
    maxScore: number
    competitionId: string
  }

  export type ScoringCriteriaUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    maxScore?: FloatFieldUpdateOperationsInput | number
  }

  export type ScoringCriteriaUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    maxScore?: FloatFieldUpdateOperationsInput | number
    competitionId?: StringFieldUpdateOperationsInput | string
  }

  export type ParticipantCreateInput = {
    id?: string
    name: string
    bio?: string | null
    team?: string | null
    contact?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramCreateNestedManyWithoutParticipantsInput
  }

  export type ParticipantUncheckedCreateInput = {
    id?: string
    name: string
    bio?: string | null
    team?: string | null
    contact?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    programIds?: ParticipantCreateprogramIdsInput | string[]
    programs?: ProgramUncheckedCreateNestedManyWithoutParticipantsInput
  }

  export type ParticipantUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    team?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramUpdateManyWithoutParticipantsNestedInput
  }

  export type ParticipantUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    team?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programIds?: ParticipantUpdateprogramIdsInput | string[]
    programs?: ProgramUncheckedUpdateManyWithoutParticipantsNestedInput
  }

  export type ParticipantCreateManyInput = {
    id?: string
    name: string
    bio?: string | null
    team?: string | null
    contact?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    programIds?: ParticipantCreateprogramIdsInput | string[]
  }

  export type ParticipantUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    team?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    team?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programIds?: ParticipantUpdateprogramIdsInput | string[]
  }

  export type ProgramCreateInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    competition: CompetitionCreateNestedOneWithoutProgramsInput
    participants?: ParticipantCreateNestedManyWithoutProgramsInput
    attachments?: FileCreateNestedManyWithoutProgramsInput
    scores?: ScoreCreateNestedManyWithoutProgramInput
    ranking?: RankingCreateNestedOneWithoutProgramInput
  }

  export type ProgramUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    competitionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participantIds?: ProgramCreateparticipantIdsInput | string[]
    fileIds?: ProgramCreatefileIdsInput | string[]
    participants?: ParticipantUncheckedCreateNestedManyWithoutProgramsInput
    attachments?: FileUncheckedCreateNestedManyWithoutProgramsInput
    scores?: ScoreUncheckedCreateNestedManyWithoutProgramInput
    ranking?: RankingUncheckedCreateNestedOneWithoutProgramInput
  }

  export type ProgramUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competition?: CompetitionUpdateOneRequiredWithoutProgramsNestedInput
    participants?: ParticipantUpdateManyWithoutProgramsNestedInput
    attachments?: FileUpdateManyWithoutProgramsNestedInput
    scores?: ScoreUpdateManyWithoutProgramNestedInput
    ranking?: RankingUpdateOneWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    competitionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participantIds?: ProgramUpdateparticipantIdsInput | string[]
    fileIds?: ProgramUpdatefileIdsInput | string[]
    participants?: ParticipantUncheckedUpdateManyWithoutProgramsNestedInput
    attachments?: FileUncheckedUpdateManyWithoutProgramsNestedInput
    scores?: ScoreUncheckedUpdateManyWithoutProgramNestedInput
    ranking?: RankingUncheckedUpdateOneWithoutProgramNestedInput
  }

  export type ProgramCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    competitionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participantIds?: ProgramCreateparticipantIdsInput | string[]
    fileIds?: ProgramCreatefileIdsInput | string[]
  }

  export type ProgramUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    competitionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participantIds?: ProgramUpdateparticipantIdsInput | string[]
    fileIds?: ProgramUpdatefileIdsInput | string[]
  }

  export type ScoreCreateInput = {
    id?: string
    value: number
    comment?: string | null
    judgeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    program: ProgramCreateNestedOneWithoutScoresInput
    scoringCriteria: ScoringCriteriaCreateNestedOneWithoutScoresInput
  }

  export type ScoreUncheckedCreateInput = {
    id?: string
    value: number
    comment?: string | null
    programId: string
    scoringCriteriaId: string
    judgeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScoreUpdateInput = {
    value?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    judgeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    program?: ProgramUpdateOneRequiredWithoutScoresNestedInput
    scoringCriteria?: ScoringCriteriaUpdateOneRequiredWithoutScoresNestedInput
  }

  export type ScoreUncheckedUpdateInput = {
    value?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    programId?: StringFieldUpdateOperationsInput | string
    scoringCriteriaId?: StringFieldUpdateOperationsInput | string
    judgeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScoreCreateManyInput = {
    id?: string
    value: number
    comment?: string | null
    programId: string
    scoringCriteriaId: string
    judgeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScoreUpdateManyMutationInput = {
    value?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    judgeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScoreUncheckedUpdateManyInput = {
    value?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    programId?: StringFieldUpdateOperationsInput | string
    scoringCriteriaId?: StringFieldUpdateOperationsInput | string
    judgeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RankingCreateInput = {
    id?: string
    rank: number
    totalScore: number
    updateType?: $Enums.UpdateType
    createdAt?: Date | string
    updatedAt?: Date | string
    competition: CompetitionCreateNestedOneWithoutRankingsInput
    program: ProgramCreateNestedOneWithoutRankingInput
  }

  export type RankingUncheckedCreateInput = {
    id?: string
    rank: number
    totalScore: number
    updateType?: $Enums.UpdateType
    competitionId: string
    programId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RankingUpdateInput = {
    rank?: IntFieldUpdateOperationsInput | number
    totalScore?: FloatFieldUpdateOperationsInput | number
    updateType?: EnumUpdateTypeFieldUpdateOperationsInput | $Enums.UpdateType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competition?: CompetitionUpdateOneRequiredWithoutRankingsNestedInput
    program?: ProgramUpdateOneRequiredWithoutRankingNestedInput
  }

  export type RankingUncheckedUpdateInput = {
    rank?: IntFieldUpdateOperationsInput | number
    totalScore?: FloatFieldUpdateOperationsInput | number
    updateType?: EnumUpdateTypeFieldUpdateOperationsInput | $Enums.UpdateType
    competitionId?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RankingCreateManyInput = {
    id?: string
    rank: number
    totalScore: number
    updateType?: $Enums.UpdateType
    competitionId: string
    programId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RankingUpdateManyMutationInput = {
    rank?: IntFieldUpdateOperationsInput | number
    totalScore?: FloatFieldUpdateOperationsInput | number
    updateType?: EnumUpdateTypeFieldUpdateOperationsInput | $Enums.UpdateType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RankingUncheckedUpdateManyInput = {
    rank?: IntFieldUpdateOperationsInput | number
    totalScore?: FloatFieldUpdateOperationsInput | number
    updateType?: EnumUpdateTypeFieldUpdateOperationsInput | $Enums.UpdateType
    competitionId?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileCreateInput = {
    id?: string
    filename: string
    path: string
    mimetype: string
    size: number
    createdAt?: Date | string
    programs?: ProgramCreateNestedManyWithoutAttachmentsInput
    competitions?: CompetitionCreateNestedManyWithoutFilesInput
    backgroundImageCompetitions?: CompetitionCreateNestedManyWithoutBackgroundImageInput
  }

  export type FileUncheckedCreateInput = {
    id?: string
    filename: string
    path: string
    mimetype: string
    size: number
    createdAt?: Date | string
    programIds?: FileCreateprogramIdsInput | string[]
    competitionIds?: FileCreatecompetitionIdsInput | string[]
    programs?: ProgramUncheckedCreateNestedManyWithoutAttachmentsInput
    competitions?: CompetitionUncheckedCreateNestedManyWithoutFilesInput
    backgroundImageCompetitions?: CompetitionUncheckedCreateNestedManyWithoutBackgroundImageInput
  }

  export type FileUpdateInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramUpdateManyWithoutAttachmentsNestedInput
    competitions?: CompetitionUpdateManyWithoutFilesNestedInput
    backgroundImageCompetitions?: CompetitionUpdateManyWithoutBackgroundImageNestedInput
  }

  export type FileUncheckedUpdateInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programIds?: FileUpdateprogramIdsInput | string[]
    competitionIds?: FileUpdatecompetitionIdsInput | string[]
    programs?: ProgramUncheckedUpdateManyWithoutAttachmentsNestedInput
    competitions?: CompetitionUncheckedUpdateManyWithoutFilesNestedInput
    backgroundImageCompetitions?: CompetitionUncheckedUpdateManyWithoutBackgroundImageNestedInput
  }

  export type FileCreateManyInput = {
    id?: string
    filename: string
    path: string
    mimetype: string
    size: number
    createdAt?: Date | string
    programIds?: FileCreateprogramIdsInput | string[]
    competitionIds?: FileCreatecompetitionIdsInput | string[]
  }

  export type FileUpdateManyMutationInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileUncheckedUpdateManyInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programIds?: FileUpdateprogramIdsInput | string[]
    competitionIds?: FileUpdatecompetitionIdsInput | string[]
  }

  export type AuditLogCreateInput = {
    id?: string
    timestamp?: Date | string
    action: string
    targetId?: string | null
    details?: InputJsonValue | null
    user: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    timestamp?: Date | string
    userId: string
    action: string
    targetId?: string | null
    details?: InputJsonValue | null
  }

  export type AuditLogUpdateInput = {
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: InputJsonValue | InputJsonValue | null
    user?: UserUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: InputJsonValue | InputJsonValue | null
  }

  export type AuditLogCreateManyInput = {
    id?: string
    timestamp?: Date | string
    userId: string
    action: string
    targetId?: string | null
    details?: InputJsonValue | null
  }

  export type AuditLogUpdateManyMutationInput = {
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: InputJsonValue | InputJsonValue | null
  }

  export type AuditLogUncheckedUpdateManyInput = {
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: InputJsonValue | InputJsonValue | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CompetitionListRelationFilter = {
    every?: CompetitionWhereInput
    some?: CompetitionWhereInput
    none?: CompetitionWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type CompetitionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type EnumCompetitionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CompetitionStatus | EnumCompetitionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CompetitionStatus[] | ListEnumCompetitionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompetitionStatus[] | ListEnumCompetitionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCompetitionStatusFilter<$PrismaModel> | $Enums.CompetitionStatus
  }

  export type EnumRankingUpdateModeFilter<$PrismaModel = never> = {
    equals?: $Enums.RankingUpdateMode | EnumRankingUpdateModeFieldRefInput<$PrismaModel>
    in?: $Enums.RankingUpdateMode[] | ListEnumRankingUpdateModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RankingUpdateMode[] | ListEnumRankingUpdateModeFieldRefInput<$PrismaModel>
    not?: NestedEnumRankingUpdateModeFilter<$PrismaModel> | $Enums.RankingUpdateMode
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ProgramListRelationFilter = {
    every?: ProgramWhereInput
    some?: ProgramWhereInput
    none?: ProgramWhereInput
  }

  export type ScoringCriteriaListRelationFilter = {
    every?: ScoringCriteriaWhereInput
    some?: ScoringCriteriaWhereInput
    none?: ScoringCriteriaWhereInput
  }

  export type RankingListRelationFilter = {
    every?: RankingWhereInput
    some?: RankingWhereInput
    none?: RankingWhereInput
  }

  export type FileNullableScalarRelationFilter = {
    is?: FileWhereInput | null
    isNot?: FileWhereInput | null
  }

  export type FileListRelationFilter = {
    every?: FileWhereInput
    some?: FileWhereInput
    none?: FileWhereInput
  }

  export type ProgramOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScoringCriteriaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RankingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompetitionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    organizerId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    backgroundImageId?: SortOrder
    rankingUpdateMode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fileIds?: SortOrder
  }

  export type CompetitionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    organizerId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    backgroundImageId?: SortOrder
    rankingUpdateMode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompetitionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    organizerId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    backgroundImageId?: SortOrder
    rankingUpdateMode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type EnumCompetitionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompetitionStatus | EnumCompetitionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CompetitionStatus[] | ListEnumCompetitionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompetitionStatus[] | ListEnumCompetitionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCompetitionStatusWithAggregatesFilter<$PrismaModel> | $Enums.CompetitionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCompetitionStatusFilter<$PrismaModel>
    _max?: NestedEnumCompetitionStatusFilter<$PrismaModel>
  }

  export type EnumRankingUpdateModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RankingUpdateMode | EnumRankingUpdateModeFieldRefInput<$PrismaModel>
    in?: $Enums.RankingUpdateMode[] | ListEnumRankingUpdateModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RankingUpdateMode[] | ListEnumRankingUpdateModeFieldRefInput<$PrismaModel>
    not?: NestedEnumRankingUpdateModeWithAggregatesFilter<$PrismaModel> | $Enums.RankingUpdateMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRankingUpdateModeFilter<$PrismaModel>
    _max?: NestedEnumRankingUpdateModeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type CompetitionScalarRelationFilter = {
    is?: CompetitionWhereInput
    isNot?: CompetitionWhereInput
  }

  export type ScoreListRelationFilter = {
    every?: ScoreWhereInput
    some?: ScoreWhereInput
    none?: ScoreWhereInput
  }

  export type ScoreOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScoringCriteriaCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    weight?: SortOrder
    maxScore?: SortOrder
    competitionId?: SortOrder
  }

  export type ScoringCriteriaAvgOrderByAggregateInput = {
    weight?: SortOrder
    maxScore?: SortOrder
  }

  export type ScoringCriteriaMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    weight?: SortOrder
    maxScore?: SortOrder
    competitionId?: SortOrder
  }

  export type ScoringCriteriaMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    weight?: SortOrder
    maxScore?: SortOrder
    competitionId?: SortOrder
  }

  export type ScoringCriteriaSumOrderByAggregateInput = {
    weight?: SortOrder
    maxScore?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    bio?: SortOrder
    team?: SortOrder
    contact?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    programIds?: SortOrder
  }

  export type ParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    bio?: SortOrder
    team?: SortOrder
    contact?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    bio?: SortOrder
    team?: SortOrder
    contact?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumProgramStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramStatus | EnumProgramStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramStatusFilter<$PrismaModel> | $Enums.ProgramStatus
  }

  export type ParticipantListRelationFilter = {
    every?: ParticipantWhereInput
    some?: ParticipantWhereInput
    none?: ParticipantWhereInput
  }

  export type RankingNullableScalarRelationFilter = {
    is?: RankingWhereInput | null
    isNot?: RankingWhereInput | null
  }

  export type ParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProgramCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    order?: SortOrder
    currentStatus?: SortOrder
    competitionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    participantIds?: SortOrder
    fileIds?: SortOrder
  }

  export type ProgramAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type ProgramMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    order?: SortOrder
    currentStatus?: SortOrder
    competitionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    order?: SortOrder
    currentStatus?: SortOrder
    competitionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumProgramStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramStatus | EnumProgramStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProgramStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProgramStatusFilter<$PrismaModel>
    _max?: NestedEnumProgramStatusFilter<$PrismaModel>
  }

  export type ProgramScalarRelationFilter = {
    is?: ProgramWhereInput
    isNot?: ProgramWhereInput
  }

  export type ScoringCriteriaScalarRelationFilter = {
    is?: ScoringCriteriaWhereInput
    isNot?: ScoringCriteriaWhereInput
  }

  export type ScoreCountOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
    comment?: SortOrder
    programId?: SortOrder
    scoringCriteriaId?: SortOrder
    judgeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScoreAvgOrderByAggregateInput = {
    value?: SortOrder
  }

  export type ScoreMaxOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
    comment?: SortOrder
    programId?: SortOrder
    scoringCriteriaId?: SortOrder
    judgeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScoreMinOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
    comment?: SortOrder
    programId?: SortOrder
    scoringCriteriaId?: SortOrder
    judgeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScoreSumOrderByAggregateInput = {
    value?: SortOrder
  }

  export type EnumUpdateTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.UpdateType | EnumUpdateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UpdateType[] | ListEnumUpdateTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UpdateType[] | ListEnumUpdateTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUpdateTypeFilter<$PrismaModel> | $Enums.UpdateType
  }

  export type RankingCountOrderByAggregateInput = {
    id?: SortOrder
    rank?: SortOrder
    totalScore?: SortOrder
    updateType?: SortOrder
    competitionId?: SortOrder
    programId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RankingAvgOrderByAggregateInput = {
    rank?: SortOrder
    totalScore?: SortOrder
  }

  export type RankingMaxOrderByAggregateInput = {
    id?: SortOrder
    rank?: SortOrder
    totalScore?: SortOrder
    updateType?: SortOrder
    competitionId?: SortOrder
    programId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RankingMinOrderByAggregateInput = {
    id?: SortOrder
    rank?: SortOrder
    totalScore?: SortOrder
    updateType?: SortOrder
    competitionId?: SortOrder
    programId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RankingSumOrderByAggregateInput = {
    rank?: SortOrder
    totalScore?: SortOrder
  }

  export type EnumUpdateTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UpdateType | EnumUpdateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UpdateType[] | ListEnumUpdateTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UpdateType[] | ListEnumUpdateTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUpdateTypeWithAggregatesFilter<$PrismaModel> | $Enums.UpdateType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUpdateTypeFilter<$PrismaModel>
    _max?: NestedEnumUpdateTypeFilter<$PrismaModel>
  }

  export type FileCountOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    path?: SortOrder
    mimetype?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    programIds?: SortOrder
    competitionIds?: SortOrder
  }

  export type FileAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type FileMaxOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    path?: SortOrder
    mimetype?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
  }

  export type FileMinOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    path?: SortOrder
    mimetype?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
  }

  export type FileSumOrderByAggregateInput = {
    size?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    isSet?: boolean
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetId?: SortOrder
    details?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetId?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetId?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type CompetitionCreateNestedManyWithoutOrganizerInput = {
    create?: XOR<CompetitionCreateWithoutOrganizerInput, CompetitionUncheckedCreateWithoutOrganizerInput> | CompetitionCreateWithoutOrganizerInput[] | CompetitionUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutOrganizerInput | CompetitionCreateOrConnectWithoutOrganizerInput[]
    createMany?: CompetitionCreateManyOrganizerInputEnvelope
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type CompetitionUncheckedCreateNestedManyWithoutOrganizerInput = {
    create?: XOR<CompetitionCreateWithoutOrganizerInput, CompetitionUncheckedCreateWithoutOrganizerInput> | CompetitionCreateWithoutOrganizerInput[] | CompetitionUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutOrganizerInput | CompetitionCreateOrConnectWithoutOrganizerInput[]
    createMany?: CompetitionCreateManyOrganizerInputEnvelope
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CompetitionUpdateManyWithoutOrganizerNestedInput = {
    create?: XOR<CompetitionCreateWithoutOrganizerInput, CompetitionUncheckedCreateWithoutOrganizerInput> | CompetitionCreateWithoutOrganizerInput[] | CompetitionUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutOrganizerInput | CompetitionCreateOrConnectWithoutOrganizerInput[]
    upsert?: CompetitionUpsertWithWhereUniqueWithoutOrganizerInput | CompetitionUpsertWithWhereUniqueWithoutOrganizerInput[]
    createMany?: CompetitionCreateManyOrganizerInputEnvelope
    set?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    disconnect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    delete?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    update?: CompetitionUpdateWithWhereUniqueWithoutOrganizerInput | CompetitionUpdateWithWhereUniqueWithoutOrganizerInput[]
    updateMany?: CompetitionUpdateManyWithWhereWithoutOrganizerInput | CompetitionUpdateManyWithWhereWithoutOrganizerInput[]
    deleteMany?: CompetitionScalarWhereInput | CompetitionScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type CompetitionUncheckedUpdateManyWithoutOrganizerNestedInput = {
    create?: XOR<CompetitionCreateWithoutOrganizerInput, CompetitionUncheckedCreateWithoutOrganizerInput> | CompetitionCreateWithoutOrganizerInput[] | CompetitionUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutOrganizerInput | CompetitionCreateOrConnectWithoutOrganizerInput[]
    upsert?: CompetitionUpsertWithWhereUniqueWithoutOrganizerInput | CompetitionUpsertWithWhereUniqueWithoutOrganizerInput[]
    createMany?: CompetitionCreateManyOrganizerInputEnvelope
    set?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    disconnect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    delete?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    update?: CompetitionUpdateWithWhereUniqueWithoutOrganizerInput | CompetitionUpdateWithWhereUniqueWithoutOrganizerInput[]
    updateMany?: CompetitionUpdateManyWithWhereWithoutOrganizerInput | CompetitionUpdateManyWithWhereWithoutOrganizerInput[]
    deleteMany?: CompetitionScalarWhereInput | CompetitionScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCompetitionsInput = {
    create?: XOR<UserCreateWithoutCompetitionsInput, UserUncheckedCreateWithoutCompetitionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCompetitionsInput
    connect?: UserWhereUniqueInput
  }

  export type ProgramCreateNestedManyWithoutCompetitionInput = {
    create?: XOR<ProgramCreateWithoutCompetitionInput, ProgramUncheckedCreateWithoutCompetitionInput> | ProgramCreateWithoutCompetitionInput[] | ProgramUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutCompetitionInput | ProgramCreateOrConnectWithoutCompetitionInput[]
    createMany?: ProgramCreateManyCompetitionInputEnvelope
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
  }

  export type ScoringCriteriaCreateNestedManyWithoutCompetitionInput = {
    create?: XOR<ScoringCriteriaCreateWithoutCompetitionInput, ScoringCriteriaUncheckedCreateWithoutCompetitionInput> | ScoringCriteriaCreateWithoutCompetitionInput[] | ScoringCriteriaUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: ScoringCriteriaCreateOrConnectWithoutCompetitionInput | ScoringCriteriaCreateOrConnectWithoutCompetitionInput[]
    createMany?: ScoringCriteriaCreateManyCompetitionInputEnvelope
    connect?: ScoringCriteriaWhereUniqueInput | ScoringCriteriaWhereUniqueInput[]
  }

  export type RankingCreateNestedManyWithoutCompetitionInput = {
    create?: XOR<RankingCreateWithoutCompetitionInput, RankingUncheckedCreateWithoutCompetitionInput> | RankingCreateWithoutCompetitionInput[] | RankingUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: RankingCreateOrConnectWithoutCompetitionInput | RankingCreateOrConnectWithoutCompetitionInput[]
    createMany?: RankingCreateManyCompetitionInputEnvelope
    connect?: RankingWhereUniqueInput | RankingWhereUniqueInput[]
  }

  export type FileCreateNestedOneWithoutBackgroundImageCompetitionsInput = {
    create?: XOR<FileCreateWithoutBackgroundImageCompetitionsInput, FileUncheckedCreateWithoutBackgroundImageCompetitionsInput>
    connectOrCreate?: FileCreateOrConnectWithoutBackgroundImageCompetitionsInput
    connect?: FileWhereUniqueInput
  }

  export type FileCreateNestedManyWithoutCompetitionsInput = {
    create?: XOR<FileCreateWithoutCompetitionsInput, FileUncheckedCreateWithoutCompetitionsInput> | FileCreateWithoutCompetitionsInput[] | FileUncheckedCreateWithoutCompetitionsInput[]
    connectOrCreate?: FileCreateOrConnectWithoutCompetitionsInput | FileCreateOrConnectWithoutCompetitionsInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type CompetitionCreatefileIdsInput = {
    set: string[]
  }

  export type ProgramUncheckedCreateNestedManyWithoutCompetitionInput = {
    create?: XOR<ProgramCreateWithoutCompetitionInput, ProgramUncheckedCreateWithoutCompetitionInput> | ProgramCreateWithoutCompetitionInput[] | ProgramUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutCompetitionInput | ProgramCreateOrConnectWithoutCompetitionInput[]
    createMany?: ProgramCreateManyCompetitionInputEnvelope
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
  }

  export type ScoringCriteriaUncheckedCreateNestedManyWithoutCompetitionInput = {
    create?: XOR<ScoringCriteriaCreateWithoutCompetitionInput, ScoringCriteriaUncheckedCreateWithoutCompetitionInput> | ScoringCriteriaCreateWithoutCompetitionInput[] | ScoringCriteriaUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: ScoringCriteriaCreateOrConnectWithoutCompetitionInput | ScoringCriteriaCreateOrConnectWithoutCompetitionInput[]
    createMany?: ScoringCriteriaCreateManyCompetitionInputEnvelope
    connect?: ScoringCriteriaWhereUniqueInput | ScoringCriteriaWhereUniqueInput[]
  }

  export type RankingUncheckedCreateNestedManyWithoutCompetitionInput = {
    create?: XOR<RankingCreateWithoutCompetitionInput, RankingUncheckedCreateWithoutCompetitionInput> | RankingCreateWithoutCompetitionInput[] | RankingUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: RankingCreateOrConnectWithoutCompetitionInput | RankingCreateOrConnectWithoutCompetitionInput[]
    createMany?: RankingCreateManyCompetitionInputEnvelope
    connect?: RankingWhereUniqueInput | RankingWhereUniqueInput[]
  }

  export type FileUncheckedCreateNestedManyWithoutCompetitionsInput = {
    create?: XOR<FileCreateWithoutCompetitionsInput, FileUncheckedCreateWithoutCompetitionsInput> | FileCreateWithoutCompetitionsInput[] | FileUncheckedCreateWithoutCompetitionsInput[]
    connectOrCreate?: FileCreateOrConnectWithoutCompetitionsInput | FileCreateOrConnectWithoutCompetitionsInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type EnumCompetitionStatusFieldUpdateOperationsInput = {
    set?: $Enums.CompetitionStatus
  }

  export type EnumRankingUpdateModeFieldUpdateOperationsInput = {
    set?: $Enums.RankingUpdateMode
  }

  export type UserUpdateOneRequiredWithoutCompetitionsNestedInput = {
    create?: XOR<UserCreateWithoutCompetitionsInput, UserUncheckedCreateWithoutCompetitionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCompetitionsInput
    upsert?: UserUpsertWithoutCompetitionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCompetitionsInput, UserUpdateWithoutCompetitionsInput>, UserUncheckedUpdateWithoutCompetitionsInput>
  }

  export type ProgramUpdateManyWithoutCompetitionNestedInput = {
    create?: XOR<ProgramCreateWithoutCompetitionInput, ProgramUncheckedCreateWithoutCompetitionInput> | ProgramCreateWithoutCompetitionInput[] | ProgramUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutCompetitionInput | ProgramCreateOrConnectWithoutCompetitionInput[]
    upsert?: ProgramUpsertWithWhereUniqueWithoutCompetitionInput | ProgramUpsertWithWhereUniqueWithoutCompetitionInput[]
    createMany?: ProgramCreateManyCompetitionInputEnvelope
    set?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    disconnect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    delete?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    update?: ProgramUpdateWithWhereUniqueWithoutCompetitionInput | ProgramUpdateWithWhereUniqueWithoutCompetitionInput[]
    updateMany?: ProgramUpdateManyWithWhereWithoutCompetitionInput | ProgramUpdateManyWithWhereWithoutCompetitionInput[]
    deleteMany?: ProgramScalarWhereInput | ProgramScalarWhereInput[]
  }

  export type ScoringCriteriaUpdateManyWithoutCompetitionNestedInput = {
    create?: XOR<ScoringCriteriaCreateWithoutCompetitionInput, ScoringCriteriaUncheckedCreateWithoutCompetitionInput> | ScoringCriteriaCreateWithoutCompetitionInput[] | ScoringCriteriaUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: ScoringCriteriaCreateOrConnectWithoutCompetitionInput | ScoringCriteriaCreateOrConnectWithoutCompetitionInput[]
    upsert?: ScoringCriteriaUpsertWithWhereUniqueWithoutCompetitionInput | ScoringCriteriaUpsertWithWhereUniqueWithoutCompetitionInput[]
    createMany?: ScoringCriteriaCreateManyCompetitionInputEnvelope
    set?: ScoringCriteriaWhereUniqueInput | ScoringCriteriaWhereUniqueInput[]
    disconnect?: ScoringCriteriaWhereUniqueInput | ScoringCriteriaWhereUniqueInput[]
    delete?: ScoringCriteriaWhereUniqueInput | ScoringCriteriaWhereUniqueInput[]
    connect?: ScoringCriteriaWhereUniqueInput | ScoringCriteriaWhereUniqueInput[]
    update?: ScoringCriteriaUpdateWithWhereUniqueWithoutCompetitionInput | ScoringCriteriaUpdateWithWhereUniqueWithoutCompetitionInput[]
    updateMany?: ScoringCriteriaUpdateManyWithWhereWithoutCompetitionInput | ScoringCriteriaUpdateManyWithWhereWithoutCompetitionInput[]
    deleteMany?: ScoringCriteriaScalarWhereInput | ScoringCriteriaScalarWhereInput[]
  }

  export type RankingUpdateManyWithoutCompetitionNestedInput = {
    create?: XOR<RankingCreateWithoutCompetitionInput, RankingUncheckedCreateWithoutCompetitionInput> | RankingCreateWithoutCompetitionInput[] | RankingUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: RankingCreateOrConnectWithoutCompetitionInput | RankingCreateOrConnectWithoutCompetitionInput[]
    upsert?: RankingUpsertWithWhereUniqueWithoutCompetitionInput | RankingUpsertWithWhereUniqueWithoutCompetitionInput[]
    createMany?: RankingCreateManyCompetitionInputEnvelope
    set?: RankingWhereUniqueInput | RankingWhereUniqueInput[]
    disconnect?: RankingWhereUniqueInput | RankingWhereUniqueInput[]
    delete?: RankingWhereUniqueInput | RankingWhereUniqueInput[]
    connect?: RankingWhereUniqueInput | RankingWhereUniqueInput[]
    update?: RankingUpdateWithWhereUniqueWithoutCompetitionInput | RankingUpdateWithWhereUniqueWithoutCompetitionInput[]
    updateMany?: RankingUpdateManyWithWhereWithoutCompetitionInput | RankingUpdateManyWithWhereWithoutCompetitionInput[]
    deleteMany?: RankingScalarWhereInput | RankingScalarWhereInput[]
  }

  export type FileUpdateOneWithoutBackgroundImageCompetitionsNestedInput = {
    create?: XOR<FileCreateWithoutBackgroundImageCompetitionsInput, FileUncheckedCreateWithoutBackgroundImageCompetitionsInput>
    connectOrCreate?: FileCreateOrConnectWithoutBackgroundImageCompetitionsInput
    upsert?: FileUpsertWithoutBackgroundImageCompetitionsInput
    disconnect?: boolean
    delete?: FileWhereInput | boolean
    connect?: FileWhereUniqueInput
    update?: XOR<XOR<FileUpdateToOneWithWhereWithoutBackgroundImageCompetitionsInput, FileUpdateWithoutBackgroundImageCompetitionsInput>, FileUncheckedUpdateWithoutBackgroundImageCompetitionsInput>
  }

  export type FileUpdateManyWithoutCompetitionsNestedInput = {
    create?: XOR<FileCreateWithoutCompetitionsInput, FileUncheckedCreateWithoutCompetitionsInput> | FileCreateWithoutCompetitionsInput[] | FileUncheckedCreateWithoutCompetitionsInput[]
    connectOrCreate?: FileCreateOrConnectWithoutCompetitionsInput | FileCreateOrConnectWithoutCompetitionsInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutCompetitionsInput | FileUpsertWithWhereUniqueWithoutCompetitionsInput[]
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutCompetitionsInput | FileUpdateWithWhereUniqueWithoutCompetitionsInput[]
    updateMany?: FileUpdateManyWithWhereWithoutCompetitionsInput | FileUpdateManyWithWhereWithoutCompetitionsInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type CompetitionUpdatefileIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProgramUncheckedUpdateManyWithoutCompetitionNestedInput = {
    create?: XOR<ProgramCreateWithoutCompetitionInput, ProgramUncheckedCreateWithoutCompetitionInput> | ProgramCreateWithoutCompetitionInput[] | ProgramUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutCompetitionInput | ProgramCreateOrConnectWithoutCompetitionInput[]
    upsert?: ProgramUpsertWithWhereUniqueWithoutCompetitionInput | ProgramUpsertWithWhereUniqueWithoutCompetitionInput[]
    createMany?: ProgramCreateManyCompetitionInputEnvelope
    set?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    disconnect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    delete?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    update?: ProgramUpdateWithWhereUniqueWithoutCompetitionInput | ProgramUpdateWithWhereUniqueWithoutCompetitionInput[]
    updateMany?: ProgramUpdateManyWithWhereWithoutCompetitionInput | ProgramUpdateManyWithWhereWithoutCompetitionInput[]
    deleteMany?: ProgramScalarWhereInput | ProgramScalarWhereInput[]
  }

  export type ScoringCriteriaUncheckedUpdateManyWithoutCompetitionNestedInput = {
    create?: XOR<ScoringCriteriaCreateWithoutCompetitionInput, ScoringCriteriaUncheckedCreateWithoutCompetitionInput> | ScoringCriteriaCreateWithoutCompetitionInput[] | ScoringCriteriaUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: ScoringCriteriaCreateOrConnectWithoutCompetitionInput | ScoringCriteriaCreateOrConnectWithoutCompetitionInput[]
    upsert?: ScoringCriteriaUpsertWithWhereUniqueWithoutCompetitionInput | ScoringCriteriaUpsertWithWhereUniqueWithoutCompetitionInput[]
    createMany?: ScoringCriteriaCreateManyCompetitionInputEnvelope
    set?: ScoringCriteriaWhereUniqueInput | ScoringCriteriaWhereUniqueInput[]
    disconnect?: ScoringCriteriaWhereUniqueInput | ScoringCriteriaWhereUniqueInput[]
    delete?: ScoringCriteriaWhereUniqueInput | ScoringCriteriaWhereUniqueInput[]
    connect?: ScoringCriteriaWhereUniqueInput | ScoringCriteriaWhereUniqueInput[]
    update?: ScoringCriteriaUpdateWithWhereUniqueWithoutCompetitionInput | ScoringCriteriaUpdateWithWhereUniqueWithoutCompetitionInput[]
    updateMany?: ScoringCriteriaUpdateManyWithWhereWithoutCompetitionInput | ScoringCriteriaUpdateManyWithWhereWithoutCompetitionInput[]
    deleteMany?: ScoringCriteriaScalarWhereInput | ScoringCriteriaScalarWhereInput[]
  }

  export type RankingUncheckedUpdateManyWithoutCompetitionNestedInput = {
    create?: XOR<RankingCreateWithoutCompetitionInput, RankingUncheckedCreateWithoutCompetitionInput> | RankingCreateWithoutCompetitionInput[] | RankingUncheckedCreateWithoutCompetitionInput[]
    connectOrCreate?: RankingCreateOrConnectWithoutCompetitionInput | RankingCreateOrConnectWithoutCompetitionInput[]
    upsert?: RankingUpsertWithWhereUniqueWithoutCompetitionInput | RankingUpsertWithWhereUniqueWithoutCompetitionInput[]
    createMany?: RankingCreateManyCompetitionInputEnvelope
    set?: RankingWhereUniqueInput | RankingWhereUniqueInput[]
    disconnect?: RankingWhereUniqueInput | RankingWhereUniqueInput[]
    delete?: RankingWhereUniqueInput | RankingWhereUniqueInput[]
    connect?: RankingWhereUniqueInput | RankingWhereUniqueInput[]
    update?: RankingUpdateWithWhereUniqueWithoutCompetitionInput | RankingUpdateWithWhereUniqueWithoutCompetitionInput[]
    updateMany?: RankingUpdateManyWithWhereWithoutCompetitionInput | RankingUpdateManyWithWhereWithoutCompetitionInput[]
    deleteMany?: RankingScalarWhereInput | RankingScalarWhereInput[]
  }

  export type FileUncheckedUpdateManyWithoutCompetitionsNestedInput = {
    create?: XOR<FileCreateWithoutCompetitionsInput, FileUncheckedCreateWithoutCompetitionsInput> | FileCreateWithoutCompetitionsInput[] | FileUncheckedCreateWithoutCompetitionsInput[]
    connectOrCreate?: FileCreateOrConnectWithoutCompetitionsInput | FileCreateOrConnectWithoutCompetitionsInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutCompetitionsInput | FileUpsertWithWhereUniqueWithoutCompetitionsInput[]
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutCompetitionsInput | FileUpdateWithWhereUniqueWithoutCompetitionsInput[]
    updateMany?: FileUpdateManyWithWhereWithoutCompetitionsInput | FileUpdateManyWithWhereWithoutCompetitionsInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type CompetitionCreateNestedOneWithoutScoringCriteriaInput = {
    create?: XOR<CompetitionCreateWithoutScoringCriteriaInput, CompetitionUncheckedCreateWithoutScoringCriteriaInput>
    connectOrCreate?: CompetitionCreateOrConnectWithoutScoringCriteriaInput
    connect?: CompetitionWhereUniqueInput
  }

  export type ScoreCreateNestedManyWithoutScoringCriteriaInput = {
    create?: XOR<ScoreCreateWithoutScoringCriteriaInput, ScoreUncheckedCreateWithoutScoringCriteriaInput> | ScoreCreateWithoutScoringCriteriaInput[] | ScoreUncheckedCreateWithoutScoringCriteriaInput[]
    connectOrCreate?: ScoreCreateOrConnectWithoutScoringCriteriaInput | ScoreCreateOrConnectWithoutScoringCriteriaInput[]
    createMany?: ScoreCreateManyScoringCriteriaInputEnvelope
    connect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
  }

  export type ScoreUncheckedCreateNestedManyWithoutScoringCriteriaInput = {
    create?: XOR<ScoreCreateWithoutScoringCriteriaInput, ScoreUncheckedCreateWithoutScoringCriteriaInput> | ScoreCreateWithoutScoringCriteriaInput[] | ScoreUncheckedCreateWithoutScoringCriteriaInput[]
    connectOrCreate?: ScoreCreateOrConnectWithoutScoringCriteriaInput | ScoreCreateOrConnectWithoutScoringCriteriaInput[]
    createMany?: ScoreCreateManyScoringCriteriaInputEnvelope
    connect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CompetitionUpdateOneRequiredWithoutScoringCriteriaNestedInput = {
    create?: XOR<CompetitionCreateWithoutScoringCriteriaInput, CompetitionUncheckedCreateWithoutScoringCriteriaInput>
    connectOrCreate?: CompetitionCreateOrConnectWithoutScoringCriteriaInput
    upsert?: CompetitionUpsertWithoutScoringCriteriaInput
    connect?: CompetitionWhereUniqueInput
    update?: XOR<XOR<CompetitionUpdateToOneWithWhereWithoutScoringCriteriaInput, CompetitionUpdateWithoutScoringCriteriaInput>, CompetitionUncheckedUpdateWithoutScoringCriteriaInput>
  }

  export type ScoreUpdateManyWithoutScoringCriteriaNestedInput = {
    create?: XOR<ScoreCreateWithoutScoringCriteriaInput, ScoreUncheckedCreateWithoutScoringCriteriaInput> | ScoreCreateWithoutScoringCriteriaInput[] | ScoreUncheckedCreateWithoutScoringCriteriaInput[]
    connectOrCreate?: ScoreCreateOrConnectWithoutScoringCriteriaInput | ScoreCreateOrConnectWithoutScoringCriteriaInput[]
    upsert?: ScoreUpsertWithWhereUniqueWithoutScoringCriteriaInput | ScoreUpsertWithWhereUniqueWithoutScoringCriteriaInput[]
    createMany?: ScoreCreateManyScoringCriteriaInputEnvelope
    set?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    disconnect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    delete?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    connect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    update?: ScoreUpdateWithWhereUniqueWithoutScoringCriteriaInput | ScoreUpdateWithWhereUniqueWithoutScoringCriteriaInput[]
    updateMany?: ScoreUpdateManyWithWhereWithoutScoringCriteriaInput | ScoreUpdateManyWithWhereWithoutScoringCriteriaInput[]
    deleteMany?: ScoreScalarWhereInput | ScoreScalarWhereInput[]
  }

  export type ScoreUncheckedUpdateManyWithoutScoringCriteriaNestedInput = {
    create?: XOR<ScoreCreateWithoutScoringCriteriaInput, ScoreUncheckedCreateWithoutScoringCriteriaInput> | ScoreCreateWithoutScoringCriteriaInput[] | ScoreUncheckedCreateWithoutScoringCriteriaInput[]
    connectOrCreate?: ScoreCreateOrConnectWithoutScoringCriteriaInput | ScoreCreateOrConnectWithoutScoringCriteriaInput[]
    upsert?: ScoreUpsertWithWhereUniqueWithoutScoringCriteriaInput | ScoreUpsertWithWhereUniqueWithoutScoringCriteriaInput[]
    createMany?: ScoreCreateManyScoringCriteriaInputEnvelope
    set?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    disconnect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    delete?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    connect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    update?: ScoreUpdateWithWhereUniqueWithoutScoringCriteriaInput | ScoreUpdateWithWhereUniqueWithoutScoringCriteriaInput[]
    updateMany?: ScoreUpdateManyWithWhereWithoutScoringCriteriaInput | ScoreUpdateManyWithWhereWithoutScoringCriteriaInput[]
    deleteMany?: ScoreScalarWhereInput | ScoreScalarWhereInput[]
  }

  export type ProgramCreateNestedManyWithoutParticipantsInput = {
    create?: XOR<ProgramCreateWithoutParticipantsInput, ProgramUncheckedCreateWithoutParticipantsInput> | ProgramCreateWithoutParticipantsInput[] | ProgramUncheckedCreateWithoutParticipantsInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutParticipantsInput | ProgramCreateOrConnectWithoutParticipantsInput[]
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
  }

  export type ParticipantCreateprogramIdsInput = {
    set: string[]
  }

  export type ProgramUncheckedCreateNestedManyWithoutParticipantsInput = {
    create?: XOR<ProgramCreateWithoutParticipantsInput, ProgramUncheckedCreateWithoutParticipantsInput> | ProgramCreateWithoutParticipantsInput[] | ProgramUncheckedCreateWithoutParticipantsInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutParticipantsInput | ProgramCreateOrConnectWithoutParticipantsInput[]
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
  }

  export type ProgramUpdateManyWithoutParticipantsNestedInput = {
    create?: XOR<ProgramCreateWithoutParticipantsInput, ProgramUncheckedCreateWithoutParticipantsInput> | ProgramCreateWithoutParticipantsInput[] | ProgramUncheckedCreateWithoutParticipantsInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutParticipantsInput | ProgramCreateOrConnectWithoutParticipantsInput[]
    upsert?: ProgramUpsertWithWhereUniqueWithoutParticipantsInput | ProgramUpsertWithWhereUniqueWithoutParticipantsInput[]
    set?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    disconnect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    delete?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    update?: ProgramUpdateWithWhereUniqueWithoutParticipantsInput | ProgramUpdateWithWhereUniqueWithoutParticipantsInput[]
    updateMany?: ProgramUpdateManyWithWhereWithoutParticipantsInput | ProgramUpdateManyWithWhereWithoutParticipantsInput[]
    deleteMany?: ProgramScalarWhereInput | ProgramScalarWhereInput[]
  }

  export type ParticipantUpdateprogramIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProgramUncheckedUpdateManyWithoutParticipantsNestedInput = {
    create?: XOR<ProgramCreateWithoutParticipantsInput, ProgramUncheckedCreateWithoutParticipantsInput> | ProgramCreateWithoutParticipantsInput[] | ProgramUncheckedCreateWithoutParticipantsInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutParticipantsInput | ProgramCreateOrConnectWithoutParticipantsInput[]
    upsert?: ProgramUpsertWithWhereUniqueWithoutParticipantsInput | ProgramUpsertWithWhereUniqueWithoutParticipantsInput[]
    set?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    disconnect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    delete?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    update?: ProgramUpdateWithWhereUniqueWithoutParticipantsInput | ProgramUpdateWithWhereUniqueWithoutParticipantsInput[]
    updateMany?: ProgramUpdateManyWithWhereWithoutParticipantsInput | ProgramUpdateManyWithWhereWithoutParticipantsInput[]
    deleteMany?: ProgramScalarWhereInput | ProgramScalarWhereInput[]
  }

  export type CompetitionCreateNestedOneWithoutProgramsInput = {
    create?: XOR<CompetitionCreateWithoutProgramsInput, CompetitionUncheckedCreateWithoutProgramsInput>
    connectOrCreate?: CompetitionCreateOrConnectWithoutProgramsInput
    connect?: CompetitionWhereUniqueInput
  }

  export type ParticipantCreateNestedManyWithoutProgramsInput = {
    create?: XOR<ParticipantCreateWithoutProgramsInput, ParticipantUncheckedCreateWithoutProgramsInput> | ParticipantCreateWithoutProgramsInput[] | ParticipantUncheckedCreateWithoutProgramsInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutProgramsInput | ParticipantCreateOrConnectWithoutProgramsInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type FileCreateNestedManyWithoutProgramsInput = {
    create?: XOR<FileCreateWithoutProgramsInput, FileUncheckedCreateWithoutProgramsInput> | FileCreateWithoutProgramsInput[] | FileUncheckedCreateWithoutProgramsInput[]
    connectOrCreate?: FileCreateOrConnectWithoutProgramsInput | FileCreateOrConnectWithoutProgramsInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type ScoreCreateNestedManyWithoutProgramInput = {
    create?: XOR<ScoreCreateWithoutProgramInput, ScoreUncheckedCreateWithoutProgramInput> | ScoreCreateWithoutProgramInput[] | ScoreUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: ScoreCreateOrConnectWithoutProgramInput | ScoreCreateOrConnectWithoutProgramInput[]
    createMany?: ScoreCreateManyProgramInputEnvelope
    connect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
  }

  export type RankingCreateNestedOneWithoutProgramInput = {
    create?: XOR<RankingCreateWithoutProgramInput, RankingUncheckedCreateWithoutProgramInput>
    connectOrCreate?: RankingCreateOrConnectWithoutProgramInput
    connect?: RankingWhereUniqueInput
  }

  export type ProgramCreateparticipantIdsInput = {
    set: string[]
  }

  export type ProgramCreatefileIdsInput = {
    set: string[]
  }

  export type ParticipantUncheckedCreateNestedManyWithoutProgramsInput = {
    create?: XOR<ParticipantCreateWithoutProgramsInput, ParticipantUncheckedCreateWithoutProgramsInput> | ParticipantCreateWithoutProgramsInput[] | ParticipantUncheckedCreateWithoutProgramsInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutProgramsInput | ParticipantCreateOrConnectWithoutProgramsInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type FileUncheckedCreateNestedManyWithoutProgramsInput = {
    create?: XOR<FileCreateWithoutProgramsInput, FileUncheckedCreateWithoutProgramsInput> | FileCreateWithoutProgramsInput[] | FileUncheckedCreateWithoutProgramsInput[]
    connectOrCreate?: FileCreateOrConnectWithoutProgramsInput | FileCreateOrConnectWithoutProgramsInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type ScoreUncheckedCreateNestedManyWithoutProgramInput = {
    create?: XOR<ScoreCreateWithoutProgramInput, ScoreUncheckedCreateWithoutProgramInput> | ScoreCreateWithoutProgramInput[] | ScoreUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: ScoreCreateOrConnectWithoutProgramInput | ScoreCreateOrConnectWithoutProgramInput[]
    createMany?: ScoreCreateManyProgramInputEnvelope
    connect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
  }

  export type RankingUncheckedCreateNestedOneWithoutProgramInput = {
    create?: XOR<RankingCreateWithoutProgramInput, RankingUncheckedCreateWithoutProgramInput>
    connectOrCreate?: RankingCreateOrConnectWithoutProgramInput
    connect?: RankingWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumProgramStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProgramStatus
  }

  export type CompetitionUpdateOneRequiredWithoutProgramsNestedInput = {
    create?: XOR<CompetitionCreateWithoutProgramsInput, CompetitionUncheckedCreateWithoutProgramsInput>
    connectOrCreate?: CompetitionCreateOrConnectWithoutProgramsInput
    upsert?: CompetitionUpsertWithoutProgramsInput
    connect?: CompetitionWhereUniqueInput
    update?: XOR<XOR<CompetitionUpdateToOneWithWhereWithoutProgramsInput, CompetitionUpdateWithoutProgramsInput>, CompetitionUncheckedUpdateWithoutProgramsInput>
  }

  export type ParticipantUpdateManyWithoutProgramsNestedInput = {
    create?: XOR<ParticipantCreateWithoutProgramsInput, ParticipantUncheckedCreateWithoutProgramsInput> | ParticipantCreateWithoutProgramsInput[] | ParticipantUncheckedCreateWithoutProgramsInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutProgramsInput | ParticipantCreateOrConnectWithoutProgramsInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutProgramsInput | ParticipantUpsertWithWhereUniqueWithoutProgramsInput[]
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutProgramsInput | ParticipantUpdateWithWhereUniqueWithoutProgramsInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutProgramsInput | ParticipantUpdateManyWithWhereWithoutProgramsInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type FileUpdateManyWithoutProgramsNestedInput = {
    create?: XOR<FileCreateWithoutProgramsInput, FileUncheckedCreateWithoutProgramsInput> | FileCreateWithoutProgramsInput[] | FileUncheckedCreateWithoutProgramsInput[]
    connectOrCreate?: FileCreateOrConnectWithoutProgramsInput | FileCreateOrConnectWithoutProgramsInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutProgramsInput | FileUpsertWithWhereUniqueWithoutProgramsInput[]
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutProgramsInput | FileUpdateWithWhereUniqueWithoutProgramsInput[]
    updateMany?: FileUpdateManyWithWhereWithoutProgramsInput | FileUpdateManyWithWhereWithoutProgramsInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type ScoreUpdateManyWithoutProgramNestedInput = {
    create?: XOR<ScoreCreateWithoutProgramInput, ScoreUncheckedCreateWithoutProgramInput> | ScoreCreateWithoutProgramInput[] | ScoreUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: ScoreCreateOrConnectWithoutProgramInput | ScoreCreateOrConnectWithoutProgramInput[]
    upsert?: ScoreUpsertWithWhereUniqueWithoutProgramInput | ScoreUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: ScoreCreateManyProgramInputEnvelope
    set?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    disconnect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    delete?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    connect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    update?: ScoreUpdateWithWhereUniqueWithoutProgramInput | ScoreUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: ScoreUpdateManyWithWhereWithoutProgramInput | ScoreUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: ScoreScalarWhereInput | ScoreScalarWhereInput[]
  }

  export type RankingUpdateOneWithoutProgramNestedInput = {
    create?: XOR<RankingCreateWithoutProgramInput, RankingUncheckedCreateWithoutProgramInput>
    connectOrCreate?: RankingCreateOrConnectWithoutProgramInput
    upsert?: RankingUpsertWithoutProgramInput
    disconnect?: RankingWhereInput | boolean
    delete?: RankingWhereInput | boolean
    connect?: RankingWhereUniqueInput
    update?: XOR<XOR<RankingUpdateToOneWithWhereWithoutProgramInput, RankingUpdateWithoutProgramInput>, RankingUncheckedUpdateWithoutProgramInput>
  }

  export type ProgramUpdateparticipantIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProgramUpdatefileIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ParticipantUncheckedUpdateManyWithoutProgramsNestedInput = {
    create?: XOR<ParticipantCreateWithoutProgramsInput, ParticipantUncheckedCreateWithoutProgramsInput> | ParticipantCreateWithoutProgramsInput[] | ParticipantUncheckedCreateWithoutProgramsInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutProgramsInput | ParticipantCreateOrConnectWithoutProgramsInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutProgramsInput | ParticipantUpsertWithWhereUniqueWithoutProgramsInput[]
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutProgramsInput | ParticipantUpdateWithWhereUniqueWithoutProgramsInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutProgramsInput | ParticipantUpdateManyWithWhereWithoutProgramsInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type FileUncheckedUpdateManyWithoutProgramsNestedInput = {
    create?: XOR<FileCreateWithoutProgramsInput, FileUncheckedCreateWithoutProgramsInput> | FileCreateWithoutProgramsInput[] | FileUncheckedCreateWithoutProgramsInput[]
    connectOrCreate?: FileCreateOrConnectWithoutProgramsInput | FileCreateOrConnectWithoutProgramsInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutProgramsInput | FileUpsertWithWhereUniqueWithoutProgramsInput[]
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutProgramsInput | FileUpdateWithWhereUniqueWithoutProgramsInput[]
    updateMany?: FileUpdateManyWithWhereWithoutProgramsInput | FileUpdateManyWithWhereWithoutProgramsInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type ScoreUncheckedUpdateManyWithoutProgramNestedInput = {
    create?: XOR<ScoreCreateWithoutProgramInput, ScoreUncheckedCreateWithoutProgramInput> | ScoreCreateWithoutProgramInput[] | ScoreUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: ScoreCreateOrConnectWithoutProgramInput | ScoreCreateOrConnectWithoutProgramInput[]
    upsert?: ScoreUpsertWithWhereUniqueWithoutProgramInput | ScoreUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: ScoreCreateManyProgramInputEnvelope
    set?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    disconnect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    delete?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    connect?: ScoreWhereUniqueInput | ScoreWhereUniqueInput[]
    update?: ScoreUpdateWithWhereUniqueWithoutProgramInput | ScoreUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: ScoreUpdateManyWithWhereWithoutProgramInput | ScoreUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: ScoreScalarWhereInput | ScoreScalarWhereInput[]
  }

  export type RankingUncheckedUpdateOneWithoutProgramNestedInput = {
    create?: XOR<RankingCreateWithoutProgramInput, RankingUncheckedCreateWithoutProgramInput>
    connectOrCreate?: RankingCreateOrConnectWithoutProgramInput
    upsert?: RankingUpsertWithoutProgramInput
    disconnect?: RankingWhereInput | boolean
    delete?: RankingWhereInput | boolean
    connect?: RankingWhereUniqueInput
    update?: XOR<XOR<RankingUpdateToOneWithWhereWithoutProgramInput, RankingUpdateWithoutProgramInput>, RankingUncheckedUpdateWithoutProgramInput>
  }

  export type ProgramCreateNestedOneWithoutScoresInput = {
    create?: XOR<ProgramCreateWithoutScoresInput, ProgramUncheckedCreateWithoutScoresInput>
    connectOrCreate?: ProgramCreateOrConnectWithoutScoresInput
    connect?: ProgramWhereUniqueInput
  }

  export type ScoringCriteriaCreateNestedOneWithoutScoresInput = {
    create?: XOR<ScoringCriteriaCreateWithoutScoresInput, ScoringCriteriaUncheckedCreateWithoutScoresInput>
    connectOrCreate?: ScoringCriteriaCreateOrConnectWithoutScoresInput
    connect?: ScoringCriteriaWhereUniqueInput
  }

  export type ProgramUpdateOneRequiredWithoutScoresNestedInput = {
    create?: XOR<ProgramCreateWithoutScoresInput, ProgramUncheckedCreateWithoutScoresInput>
    connectOrCreate?: ProgramCreateOrConnectWithoutScoresInput
    upsert?: ProgramUpsertWithoutScoresInput
    connect?: ProgramWhereUniqueInput
    update?: XOR<XOR<ProgramUpdateToOneWithWhereWithoutScoresInput, ProgramUpdateWithoutScoresInput>, ProgramUncheckedUpdateWithoutScoresInput>
  }

  export type ScoringCriteriaUpdateOneRequiredWithoutScoresNestedInput = {
    create?: XOR<ScoringCriteriaCreateWithoutScoresInput, ScoringCriteriaUncheckedCreateWithoutScoresInput>
    connectOrCreate?: ScoringCriteriaCreateOrConnectWithoutScoresInput
    upsert?: ScoringCriteriaUpsertWithoutScoresInput
    connect?: ScoringCriteriaWhereUniqueInput
    update?: XOR<XOR<ScoringCriteriaUpdateToOneWithWhereWithoutScoresInput, ScoringCriteriaUpdateWithoutScoresInput>, ScoringCriteriaUncheckedUpdateWithoutScoresInput>
  }

  export type CompetitionCreateNestedOneWithoutRankingsInput = {
    create?: XOR<CompetitionCreateWithoutRankingsInput, CompetitionUncheckedCreateWithoutRankingsInput>
    connectOrCreate?: CompetitionCreateOrConnectWithoutRankingsInput
    connect?: CompetitionWhereUniqueInput
  }

  export type ProgramCreateNestedOneWithoutRankingInput = {
    create?: XOR<ProgramCreateWithoutRankingInput, ProgramUncheckedCreateWithoutRankingInput>
    connectOrCreate?: ProgramCreateOrConnectWithoutRankingInput
    connect?: ProgramWhereUniqueInput
  }

  export type EnumUpdateTypeFieldUpdateOperationsInput = {
    set?: $Enums.UpdateType
  }

  export type CompetitionUpdateOneRequiredWithoutRankingsNestedInput = {
    create?: XOR<CompetitionCreateWithoutRankingsInput, CompetitionUncheckedCreateWithoutRankingsInput>
    connectOrCreate?: CompetitionCreateOrConnectWithoutRankingsInput
    upsert?: CompetitionUpsertWithoutRankingsInput
    connect?: CompetitionWhereUniqueInput
    update?: XOR<XOR<CompetitionUpdateToOneWithWhereWithoutRankingsInput, CompetitionUpdateWithoutRankingsInput>, CompetitionUncheckedUpdateWithoutRankingsInput>
  }

  export type ProgramUpdateOneRequiredWithoutRankingNestedInput = {
    create?: XOR<ProgramCreateWithoutRankingInput, ProgramUncheckedCreateWithoutRankingInput>
    connectOrCreate?: ProgramCreateOrConnectWithoutRankingInput
    upsert?: ProgramUpsertWithoutRankingInput
    connect?: ProgramWhereUniqueInput
    update?: XOR<XOR<ProgramUpdateToOneWithWhereWithoutRankingInput, ProgramUpdateWithoutRankingInput>, ProgramUncheckedUpdateWithoutRankingInput>
  }

  export type ProgramCreateNestedManyWithoutAttachmentsInput = {
    create?: XOR<ProgramCreateWithoutAttachmentsInput, ProgramUncheckedCreateWithoutAttachmentsInput> | ProgramCreateWithoutAttachmentsInput[] | ProgramUncheckedCreateWithoutAttachmentsInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutAttachmentsInput | ProgramCreateOrConnectWithoutAttachmentsInput[]
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
  }

  export type CompetitionCreateNestedManyWithoutFilesInput = {
    create?: XOR<CompetitionCreateWithoutFilesInput, CompetitionUncheckedCreateWithoutFilesInput> | CompetitionCreateWithoutFilesInput[] | CompetitionUncheckedCreateWithoutFilesInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutFilesInput | CompetitionCreateOrConnectWithoutFilesInput[]
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
  }

  export type CompetitionCreateNestedManyWithoutBackgroundImageInput = {
    create?: XOR<CompetitionCreateWithoutBackgroundImageInput, CompetitionUncheckedCreateWithoutBackgroundImageInput> | CompetitionCreateWithoutBackgroundImageInput[] | CompetitionUncheckedCreateWithoutBackgroundImageInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutBackgroundImageInput | CompetitionCreateOrConnectWithoutBackgroundImageInput[]
    createMany?: CompetitionCreateManyBackgroundImageInputEnvelope
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
  }

  export type FileCreateprogramIdsInput = {
    set: string[]
  }

  export type FileCreatecompetitionIdsInput = {
    set: string[]
  }

  export type ProgramUncheckedCreateNestedManyWithoutAttachmentsInput = {
    create?: XOR<ProgramCreateWithoutAttachmentsInput, ProgramUncheckedCreateWithoutAttachmentsInput> | ProgramCreateWithoutAttachmentsInput[] | ProgramUncheckedCreateWithoutAttachmentsInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutAttachmentsInput | ProgramCreateOrConnectWithoutAttachmentsInput[]
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
  }

  export type CompetitionUncheckedCreateNestedManyWithoutFilesInput = {
    create?: XOR<CompetitionCreateWithoutFilesInput, CompetitionUncheckedCreateWithoutFilesInput> | CompetitionCreateWithoutFilesInput[] | CompetitionUncheckedCreateWithoutFilesInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutFilesInput | CompetitionCreateOrConnectWithoutFilesInput[]
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
  }

  export type CompetitionUncheckedCreateNestedManyWithoutBackgroundImageInput = {
    create?: XOR<CompetitionCreateWithoutBackgroundImageInput, CompetitionUncheckedCreateWithoutBackgroundImageInput> | CompetitionCreateWithoutBackgroundImageInput[] | CompetitionUncheckedCreateWithoutBackgroundImageInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutBackgroundImageInput | CompetitionCreateOrConnectWithoutBackgroundImageInput[]
    createMany?: CompetitionCreateManyBackgroundImageInputEnvelope
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
  }

  export type ProgramUpdateManyWithoutAttachmentsNestedInput = {
    create?: XOR<ProgramCreateWithoutAttachmentsInput, ProgramUncheckedCreateWithoutAttachmentsInput> | ProgramCreateWithoutAttachmentsInput[] | ProgramUncheckedCreateWithoutAttachmentsInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutAttachmentsInput | ProgramCreateOrConnectWithoutAttachmentsInput[]
    upsert?: ProgramUpsertWithWhereUniqueWithoutAttachmentsInput | ProgramUpsertWithWhereUniqueWithoutAttachmentsInput[]
    set?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    disconnect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    delete?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    update?: ProgramUpdateWithWhereUniqueWithoutAttachmentsInput | ProgramUpdateWithWhereUniqueWithoutAttachmentsInput[]
    updateMany?: ProgramUpdateManyWithWhereWithoutAttachmentsInput | ProgramUpdateManyWithWhereWithoutAttachmentsInput[]
    deleteMany?: ProgramScalarWhereInput | ProgramScalarWhereInput[]
  }

  export type CompetitionUpdateManyWithoutFilesNestedInput = {
    create?: XOR<CompetitionCreateWithoutFilesInput, CompetitionUncheckedCreateWithoutFilesInput> | CompetitionCreateWithoutFilesInput[] | CompetitionUncheckedCreateWithoutFilesInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutFilesInput | CompetitionCreateOrConnectWithoutFilesInput[]
    upsert?: CompetitionUpsertWithWhereUniqueWithoutFilesInput | CompetitionUpsertWithWhereUniqueWithoutFilesInput[]
    set?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    disconnect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    delete?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    update?: CompetitionUpdateWithWhereUniqueWithoutFilesInput | CompetitionUpdateWithWhereUniqueWithoutFilesInput[]
    updateMany?: CompetitionUpdateManyWithWhereWithoutFilesInput | CompetitionUpdateManyWithWhereWithoutFilesInput[]
    deleteMany?: CompetitionScalarWhereInput | CompetitionScalarWhereInput[]
  }

  export type CompetitionUpdateManyWithoutBackgroundImageNestedInput = {
    create?: XOR<CompetitionCreateWithoutBackgroundImageInput, CompetitionUncheckedCreateWithoutBackgroundImageInput> | CompetitionCreateWithoutBackgroundImageInput[] | CompetitionUncheckedCreateWithoutBackgroundImageInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutBackgroundImageInput | CompetitionCreateOrConnectWithoutBackgroundImageInput[]
    upsert?: CompetitionUpsertWithWhereUniqueWithoutBackgroundImageInput | CompetitionUpsertWithWhereUniqueWithoutBackgroundImageInput[]
    createMany?: CompetitionCreateManyBackgroundImageInputEnvelope
    set?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    disconnect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    delete?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    update?: CompetitionUpdateWithWhereUniqueWithoutBackgroundImageInput | CompetitionUpdateWithWhereUniqueWithoutBackgroundImageInput[]
    updateMany?: CompetitionUpdateManyWithWhereWithoutBackgroundImageInput | CompetitionUpdateManyWithWhereWithoutBackgroundImageInput[]
    deleteMany?: CompetitionScalarWhereInput | CompetitionScalarWhereInput[]
  }

  export type FileUpdateprogramIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type FileUpdatecompetitionIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProgramUncheckedUpdateManyWithoutAttachmentsNestedInput = {
    create?: XOR<ProgramCreateWithoutAttachmentsInput, ProgramUncheckedCreateWithoutAttachmentsInput> | ProgramCreateWithoutAttachmentsInput[] | ProgramUncheckedCreateWithoutAttachmentsInput[]
    connectOrCreate?: ProgramCreateOrConnectWithoutAttachmentsInput | ProgramCreateOrConnectWithoutAttachmentsInput[]
    upsert?: ProgramUpsertWithWhereUniqueWithoutAttachmentsInput | ProgramUpsertWithWhereUniqueWithoutAttachmentsInput[]
    set?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    disconnect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    delete?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    connect?: ProgramWhereUniqueInput | ProgramWhereUniqueInput[]
    update?: ProgramUpdateWithWhereUniqueWithoutAttachmentsInput | ProgramUpdateWithWhereUniqueWithoutAttachmentsInput[]
    updateMany?: ProgramUpdateManyWithWhereWithoutAttachmentsInput | ProgramUpdateManyWithWhereWithoutAttachmentsInput[]
    deleteMany?: ProgramScalarWhereInput | ProgramScalarWhereInput[]
  }

  export type CompetitionUncheckedUpdateManyWithoutFilesNestedInput = {
    create?: XOR<CompetitionCreateWithoutFilesInput, CompetitionUncheckedCreateWithoutFilesInput> | CompetitionCreateWithoutFilesInput[] | CompetitionUncheckedCreateWithoutFilesInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutFilesInput | CompetitionCreateOrConnectWithoutFilesInput[]
    upsert?: CompetitionUpsertWithWhereUniqueWithoutFilesInput | CompetitionUpsertWithWhereUniqueWithoutFilesInput[]
    set?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    disconnect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    delete?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    update?: CompetitionUpdateWithWhereUniqueWithoutFilesInput | CompetitionUpdateWithWhereUniqueWithoutFilesInput[]
    updateMany?: CompetitionUpdateManyWithWhereWithoutFilesInput | CompetitionUpdateManyWithWhereWithoutFilesInput[]
    deleteMany?: CompetitionScalarWhereInput | CompetitionScalarWhereInput[]
  }

  export type CompetitionUncheckedUpdateManyWithoutBackgroundImageNestedInput = {
    create?: XOR<CompetitionCreateWithoutBackgroundImageInput, CompetitionUncheckedCreateWithoutBackgroundImageInput> | CompetitionCreateWithoutBackgroundImageInput[] | CompetitionUncheckedCreateWithoutBackgroundImageInput[]
    connectOrCreate?: CompetitionCreateOrConnectWithoutBackgroundImageInput | CompetitionCreateOrConnectWithoutBackgroundImageInput[]
    upsert?: CompetitionUpsertWithWhereUniqueWithoutBackgroundImageInput | CompetitionUpsertWithWhereUniqueWithoutBackgroundImageInput[]
    createMany?: CompetitionCreateManyBackgroundImageInputEnvelope
    set?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    disconnect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    delete?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    connect?: CompetitionWhereUniqueInput | CompetitionWhereUniqueInput[]
    update?: CompetitionUpdateWithWhereUniqueWithoutBackgroundImageInput | CompetitionUpdateWithWhereUniqueWithoutBackgroundImageInput[]
    updateMany?: CompetitionUpdateManyWithWhereWithoutBackgroundImageInput | CompetitionUpdateManyWithWhereWithoutBackgroundImageInput[]
    deleteMany?: CompetitionScalarWhereInput | CompetitionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type NestedEnumCompetitionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CompetitionStatus | EnumCompetitionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CompetitionStatus[] | ListEnumCompetitionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompetitionStatus[] | ListEnumCompetitionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCompetitionStatusFilter<$PrismaModel> | $Enums.CompetitionStatus
  }

  export type NestedEnumRankingUpdateModeFilter<$PrismaModel = never> = {
    equals?: $Enums.RankingUpdateMode | EnumRankingUpdateModeFieldRefInput<$PrismaModel>
    in?: $Enums.RankingUpdateMode[] | ListEnumRankingUpdateModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RankingUpdateMode[] | ListEnumRankingUpdateModeFieldRefInput<$PrismaModel>
    not?: NestedEnumRankingUpdateModeFilter<$PrismaModel> | $Enums.RankingUpdateMode
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedEnumCompetitionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompetitionStatus | EnumCompetitionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CompetitionStatus[] | ListEnumCompetitionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompetitionStatus[] | ListEnumCompetitionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCompetitionStatusWithAggregatesFilter<$PrismaModel> | $Enums.CompetitionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCompetitionStatusFilter<$PrismaModel>
    _max?: NestedEnumCompetitionStatusFilter<$PrismaModel>
  }

  export type NestedEnumRankingUpdateModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RankingUpdateMode | EnumRankingUpdateModeFieldRefInput<$PrismaModel>
    in?: $Enums.RankingUpdateMode[] | ListEnumRankingUpdateModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RankingUpdateMode[] | ListEnumRankingUpdateModeFieldRefInput<$PrismaModel>
    not?: NestedEnumRankingUpdateModeWithAggregatesFilter<$PrismaModel> | $Enums.RankingUpdateMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRankingUpdateModeFilter<$PrismaModel>
    _max?: NestedEnumRankingUpdateModeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumProgramStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramStatus | EnumProgramStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramStatusFilter<$PrismaModel> | $Enums.ProgramStatus
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumProgramStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramStatus | EnumProgramStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProgramStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProgramStatusFilter<$PrismaModel>
    _max?: NestedEnumProgramStatusFilter<$PrismaModel>
  }

  export type NestedEnumUpdateTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.UpdateType | EnumUpdateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UpdateType[] | ListEnumUpdateTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UpdateType[] | ListEnumUpdateTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUpdateTypeFilter<$PrismaModel> | $Enums.UpdateType
  }

  export type NestedEnumUpdateTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UpdateType | EnumUpdateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UpdateType[] | ListEnumUpdateTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UpdateType[] | ListEnumUpdateTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUpdateTypeWithAggregatesFilter<$PrismaModel> | $Enums.UpdateType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUpdateTypeFilter<$PrismaModel>
    _max?: NestedEnumUpdateTypeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    isSet?: boolean
  }

  export type CompetitionCreateWithoutOrganizerInput = {
    id?: string
    name: string
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramCreateNestedManyWithoutCompetitionInput
    scoringCriteria?: ScoringCriteriaCreateNestedManyWithoutCompetitionInput
    rankings?: RankingCreateNestedManyWithoutCompetitionInput
    backgroundImage?: FileCreateNestedOneWithoutBackgroundImageCompetitionsInput
    files?: FileCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionUncheckedCreateWithoutOrganizerInput = {
    id?: string
    name: string
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    backgroundImageId?: string | null
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    fileIds?: CompetitionCreatefileIdsInput | string[]
    programs?: ProgramUncheckedCreateNestedManyWithoutCompetitionInput
    scoringCriteria?: ScoringCriteriaUncheckedCreateNestedManyWithoutCompetitionInput
    rankings?: RankingUncheckedCreateNestedManyWithoutCompetitionInput
    files?: FileUncheckedCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionCreateOrConnectWithoutOrganizerInput = {
    where: CompetitionWhereUniqueInput
    create: XOR<CompetitionCreateWithoutOrganizerInput, CompetitionUncheckedCreateWithoutOrganizerInput>
  }

  export type CompetitionCreateManyOrganizerInputEnvelope = {
    data: CompetitionCreateManyOrganizerInput | CompetitionCreateManyOrganizerInput[]
  }

  export type AuditLogCreateWithoutUserInput = {
    id?: string
    timestamp?: Date | string
    action: string
    targetId?: string | null
    details?: InputJsonValue | null
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    timestamp?: Date | string
    action: string
    targetId?: string | null
    details?: InputJsonValue | null
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
  }

  export type CompetitionUpsertWithWhereUniqueWithoutOrganizerInput = {
    where: CompetitionWhereUniqueInput
    update: XOR<CompetitionUpdateWithoutOrganizerInput, CompetitionUncheckedUpdateWithoutOrganizerInput>
    create: XOR<CompetitionCreateWithoutOrganizerInput, CompetitionUncheckedCreateWithoutOrganizerInput>
  }

  export type CompetitionUpdateWithWhereUniqueWithoutOrganizerInput = {
    where: CompetitionWhereUniqueInput
    data: XOR<CompetitionUpdateWithoutOrganizerInput, CompetitionUncheckedUpdateWithoutOrganizerInput>
  }

  export type CompetitionUpdateManyWithWhereWithoutOrganizerInput = {
    where: CompetitionScalarWhereInput
    data: XOR<CompetitionUpdateManyMutationInput, CompetitionUncheckedUpdateManyWithoutOrganizerInput>
  }

  export type CompetitionScalarWhereInput = {
    AND?: CompetitionScalarWhereInput | CompetitionScalarWhereInput[]
    OR?: CompetitionScalarWhereInput[]
    NOT?: CompetitionScalarWhereInput | CompetitionScalarWhereInput[]
    id?: StringFilter<"Competition"> | string
    name?: StringFilter<"Competition"> | string
    description?: StringNullableFilter<"Competition"> | string | null
    organizerId?: StringFilter<"Competition"> | string
    startTime?: DateTimeFilter<"Competition"> | Date | string
    endTime?: DateTimeFilter<"Competition"> | Date | string
    status?: EnumCompetitionStatusFilter<"Competition"> | $Enums.CompetitionStatus
    backgroundImageId?: StringNullableFilter<"Competition"> | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFilter<"Competition"> | $Enums.RankingUpdateMode
    createdAt?: DateTimeFilter<"Competition"> | Date | string
    updatedAt?: DateTimeFilter<"Competition"> | Date | string
    fileIds?: StringNullableListFilter<"Competition">
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    targetId?: StringNullableFilter<"AuditLog"> | string | null
    details?: JsonNullableFilter<"AuditLog">
  }

  export type UserCreateWithoutCompetitionsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCompetitionsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCompetitionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCompetitionsInput, UserUncheckedCreateWithoutCompetitionsInput>
  }

  export type ProgramCreateWithoutCompetitionInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantCreateNestedManyWithoutProgramsInput
    attachments?: FileCreateNestedManyWithoutProgramsInput
    scores?: ScoreCreateNestedManyWithoutProgramInput
    ranking?: RankingCreateNestedOneWithoutProgramInput
  }

  export type ProgramUncheckedCreateWithoutCompetitionInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    participantIds?: ProgramCreateparticipantIdsInput | string[]
    fileIds?: ProgramCreatefileIdsInput | string[]
    participants?: ParticipantUncheckedCreateNestedManyWithoutProgramsInput
    attachments?: FileUncheckedCreateNestedManyWithoutProgramsInput
    scores?: ScoreUncheckedCreateNestedManyWithoutProgramInput
    ranking?: RankingUncheckedCreateNestedOneWithoutProgramInput
  }

  export type ProgramCreateOrConnectWithoutCompetitionInput = {
    where: ProgramWhereUniqueInput
    create: XOR<ProgramCreateWithoutCompetitionInput, ProgramUncheckedCreateWithoutCompetitionInput>
  }

  export type ProgramCreateManyCompetitionInputEnvelope = {
    data: ProgramCreateManyCompetitionInput | ProgramCreateManyCompetitionInput[]
  }

  export type ScoringCriteriaCreateWithoutCompetitionInput = {
    id?: string
    name: string
    weight: number
    maxScore: number
    scores?: ScoreCreateNestedManyWithoutScoringCriteriaInput
  }

  export type ScoringCriteriaUncheckedCreateWithoutCompetitionInput = {
    id?: string
    name: string
    weight: number
    maxScore: number
    scores?: ScoreUncheckedCreateNestedManyWithoutScoringCriteriaInput
  }

  export type ScoringCriteriaCreateOrConnectWithoutCompetitionInput = {
    where: ScoringCriteriaWhereUniqueInput
    create: XOR<ScoringCriteriaCreateWithoutCompetitionInput, ScoringCriteriaUncheckedCreateWithoutCompetitionInput>
  }

  export type ScoringCriteriaCreateManyCompetitionInputEnvelope = {
    data: ScoringCriteriaCreateManyCompetitionInput | ScoringCriteriaCreateManyCompetitionInput[]
  }

  export type RankingCreateWithoutCompetitionInput = {
    id?: string
    rank: number
    totalScore: number
    updateType?: $Enums.UpdateType
    createdAt?: Date | string
    updatedAt?: Date | string
    program: ProgramCreateNestedOneWithoutRankingInput
  }

  export type RankingUncheckedCreateWithoutCompetitionInput = {
    id?: string
    rank: number
    totalScore: number
    updateType?: $Enums.UpdateType
    programId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RankingCreateOrConnectWithoutCompetitionInput = {
    where: RankingWhereUniqueInput
    create: XOR<RankingCreateWithoutCompetitionInput, RankingUncheckedCreateWithoutCompetitionInput>
  }

  export type RankingCreateManyCompetitionInputEnvelope = {
    data: RankingCreateManyCompetitionInput | RankingCreateManyCompetitionInput[]
  }

  export type FileCreateWithoutBackgroundImageCompetitionsInput = {
    id?: string
    filename: string
    path: string
    mimetype: string
    size: number
    createdAt?: Date | string
    programs?: ProgramCreateNestedManyWithoutAttachmentsInput
    competitions?: CompetitionCreateNestedManyWithoutFilesInput
  }

  export type FileUncheckedCreateWithoutBackgroundImageCompetitionsInput = {
    id?: string
    filename: string
    path: string
    mimetype: string
    size: number
    createdAt?: Date | string
    programIds?: FileCreateprogramIdsInput | string[]
    competitionIds?: FileCreatecompetitionIdsInput | string[]
    programs?: ProgramUncheckedCreateNestedManyWithoutAttachmentsInput
    competitions?: CompetitionUncheckedCreateNestedManyWithoutFilesInput
  }

  export type FileCreateOrConnectWithoutBackgroundImageCompetitionsInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutBackgroundImageCompetitionsInput, FileUncheckedCreateWithoutBackgroundImageCompetitionsInput>
  }

  export type FileCreateWithoutCompetitionsInput = {
    id?: string
    filename: string
    path: string
    mimetype: string
    size: number
    createdAt?: Date | string
    programs?: ProgramCreateNestedManyWithoutAttachmentsInput
    backgroundImageCompetitions?: CompetitionCreateNestedManyWithoutBackgroundImageInput
  }

  export type FileUncheckedCreateWithoutCompetitionsInput = {
    id?: string
    filename: string
    path: string
    mimetype: string
    size: number
    createdAt?: Date | string
    programIds?: FileCreateprogramIdsInput | string[]
    competitionIds?: FileCreatecompetitionIdsInput | string[]
    programs?: ProgramUncheckedCreateNestedManyWithoutAttachmentsInput
    backgroundImageCompetitions?: CompetitionUncheckedCreateNestedManyWithoutBackgroundImageInput
  }

  export type FileCreateOrConnectWithoutCompetitionsInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutCompetitionsInput, FileUncheckedCreateWithoutCompetitionsInput>
  }

  export type UserUpsertWithoutCompetitionsInput = {
    update: XOR<UserUpdateWithoutCompetitionsInput, UserUncheckedUpdateWithoutCompetitionsInput>
    create: XOR<UserCreateWithoutCompetitionsInput, UserUncheckedCreateWithoutCompetitionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCompetitionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCompetitionsInput, UserUncheckedUpdateWithoutCompetitionsInput>
  }

  export type UserUpdateWithoutCompetitionsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCompetitionsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProgramUpsertWithWhereUniqueWithoutCompetitionInput = {
    where: ProgramWhereUniqueInput
    update: XOR<ProgramUpdateWithoutCompetitionInput, ProgramUncheckedUpdateWithoutCompetitionInput>
    create: XOR<ProgramCreateWithoutCompetitionInput, ProgramUncheckedCreateWithoutCompetitionInput>
  }

  export type ProgramUpdateWithWhereUniqueWithoutCompetitionInput = {
    where: ProgramWhereUniqueInput
    data: XOR<ProgramUpdateWithoutCompetitionInput, ProgramUncheckedUpdateWithoutCompetitionInput>
  }

  export type ProgramUpdateManyWithWhereWithoutCompetitionInput = {
    where: ProgramScalarWhereInput
    data: XOR<ProgramUpdateManyMutationInput, ProgramUncheckedUpdateManyWithoutCompetitionInput>
  }

  export type ProgramScalarWhereInput = {
    AND?: ProgramScalarWhereInput | ProgramScalarWhereInput[]
    OR?: ProgramScalarWhereInput[]
    NOT?: ProgramScalarWhereInput | ProgramScalarWhereInput[]
    id?: StringFilter<"Program"> | string
    name?: StringFilter<"Program"> | string
    description?: StringNullableFilter<"Program"> | string | null
    order?: IntFilter<"Program"> | number
    currentStatus?: EnumProgramStatusFilter<"Program"> | $Enums.ProgramStatus
    competitionId?: StringFilter<"Program"> | string
    createdAt?: DateTimeFilter<"Program"> | Date | string
    updatedAt?: DateTimeFilter<"Program"> | Date | string
    participantIds?: StringNullableListFilter<"Program">
    fileIds?: StringNullableListFilter<"Program">
  }

  export type ScoringCriteriaUpsertWithWhereUniqueWithoutCompetitionInput = {
    where: ScoringCriteriaWhereUniqueInput
    update: XOR<ScoringCriteriaUpdateWithoutCompetitionInput, ScoringCriteriaUncheckedUpdateWithoutCompetitionInput>
    create: XOR<ScoringCriteriaCreateWithoutCompetitionInput, ScoringCriteriaUncheckedCreateWithoutCompetitionInput>
  }

  export type ScoringCriteriaUpdateWithWhereUniqueWithoutCompetitionInput = {
    where: ScoringCriteriaWhereUniqueInput
    data: XOR<ScoringCriteriaUpdateWithoutCompetitionInput, ScoringCriteriaUncheckedUpdateWithoutCompetitionInput>
  }

  export type ScoringCriteriaUpdateManyWithWhereWithoutCompetitionInput = {
    where: ScoringCriteriaScalarWhereInput
    data: XOR<ScoringCriteriaUpdateManyMutationInput, ScoringCriteriaUncheckedUpdateManyWithoutCompetitionInput>
  }

  export type ScoringCriteriaScalarWhereInput = {
    AND?: ScoringCriteriaScalarWhereInput | ScoringCriteriaScalarWhereInput[]
    OR?: ScoringCriteriaScalarWhereInput[]
    NOT?: ScoringCriteriaScalarWhereInput | ScoringCriteriaScalarWhereInput[]
    id?: StringFilter<"ScoringCriteria"> | string
    name?: StringFilter<"ScoringCriteria"> | string
    weight?: FloatFilter<"ScoringCriteria"> | number
    maxScore?: FloatFilter<"ScoringCriteria"> | number
    competitionId?: StringFilter<"ScoringCriteria"> | string
  }

  export type RankingUpsertWithWhereUniqueWithoutCompetitionInput = {
    where: RankingWhereUniqueInput
    update: XOR<RankingUpdateWithoutCompetitionInput, RankingUncheckedUpdateWithoutCompetitionInput>
    create: XOR<RankingCreateWithoutCompetitionInput, RankingUncheckedCreateWithoutCompetitionInput>
  }

  export type RankingUpdateWithWhereUniqueWithoutCompetitionInput = {
    where: RankingWhereUniqueInput
    data: XOR<RankingUpdateWithoutCompetitionInput, RankingUncheckedUpdateWithoutCompetitionInput>
  }

  export type RankingUpdateManyWithWhereWithoutCompetitionInput = {
    where: RankingScalarWhereInput
    data: XOR<RankingUpdateManyMutationInput, RankingUncheckedUpdateManyWithoutCompetitionInput>
  }

  export type RankingScalarWhereInput = {
    AND?: RankingScalarWhereInput | RankingScalarWhereInput[]
    OR?: RankingScalarWhereInput[]
    NOT?: RankingScalarWhereInput | RankingScalarWhereInput[]
    id?: StringFilter<"Ranking"> | string
    rank?: IntFilter<"Ranking"> | number
    totalScore?: FloatFilter<"Ranking"> | number
    updateType?: EnumUpdateTypeFilter<"Ranking"> | $Enums.UpdateType
    competitionId?: StringFilter<"Ranking"> | string
    programId?: StringFilter<"Ranking"> | string
    createdAt?: DateTimeFilter<"Ranking"> | Date | string
    updatedAt?: DateTimeFilter<"Ranking"> | Date | string
  }

  export type FileUpsertWithoutBackgroundImageCompetitionsInput = {
    update: XOR<FileUpdateWithoutBackgroundImageCompetitionsInput, FileUncheckedUpdateWithoutBackgroundImageCompetitionsInput>
    create: XOR<FileCreateWithoutBackgroundImageCompetitionsInput, FileUncheckedCreateWithoutBackgroundImageCompetitionsInput>
    where?: FileWhereInput
  }

  export type FileUpdateToOneWithWhereWithoutBackgroundImageCompetitionsInput = {
    where?: FileWhereInput
    data: XOR<FileUpdateWithoutBackgroundImageCompetitionsInput, FileUncheckedUpdateWithoutBackgroundImageCompetitionsInput>
  }

  export type FileUpdateWithoutBackgroundImageCompetitionsInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramUpdateManyWithoutAttachmentsNestedInput
    competitions?: CompetitionUpdateManyWithoutFilesNestedInput
  }

  export type FileUncheckedUpdateWithoutBackgroundImageCompetitionsInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programIds?: FileUpdateprogramIdsInput | string[]
    competitionIds?: FileUpdatecompetitionIdsInput | string[]
    programs?: ProgramUncheckedUpdateManyWithoutAttachmentsNestedInput
    competitions?: CompetitionUncheckedUpdateManyWithoutFilesNestedInput
  }

  export type FileUpsertWithWhereUniqueWithoutCompetitionsInput = {
    where: FileWhereUniqueInput
    update: XOR<FileUpdateWithoutCompetitionsInput, FileUncheckedUpdateWithoutCompetitionsInput>
    create: XOR<FileCreateWithoutCompetitionsInput, FileUncheckedCreateWithoutCompetitionsInput>
  }

  export type FileUpdateWithWhereUniqueWithoutCompetitionsInput = {
    where: FileWhereUniqueInput
    data: XOR<FileUpdateWithoutCompetitionsInput, FileUncheckedUpdateWithoutCompetitionsInput>
  }

  export type FileUpdateManyWithWhereWithoutCompetitionsInput = {
    where: FileScalarWhereInput
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyWithoutCompetitionsInput>
  }

  export type FileScalarWhereInput = {
    AND?: FileScalarWhereInput | FileScalarWhereInput[]
    OR?: FileScalarWhereInput[]
    NOT?: FileScalarWhereInput | FileScalarWhereInput[]
    id?: StringFilter<"File"> | string
    filename?: StringFilter<"File"> | string
    path?: StringFilter<"File"> | string
    mimetype?: StringFilter<"File"> | string
    size?: IntFilter<"File"> | number
    createdAt?: DateTimeFilter<"File"> | Date | string
    programIds?: StringNullableListFilter<"File">
    competitionIds?: StringNullableListFilter<"File">
  }

  export type CompetitionCreateWithoutScoringCriteriaInput = {
    id?: string
    name: string
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer: UserCreateNestedOneWithoutCompetitionsInput
    programs?: ProgramCreateNestedManyWithoutCompetitionInput
    rankings?: RankingCreateNestedManyWithoutCompetitionInput
    backgroundImage?: FileCreateNestedOneWithoutBackgroundImageCompetitionsInput
    files?: FileCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionUncheckedCreateWithoutScoringCriteriaInput = {
    id?: string
    name: string
    description?: string | null
    organizerId: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    backgroundImageId?: string | null
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    fileIds?: CompetitionCreatefileIdsInput | string[]
    programs?: ProgramUncheckedCreateNestedManyWithoutCompetitionInput
    rankings?: RankingUncheckedCreateNestedManyWithoutCompetitionInput
    files?: FileUncheckedCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionCreateOrConnectWithoutScoringCriteriaInput = {
    where: CompetitionWhereUniqueInput
    create: XOR<CompetitionCreateWithoutScoringCriteriaInput, CompetitionUncheckedCreateWithoutScoringCriteriaInput>
  }

  export type ScoreCreateWithoutScoringCriteriaInput = {
    id?: string
    value: number
    comment?: string | null
    judgeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    program: ProgramCreateNestedOneWithoutScoresInput
  }

  export type ScoreUncheckedCreateWithoutScoringCriteriaInput = {
    id?: string
    value: number
    comment?: string | null
    programId: string
    judgeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScoreCreateOrConnectWithoutScoringCriteriaInput = {
    where: ScoreWhereUniqueInput
    create: XOR<ScoreCreateWithoutScoringCriteriaInput, ScoreUncheckedCreateWithoutScoringCriteriaInput>
  }

  export type ScoreCreateManyScoringCriteriaInputEnvelope = {
    data: ScoreCreateManyScoringCriteriaInput | ScoreCreateManyScoringCriteriaInput[]
  }

  export type CompetitionUpsertWithoutScoringCriteriaInput = {
    update: XOR<CompetitionUpdateWithoutScoringCriteriaInput, CompetitionUncheckedUpdateWithoutScoringCriteriaInput>
    create: XOR<CompetitionCreateWithoutScoringCriteriaInput, CompetitionUncheckedCreateWithoutScoringCriteriaInput>
    where?: CompetitionWhereInput
  }

  export type CompetitionUpdateToOneWithWhereWithoutScoringCriteriaInput = {
    where?: CompetitionWhereInput
    data: XOR<CompetitionUpdateWithoutScoringCriteriaInput, CompetitionUncheckedUpdateWithoutScoringCriteriaInput>
  }

  export type CompetitionUpdateWithoutScoringCriteriaInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneRequiredWithoutCompetitionsNestedInput
    programs?: ProgramUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUpdateManyWithoutCompetitionNestedInput
    backgroundImage?: FileUpdateOneWithoutBackgroundImageCompetitionsNestedInput
    files?: FileUpdateManyWithoutCompetitionsNestedInput
  }

  export type CompetitionUncheckedUpdateWithoutScoringCriteriaInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    backgroundImageId?: NullableStringFieldUpdateOperationsInput | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileIds?: CompetitionUpdatefileIdsInput | string[]
    programs?: ProgramUncheckedUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUncheckedUpdateManyWithoutCompetitionNestedInput
    files?: FileUncheckedUpdateManyWithoutCompetitionsNestedInput
  }

  export type ScoreUpsertWithWhereUniqueWithoutScoringCriteriaInput = {
    where: ScoreWhereUniqueInput
    update: XOR<ScoreUpdateWithoutScoringCriteriaInput, ScoreUncheckedUpdateWithoutScoringCriteriaInput>
    create: XOR<ScoreCreateWithoutScoringCriteriaInput, ScoreUncheckedCreateWithoutScoringCriteriaInput>
  }

  export type ScoreUpdateWithWhereUniqueWithoutScoringCriteriaInput = {
    where: ScoreWhereUniqueInput
    data: XOR<ScoreUpdateWithoutScoringCriteriaInput, ScoreUncheckedUpdateWithoutScoringCriteriaInput>
  }

  export type ScoreUpdateManyWithWhereWithoutScoringCriteriaInput = {
    where: ScoreScalarWhereInput
    data: XOR<ScoreUpdateManyMutationInput, ScoreUncheckedUpdateManyWithoutScoringCriteriaInput>
  }

  export type ScoreScalarWhereInput = {
    AND?: ScoreScalarWhereInput | ScoreScalarWhereInput[]
    OR?: ScoreScalarWhereInput[]
    NOT?: ScoreScalarWhereInput | ScoreScalarWhereInput[]
    id?: StringFilter<"Score"> | string
    value?: FloatFilter<"Score"> | number
    comment?: StringNullableFilter<"Score"> | string | null
    programId?: StringFilter<"Score"> | string
    scoringCriteriaId?: StringFilter<"Score"> | string
    judgeId?: StringFilter<"Score"> | string
    createdAt?: DateTimeFilter<"Score"> | Date | string
    updatedAt?: DateTimeFilter<"Score"> | Date | string
  }

  export type ProgramCreateWithoutParticipantsInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    competition: CompetitionCreateNestedOneWithoutProgramsInput
    attachments?: FileCreateNestedManyWithoutProgramsInput
    scores?: ScoreCreateNestedManyWithoutProgramInput
    ranking?: RankingCreateNestedOneWithoutProgramInput
  }

  export type ProgramUncheckedCreateWithoutParticipantsInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    competitionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participantIds?: ProgramCreateparticipantIdsInput | string[]
    fileIds?: ProgramCreatefileIdsInput | string[]
    attachments?: FileUncheckedCreateNestedManyWithoutProgramsInput
    scores?: ScoreUncheckedCreateNestedManyWithoutProgramInput
    ranking?: RankingUncheckedCreateNestedOneWithoutProgramInput
  }

  export type ProgramCreateOrConnectWithoutParticipantsInput = {
    where: ProgramWhereUniqueInput
    create: XOR<ProgramCreateWithoutParticipantsInput, ProgramUncheckedCreateWithoutParticipantsInput>
  }

  export type ProgramUpsertWithWhereUniqueWithoutParticipantsInput = {
    where: ProgramWhereUniqueInput
    update: XOR<ProgramUpdateWithoutParticipantsInput, ProgramUncheckedUpdateWithoutParticipantsInput>
    create: XOR<ProgramCreateWithoutParticipantsInput, ProgramUncheckedCreateWithoutParticipantsInput>
  }

  export type ProgramUpdateWithWhereUniqueWithoutParticipantsInput = {
    where: ProgramWhereUniqueInput
    data: XOR<ProgramUpdateWithoutParticipantsInput, ProgramUncheckedUpdateWithoutParticipantsInput>
  }

  export type ProgramUpdateManyWithWhereWithoutParticipantsInput = {
    where: ProgramScalarWhereInput
    data: XOR<ProgramUpdateManyMutationInput, ProgramUncheckedUpdateManyWithoutParticipantsInput>
  }

  export type CompetitionCreateWithoutProgramsInput = {
    id?: string
    name: string
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer: UserCreateNestedOneWithoutCompetitionsInput
    scoringCriteria?: ScoringCriteriaCreateNestedManyWithoutCompetitionInput
    rankings?: RankingCreateNestedManyWithoutCompetitionInput
    backgroundImage?: FileCreateNestedOneWithoutBackgroundImageCompetitionsInput
    files?: FileCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionUncheckedCreateWithoutProgramsInput = {
    id?: string
    name: string
    description?: string | null
    organizerId: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    backgroundImageId?: string | null
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    fileIds?: CompetitionCreatefileIdsInput | string[]
    scoringCriteria?: ScoringCriteriaUncheckedCreateNestedManyWithoutCompetitionInput
    rankings?: RankingUncheckedCreateNestedManyWithoutCompetitionInput
    files?: FileUncheckedCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionCreateOrConnectWithoutProgramsInput = {
    where: CompetitionWhereUniqueInput
    create: XOR<CompetitionCreateWithoutProgramsInput, CompetitionUncheckedCreateWithoutProgramsInput>
  }

  export type ParticipantCreateWithoutProgramsInput = {
    id?: string
    name: string
    bio?: string | null
    team?: string | null
    contact?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ParticipantUncheckedCreateWithoutProgramsInput = {
    id?: string
    name: string
    bio?: string | null
    team?: string | null
    contact?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    programIds?: ParticipantCreateprogramIdsInput | string[]
  }

  export type ParticipantCreateOrConnectWithoutProgramsInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutProgramsInput, ParticipantUncheckedCreateWithoutProgramsInput>
  }

  export type FileCreateWithoutProgramsInput = {
    id?: string
    filename: string
    path: string
    mimetype: string
    size: number
    createdAt?: Date | string
    competitions?: CompetitionCreateNestedManyWithoutFilesInput
    backgroundImageCompetitions?: CompetitionCreateNestedManyWithoutBackgroundImageInput
  }

  export type FileUncheckedCreateWithoutProgramsInput = {
    id?: string
    filename: string
    path: string
    mimetype: string
    size: number
    createdAt?: Date | string
    programIds?: FileCreateprogramIdsInput | string[]
    competitionIds?: FileCreatecompetitionIdsInput | string[]
    competitions?: CompetitionUncheckedCreateNestedManyWithoutFilesInput
    backgroundImageCompetitions?: CompetitionUncheckedCreateNestedManyWithoutBackgroundImageInput
  }

  export type FileCreateOrConnectWithoutProgramsInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutProgramsInput, FileUncheckedCreateWithoutProgramsInput>
  }

  export type ScoreCreateWithoutProgramInput = {
    id?: string
    value: number
    comment?: string | null
    judgeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    scoringCriteria: ScoringCriteriaCreateNestedOneWithoutScoresInput
  }

  export type ScoreUncheckedCreateWithoutProgramInput = {
    id?: string
    value: number
    comment?: string | null
    scoringCriteriaId: string
    judgeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScoreCreateOrConnectWithoutProgramInput = {
    where: ScoreWhereUniqueInput
    create: XOR<ScoreCreateWithoutProgramInput, ScoreUncheckedCreateWithoutProgramInput>
  }

  export type ScoreCreateManyProgramInputEnvelope = {
    data: ScoreCreateManyProgramInput | ScoreCreateManyProgramInput[]
  }

  export type RankingCreateWithoutProgramInput = {
    id?: string
    rank: number
    totalScore: number
    updateType?: $Enums.UpdateType
    createdAt?: Date | string
    updatedAt?: Date | string
    competition: CompetitionCreateNestedOneWithoutRankingsInput
  }

  export type RankingUncheckedCreateWithoutProgramInput = {
    id?: string
    rank: number
    totalScore: number
    updateType?: $Enums.UpdateType
    competitionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RankingCreateOrConnectWithoutProgramInput = {
    where: RankingWhereUniqueInput
    create: XOR<RankingCreateWithoutProgramInput, RankingUncheckedCreateWithoutProgramInput>
  }

  export type CompetitionUpsertWithoutProgramsInput = {
    update: XOR<CompetitionUpdateWithoutProgramsInput, CompetitionUncheckedUpdateWithoutProgramsInput>
    create: XOR<CompetitionCreateWithoutProgramsInput, CompetitionUncheckedCreateWithoutProgramsInput>
    where?: CompetitionWhereInput
  }

  export type CompetitionUpdateToOneWithWhereWithoutProgramsInput = {
    where?: CompetitionWhereInput
    data: XOR<CompetitionUpdateWithoutProgramsInput, CompetitionUncheckedUpdateWithoutProgramsInput>
  }

  export type CompetitionUpdateWithoutProgramsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneRequiredWithoutCompetitionsNestedInput
    scoringCriteria?: ScoringCriteriaUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUpdateManyWithoutCompetitionNestedInput
    backgroundImage?: FileUpdateOneWithoutBackgroundImageCompetitionsNestedInput
    files?: FileUpdateManyWithoutCompetitionsNestedInput
  }

  export type CompetitionUncheckedUpdateWithoutProgramsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    backgroundImageId?: NullableStringFieldUpdateOperationsInput | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileIds?: CompetitionUpdatefileIdsInput | string[]
    scoringCriteria?: ScoringCriteriaUncheckedUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUncheckedUpdateManyWithoutCompetitionNestedInput
    files?: FileUncheckedUpdateManyWithoutCompetitionsNestedInput
  }

  export type ParticipantUpsertWithWhereUniqueWithoutProgramsInput = {
    where: ParticipantWhereUniqueInput
    update: XOR<ParticipantUpdateWithoutProgramsInput, ParticipantUncheckedUpdateWithoutProgramsInput>
    create: XOR<ParticipantCreateWithoutProgramsInput, ParticipantUncheckedCreateWithoutProgramsInput>
  }

  export type ParticipantUpdateWithWhereUniqueWithoutProgramsInput = {
    where: ParticipantWhereUniqueInput
    data: XOR<ParticipantUpdateWithoutProgramsInput, ParticipantUncheckedUpdateWithoutProgramsInput>
  }

  export type ParticipantUpdateManyWithWhereWithoutProgramsInput = {
    where: ParticipantScalarWhereInput
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyWithoutProgramsInput>
  }

  export type ParticipantScalarWhereInput = {
    AND?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
    OR?: ParticipantScalarWhereInput[]
    NOT?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
    id?: StringFilter<"Participant"> | string
    name?: StringFilter<"Participant"> | string
    bio?: StringNullableFilter<"Participant"> | string | null
    team?: StringNullableFilter<"Participant"> | string | null
    contact?: StringNullableFilter<"Participant"> | string | null
    createdAt?: DateTimeFilter<"Participant"> | Date | string
    updatedAt?: DateTimeFilter<"Participant"> | Date | string
    programIds?: StringNullableListFilter<"Participant">
  }

  export type FileUpsertWithWhereUniqueWithoutProgramsInput = {
    where: FileWhereUniqueInput
    update: XOR<FileUpdateWithoutProgramsInput, FileUncheckedUpdateWithoutProgramsInput>
    create: XOR<FileCreateWithoutProgramsInput, FileUncheckedCreateWithoutProgramsInput>
  }

  export type FileUpdateWithWhereUniqueWithoutProgramsInput = {
    where: FileWhereUniqueInput
    data: XOR<FileUpdateWithoutProgramsInput, FileUncheckedUpdateWithoutProgramsInput>
  }

  export type FileUpdateManyWithWhereWithoutProgramsInput = {
    where: FileScalarWhereInput
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyWithoutProgramsInput>
  }

  export type ScoreUpsertWithWhereUniqueWithoutProgramInput = {
    where: ScoreWhereUniqueInput
    update: XOR<ScoreUpdateWithoutProgramInput, ScoreUncheckedUpdateWithoutProgramInput>
    create: XOR<ScoreCreateWithoutProgramInput, ScoreUncheckedCreateWithoutProgramInput>
  }

  export type ScoreUpdateWithWhereUniqueWithoutProgramInput = {
    where: ScoreWhereUniqueInput
    data: XOR<ScoreUpdateWithoutProgramInput, ScoreUncheckedUpdateWithoutProgramInput>
  }

  export type ScoreUpdateManyWithWhereWithoutProgramInput = {
    where: ScoreScalarWhereInput
    data: XOR<ScoreUpdateManyMutationInput, ScoreUncheckedUpdateManyWithoutProgramInput>
  }

  export type RankingUpsertWithoutProgramInput = {
    update: XOR<RankingUpdateWithoutProgramInput, RankingUncheckedUpdateWithoutProgramInput>
    create: XOR<RankingCreateWithoutProgramInput, RankingUncheckedCreateWithoutProgramInput>
    where?: RankingWhereInput
  }

  export type RankingUpdateToOneWithWhereWithoutProgramInput = {
    where?: RankingWhereInput
    data: XOR<RankingUpdateWithoutProgramInput, RankingUncheckedUpdateWithoutProgramInput>
  }

  export type RankingUpdateWithoutProgramInput = {
    rank?: IntFieldUpdateOperationsInput | number
    totalScore?: FloatFieldUpdateOperationsInput | number
    updateType?: EnumUpdateTypeFieldUpdateOperationsInput | $Enums.UpdateType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competition?: CompetitionUpdateOneRequiredWithoutRankingsNestedInput
  }

  export type RankingUncheckedUpdateWithoutProgramInput = {
    rank?: IntFieldUpdateOperationsInput | number
    totalScore?: FloatFieldUpdateOperationsInput | number
    updateType?: EnumUpdateTypeFieldUpdateOperationsInput | $Enums.UpdateType
    competitionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramCreateWithoutScoresInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    competition: CompetitionCreateNestedOneWithoutProgramsInput
    participants?: ParticipantCreateNestedManyWithoutProgramsInput
    attachments?: FileCreateNestedManyWithoutProgramsInput
    ranking?: RankingCreateNestedOneWithoutProgramInput
  }

  export type ProgramUncheckedCreateWithoutScoresInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    competitionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participantIds?: ProgramCreateparticipantIdsInput | string[]
    fileIds?: ProgramCreatefileIdsInput | string[]
    participants?: ParticipantUncheckedCreateNestedManyWithoutProgramsInput
    attachments?: FileUncheckedCreateNestedManyWithoutProgramsInput
    ranking?: RankingUncheckedCreateNestedOneWithoutProgramInput
  }

  export type ProgramCreateOrConnectWithoutScoresInput = {
    where: ProgramWhereUniqueInput
    create: XOR<ProgramCreateWithoutScoresInput, ProgramUncheckedCreateWithoutScoresInput>
  }

  export type ScoringCriteriaCreateWithoutScoresInput = {
    id?: string
    name: string
    weight: number
    maxScore: number
    competition: CompetitionCreateNestedOneWithoutScoringCriteriaInput
  }

  export type ScoringCriteriaUncheckedCreateWithoutScoresInput = {
    id?: string
    name: string
    weight: number
    maxScore: number
    competitionId: string
  }

  export type ScoringCriteriaCreateOrConnectWithoutScoresInput = {
    where: ScoringCriteriaWhereUniqueInput
    create: XOR<ScoringCriteriaCreateWithoutScoresInput, ScoringCriteriaUncheckedCreateWithoutScoresInput>
  }

  export type ProgramUpsertWithoutScoresInput = {
    update: XOR<ProgramUpdateWithoutScoresInput, ProgramUncheckedUpdateWithoutScoresInput>
    create: XOR<ProgramCreateWithoutScoresInput, ProgramUncheckedCreateWithoutScoresInput>
    where?: ProgramWhereInput
  }

  export type ProgramUpdateToOneWithWhereWithoutScoresInput = {
    where?: ProgramWhereInput
    data: XOR<ProgramUpdateWithoutScoresInput, ProgramUncheckedUpdateWithoutScoresInput>
  }

  export type ProgramUpdateWithoutScoresInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competition?: CompetitionUpdateOneRequiredWithoutProgramsNestedInput
    participants?: ParticipantUpdateManyWithoutProgramsNestedInput
    attachments?: FileUpdateManyWithoutProgramsNestedInput
    ranking?: RankingUpdateOneWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateWithoutScoresInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    competitionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participantIds?: ProgramUpdateparticipantIdsInput | string[]
    fileIds?: ProgramUpdatefileIdsInput | string[]
    participants?: ParticipantUncheckedUpdateManyWithoutProgramsNestedInput
    attachments?: FileUncheckedUpdateManyWithoutProgramsNestedInput
    ranking?: RankingUncheckedUpdateOneWithoutProgramNestedInput
  }

  export type ScoringCriteriaUpsertWithoutScoresInput = {
    update: XOR<ScoringCriteriaUpdateWithoutScoresInput, ScoringCriteriaUncheckedUpdateWithoutScoresInput>
    create: XOR<ScoringCriteriaCreateWithoutScoresInput, ScoringCriteriaUncheckedCreateWithoutScoresInput>
    where?: ScoringCriteriaWhereInput
  }

  export type ScoringCriteriaUpdateToOneWithWhereWithoutScoresInput = {
    where?: ScoringCriteriaWhereInput
    data: XOR<ScoringCriteriaUpdateWithoutScoresInput, ScoringCriteriaUncheckedUpdateWithoutScoresInput>
  }

  export type ScoringCriteriaUpdateWithoutScoresInput = {
    name?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    maxScore?: FloatFieldUpdateOperationsInput | number
    competition?: CompetitionUpdateOneRequiredWithoutScoringCriteriaNestedInput
  }

  export type ScoringCriteriaUncheckedUpdateWithoutScoresInput = {
    name?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    maxScore?: FloatFieldUpdateOperationsInput | number
    competitionId?: StringFieldUpdateOperationsInput | string
  }

  export type CompetitionCreateWithoutRankingsInput = {
    id?: string
    name: string
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer: UserCreateNestedOneWithoutCompetitionsInput
    programs?: ProgramCreateNestedManyWithoutCompetitionInput
    scoringCriteria?: ScoringCriteriaCreateNestedManyWithoutCompetitionInput
    backgroundImage?: FileCreateNestedOneWithoutBackgroundImageCompetitionsInput
    files?: FileCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionUncheckedCreateWithoutRankingsInput = {
    id?: string
    name: string
    description?: string | null
    organizerId: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    backgroundImageId?: string | null
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    fileIds?: CompetitionCreatefileIdsInput | string[]
    programs?: ProgramUncheckedCreateNestedManyWithoutCompetitionInput
    scoringCriteria?: ScoringCriteriaUncheckedCreateNestedManyWithoutCompetitionInput
    files?: FileUncheckedCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionCreateOrConnectWithoutRankingsInput = {
    where: CompetitionWhereUniqueInput
    create: XOR<CompetitionCreateWithoutRankingsInput, CompetitionUncheckedCreateWithoutRankingsInput>
  }

  export type ProgramCreateWithoutRankingInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    competition: CompetitionCreateNestedOneWithoutProgramsInput
    participants?: ParticipantCreateNestedManyWithoutProgramsInput
    attachments?: FileCreateNestedManyWithoutProgramsInput
    scores?: ScoreCreateNestedManyWithoutProgramInput
  }

  export type ProgramUncheckedCreateWithoutRankingInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    competitionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participantIds?: ProgramCreateparticipantIdsInput | string[]
    fileIds?: ProgramCreatefileIdsInput | string[]
    participants?: ParticipantUncheckedCreateNestedManyWithoutProgramsInput
    attachments?: FileUncheckedCreateNestedManyWithoutProgramsInput
    scores?: ScoreUncheckedCreateNestedManyWithoutProgramInput
  }

  export type ProgramCreateOrConnectWithoutRankingInput = {
    where: ProgramWhereUniqueInput
    create: XOR<ProgramCreateWithoutRankingInput, ProgramUncheckedCreateWithoutRankingInput>
  }

  export type CompetitionUpsertWithoutRankingsInput = {
    update: XOR<CompetitionUpdateWithoutRankingsInput, CompetitionUncheckedUpdateWithoutRankingsInput>
    create: XOR<CompetitionCreateWithoutRankingsInput, CompetitionUncheckedCreateWithoutRankingsInput>
    where?: CompetitionWhereInput
  }

  export type CompetitionUpdateToOneWithWhereWithoutRankingsInput = {
    where?: CompetitionWhereInput
    data: XOR<CompetitionUpdateWithoutRankingsInput, CompetitionUncheckedUpdateWithoutRankingsInput>
  }

  export type CompetitionUpdateWithoutRankingsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneRequiredWithoutCompetitionsNestedInput
    programs?: ProgramUpdateManyWithoutCompetitionNestedInput
    scoringCriteria?: ScoringCriteriaUpdateManyWithoutCompetitionNestedInput
    backgroundImage?: FileUpdateOneWithoutBackgroundImageCompetitionsNestedInput
    files?: FileUpdateManyWithoutCompetitionsNestedInput
  }

  export type CompetitionUncheckedUpdateWithoutRankingsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    backgroundImageId?: NullableStringFieldUpdateOperationsInput | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileIds?: CompetitionUpdatefileIdsInput | string[]
    programs?: ProgramUncheckedUpdateManyWithoutCompetitionNestedInput
    scoringCriteria?: ScoringCriteriaUncheckedUpdateManyWithoutCompetitionNestedInput
    files?: FileUncheckedUpdateManyWithoutCompetitionsNestedInput
  }

  export type ProgramUpsertWithoutRankingInput = {
    update: XOR<ProgramUpdateWithoutRankingInput, ProgramUncheckedUpdateWithoutRankingInput>
    create: XOR<ProgramCreateWithoutRankingInput, ProgramUncheckedCreateWithoutRankingInput>
    where?: ProgramWhereInput
  }

  export type ProgramUpdateToOneWithWhereWithoutRankingInput = {
    where?: ProgramWhereInput
    data: XOR<ProgramUpdateWithoutRankingInput, ProgramUncheckedUpdateWithoutRankingInput>
  }

  export type ProgramUpdateWithoutRankingInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competition?: CompetitionUpdateOneRequiredWithoutProgramsNestedInput
    participants?: ParticipantUpdateManyWithoutProgramsNestedInput
    attachments?: FileUpdateManyWithoutProgramsNestedInput
    scores?: ScoreUpdateManyWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateWithoutRankingInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    competitionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participantIds?: ProgramUpdateparticipantIdsInput | string[]
    fileIds?: ProgramUpdatefileIdsInput | string[]
    participants?: ParticipantUncheckedUpdateManyWithoutProgramsNestedInput
    attachments?: FileUncheckedUpdateManyWithoutProgramsNestedInput
    scores?: ScoreUncheckedUpdateManyWithoutProgramNestedInput
  }

  export type ProgramCreateWithoutAttachmentsInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    competition: CompetitionCreateNestedOneWithoutProgramsInput
    participants?: ParticipantCreateNestedManyWithoutProgramsInput
    scores?: ScoreCreateNestedManyWithoutProgramInput
    ranking?: RankingCreateNestedOneWithoutProgramInput
  }

  export type ProgramUncheckedCreateWithoutAttachmentsInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    competitionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participantIds?: ProgramCreateparticipantIdsInput | string[]
    fileIds?: ProgramCreatefileIdsInput | string[]
    participants?: ParticipantUncheckedCreateNestedManyWithoutProgramsInput
    scores?: ScoreUncheckedCreateNestedManyWithoutProgramInput
    ranking?: RankingUncheckedCreateNestedOneWithoutProgramInput
  }

  export type ProgramCreateOrConnectWithoutAttachmentsInput = {
    where: ProgramWhereUniqueInput
    create: XOR<ProgramCreateWithoutAttachmentsInput, ProgramUncheckedCreateWithoutAttachmentsInput>
  }

  export type CompetitionCreateWithoutFilesInput = {
    id?: string
    name: string
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer: UserCreateNestedOneWithoutCompetitionsInput
    programs?: ProgramCreateNestedManyWithoutCompetitionInput
    scoringCriteria?: ScoringCriteriaCreateNestedManyWithoutCompetitionInput
    rankings?: RankingCreateNestedManyWithoutCompetitionInput
    backgroundImage?: FileCreateNestedOneWithoutBackgroundImageCompetitionsInput
  }

  export type CompetitionUncheckedCreateWithoutFilesInput = {
    id?: string
    name: string
    description?: string | null
    organizerId: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    backgroundImageId?: string | null
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    fileIds?: CompetitionCreatefileIdsInput | string[]
    programs?: ProgramUncheckedCreateNestedManyWithoutCompetitionInput
    scoringCriteria?: ScoringCriteriaUncheckedCreateNestedManyWithoutCompetitionInput
    rankings?: RankingUncheckedCreateNestedManyWithoutCompetitionInput
  }

  export type CompetitionCreateOrConnectWithoutFilesInput = {
    where: CompetitionWhereUniqueInput
    create: XOR<CompetitionCreateWithoutFilesInput, CompetitionUncheckedCreateWithoutFilesInput>
  }

  export type CompetitionCreateWithoutBackgroundImageInput = {
    id?: string
    name: string
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer: UserCreateNestedOneWithoutCompetitionsInput
    programs?: ProgramCreateNestedManyWithoutCompetitionInput
    scoringCriteria?: ScoringCriteriaCreateNestedManyWithoutCompetitionInput
    rankings?: RankingCreateNestedManyWithoutCompetitionInput
    files?: FileCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionUncheckedCreateWithoutBackgroundImageInput = {
    id?: string
    name: string
    description?: string | null
    organizerId: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    fileIds?: CompetitionCreatefileIdsInput | string[]
    programs?: ProgramUncheckedCreateNestedManyWithoutCompetitionInput
    scoringCriteria?: ScoringCriteriaUncheckedCreateNestedManyWithoutCompetitionInput
    rankings?: RankingUncheckedCreateNestedManyWithoutCompetitionInput
    files?: FileUncheckedCreateNestedManyWithoutCompetitionsInput
  }

  export type CompetitionCreateOrConnectWithoutBackgroundImageInput = {
    where: CompetitionWhereUniqueInput
    create: XOR<CompetitionCreateWithoutBackgroundImageInput, CompetitionUncheckedCreateWithoutBackgroundImageInput>
  }

  export type CompetitionCreateManyBackgroundImageInputEnvelope = {
    data: CompetitionCreateManyBackgroundImageInput | CompetitionCreateManyBackgroundImageInput[]
  }

  export type ProgramUpsertWithWhereUniqueWithoutAttachmentsInput = {
    where: ProgramWhereUniqueInput
    update: XOR<ProgramUpdateWithoutAttachmentsInput, ProgramUncheckedUpdateWithoutAttachmentsInput>
    create: XOR<ProgramCreateWithoutAttachmentsInput, ProgramUncheckedCreateWithoutAttachmentsInput>
  }

  export type ProgramUpdateWithWhereUniqueWithoutAttachmentsInput = {
    where: ProgramWhereUniqueInput
    data: XOR<ProgramUpdateWithoutAttachmentsInput, ProgramUncheckedUpdateWithoutAttachmentsInput>
  }

  export type ProgramUpdateManyWithWhereWithoutAttachmentsInput = {
    where: ProgramScalarWhereInput
    data: XOR<ProgramUpdateManyMutationInput, ProgramUncheckedUpdateManyWithoutAttachmentsInput>
  }

  export type CompetitionUpsertWithWhereUniqueWithoutFilesInput = {
    where: CompetitionWhereUniqueInput
    update: XOR<CompetitionUpdateWithoutFilesInput, CompetitionUncheckedUpdateWithoutFilesInput>
    create: XOR<CompetitionCreateWithoutFilesInput, CompetitionUncheckedCreateWithoutFilesInput>
  }

  export type CompetitionUpdateWithWhereUniqueWithoutFilesInput = {
    where: CompetitionWhereUniqueInput
    data: XOR<CompetitionUpdateWithoutFilesInput, CompetitionUncheckedUpdateWithoutFilesInput>
  }

  export type CompetitionUpdateManyWithWhereWithoutFilesInput = {
    where: CompetitionScalarWhereInput
    data: XOR<CompetitionUpdateManyMutationInput, CompetitionUncheckedUpdateManyWithoutFilesInput>
  }

  export type CompetitionUpsertWithWhereUniqueWithoutBackgroundImageInput = {
    where: CompetitionWhereUniqueInput
    update: XOR<CompetitionUpdateWithoutBackgroundImageInput, CompetitionUncheckedUpdateWithoutBackgroundImageInput>
    create: XOR<CompetitionCreateWithoutBackgroundImageInput, CompetitionUncheckedCreateWithoutBackgroundImageInput>
  }

  export type CompetitionUpdateWithWhereUniqueWithoutBackgroundImageInput = {
    where: CompetitionWhereUniqueInput
    data: XOR<CompetitionUpdateWithoutBackgroundImageInput, CompetitionUncheckedUpdateWithoutBackgroundImageInput>
  }

  export type CompetitionUpdateManyWithWhereWithoutBackgroundImageInput = {
    where: CompetitionScalarWhereInput
    data: XOR<CompetitionUpdateManyMutationInput, CompetitionUncheckedUpdateManyWithoutBackgroundImageInput>
  }

  export type UserCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    competitions?: CompetitionCreateNestedManyWithoutOrganizerInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    competitions?: CompetitionUncheckedCreateNestedManyWithoutOrganizerInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competitions?: CompetitionUpdateManyWithoutOrganizerNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competitions?: CompetitionUncheckedUpdateManyWithoutOrganizerNestedInput
  }

  export type CompetitionCreateManyOrganizerInput = {
    id?: string
    name: string
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    backgroundImageId?: string | null
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    fileIds?: CompetitionCreatefileIdsInput | string[]
  }

  export type AuditLogCreateManyUserInput = {
    id?: string
    timestamp?: Date | string
    action: string
    targetId?: string | null
    details?: InputJsonValue | null
  }

  export type CompetitionUpdateWithoutOrganizerInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramUpdateManyWithoutCompetitionNestedInput
    scoringCriteria?: ScoringCriteriaUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUpdateManyWithoutCompetitionNestedInput
    backgroundImage?: FileUpdateOneWithoutBackgroundImageCompetitionsNestedInput
    files?: FileUpdateManyWithoutCompetitionsNestedInput
  }

  export type CompetitionUncheckedUpdateWithoutOrganizerInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    backgroundImageId?: NullableStringFieldUpdateOperationsInput | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileIds?: CompetitionUpdatefileIdsInput | string[]
    programs?: ProgramUncheckedUpdateManyWithoutCompetitionNestedInput
    scoringCriteria?: ScoringCriteriaUncheckedUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUncheckedUpdateManyWithoutCompetitionNestedInput
    files?: FileUncheckedUpdateManyWithoutCompetitionsNestedInput
  }

  export type CompetitionUncheckedUpdateManyWithoutOrganizerInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    backgroundImageId?: NullableStringFieldUpdateOperationsInput | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileIds?: CompetitionUpdatefileIdsInput | string[]
  }

  export type AuditLogUpdateWithoutUserInput = {
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: InputJsonValue | InputJsonValue | null
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: InputJsonValue | InputJsonValue | null
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: InputJsonValue | InputJsonValue | null
  }

  export type ProgramCreateManyCompetitionInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    currentStatus?: $Enums.ProgramStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    participantIds?: ProgramCreateparticipantIdsInput | string[]
    fileIds?: ProgramCreatefileIdsInput | string[]
  }

  export type ScoringCriteriaCreateManyCompetitionInput = {
    id?: string
    name: string
    weight: number
    maxScore: number
  }

  export type RankingCreateManyCompetitionInput = {
    id?: string
    rank: number
    totalScore: number
    updateType?: $Enums.UpdateType
    programId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgramUpdateWithoutCompetitionInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUpdateManyWithoutProgramsNestedInput
    attachments?: FileUpdateManyWithoutProgramsNestedInput
    scores?: ScoreUpdateManyWithoutProgramNestedInput
    ranking?: RankingUpdateOneWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateWithoutCompetitionInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participantIds?: ProgramUpdateparticipantIdsInput | string[]
    fileIds?: ProgramUpdatefileIdsInput | string[]
    participants?: ParticipantUncheckedUpdateManyWithoutProgramsNestedInput
    attachments?: FileUncheckedUpdateManyWithoutProgramsNestedInput
    scores?: ScoreUncheckedUpdateManyWithoutProgramNestedInput
    ranking?: RankingUncheckedUpdateOneWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateManyWithoutCompetitionInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participantIds?: ProgramUpdateparticipantIdsInput | string[]
    fileIds?: ProgramUpdatefileIdsInput | string[]
  }

  export type ScoringCriteriaUpdateWithoutCompetitionInput = {
    name?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    maxScore?: FloatFieldUpdateOperationsInput | number
    scores?: ScoreUpdateManyWithoutScoringCriteriaNestedInput
  }

  export type ScoringCriteriaUncheckedUpdateWithoutCompetitionInput = {
    name?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    maxScore?: FloatFieldUpdateOperationsInput | number
    scores?: ScoreUncheckedUpdateManyWithoutScoringCriteriaNestedInput
  }

  export type ScoringCriteriaUncheckedUpdateManyWithoutCompetitionInput = {
    name?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    maxScore?: FloatFieldUpdateOperationsInput | number
  }

  export type RankingUpdateWithoutCompetitionInput = {
    rank?: IntFieldUpdateOperationsInput | number
    totalScore?: FloatFieldUpdateOperationsInput | number
    updateType?: EnumUpdateTypeFieldUpdateOperationsInput | $Enums.UpdateType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    program?: ProgramUpdateOneRequiredWithoutRankingNestedInput
  }

  export type RankingUncheckedUpdateWithoutCompetitionInput = {
    rank?: IntFieldUpdateOperationsInput | number
    totalScore?: FloatFieldUpdateOperationsInput | number
    updateType?: EnumUpdateTypeFieldUpdateOperationsInput | $Enums.UpdateType
    programId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RankingUncheckedUpdateManyWithoutCompetitionInput = {
    rank?: IntFieldUpdateOperationsInput | number
    totalScore?: FloatFieldUpdateOperationsInput | number
    updateType?: EnumUpdateTypeFieldUpdateOperationsInput | $Enums.UpdateType
    programId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileUpdateWithoutCompetitionsInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramUpdateManyWithoutAttachmentsNestedInput
    backgroundImageCompetitions?: CompetitionUpdateManyWithoutBackgroundImageNestedInput
  }

  export type FileUncheckedUpdateWithoutCompetitionsInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programIds?: FileUpdateprogramIdsInput | string[]
    competitionIds?: FileUpdatecompetitionIdsInput | string[]
    programs?: ProgramUncheckedUpdateManyWithoutAttachmentsNestedInput
    backgroundImageCompetitions?: CompetitionUncheckedUpdateManyWithoutBackgroundImageNestedInput
  }

  export type FileUncheckedUpdateManyWithoutCompetitionsInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programIds?: FileUpdateprogramIdsInput | string[]
    competitionIds?: FileUpdatecompetitionIdsInput | string[]
  }

  export type ScoreCreateManyScoringCriteriaInput = {
    id?: string
    value: number
    comment?: string | null
    programId: string
    judgeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScoreUpdateWithoutScoringCriteriaInput = {
    value?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    judgeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    program?: ProgramUpdateOneRequiredWithoutScoresNestedInput
  }

  export type ScoreUncheckedUpdateWithoutScoringCriteriaInput = {
    value?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    programId?: StringFieldUpdateOperationsInput | string
    judgeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScoreUncheckedUpdateManyWithoutScoringCriteriaInput = {
    value?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    programId?: StringFieldUpdateOperationsInput | string
    judgeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramUpdateWithoutParticipantsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competition?: CompetitionUpdateOneRequiredWithoutProgramsNestedInput
    attachments?: FileUpdateManyWithoutProgramsNestedInput
    scores?: ScoreUpdateManyWithoutProgramNestedInput
    ranking?: RankingUpdateOneWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateWithoutParticipantsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    competitionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participantIds?: ProgramUpdateparticipantIdsInput | string[]
    fileIds?: ProgramUpdatefileIdsInput | string[]
    attachments?: FileUncheckedUpdateManyWithoutProgramsNestedInput
    scores?: ScoreUncheckedUpdateManyWithoutProgramNestedInput
    ranking?: RankingUncheckedUpdateOneWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateManyWithoutParticipantsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    competitionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participantIds?: ProgramUpdateparticipantIdsInput | string[]
    fileIds?: ProgramUpdatefileIdsInput | string[]
  }

  export type ScoreCreateManyProgramInput = {
    id?: string
    value: number
    comment?: string | null
    scoringCriteriaId: string
    judgeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ParticipantUpdateWithoutProgramsInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    team?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantUncheckedUpdateWithoutProgramsInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    team?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programIds?: ParticipantUpdateprogramIdsInput | string[]
  }

  export type ParticipantUncheckedUpdateManyWithoutProgramsInput = {
    name?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    team?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programIds?: ParticipantUpdateprogramIdsInput | string[]
  }

  export type FileUpdateWithoutProgramsInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competitions?: CompetitionUpdateManyWithoutFilesNestedInput
    backgroundImageCompetitions?: CompetitionUpdateManyWithoutBackgroundImageNestedInput
  }

  export type FileUncheckedUpdateWithoutProgramsInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programIds?: FileUpdateprogramIdsInput | string[]
    competitionIds?: FileUpdatecompetitionIdsInput | string[]
    competitions?: CompetitionUncheckedUpdateManyWithoutFilesNestedInput
    backgroundImageCompetitions?: CompetitionUncheckedUpdateManyWithoutBackgroundImageNestedInput
  }

  export type FileUncheckedUpdateManyWithoutProgramsInput = {
    filename?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programIds?: FileUpdateprogramIdsInput | string[]
    competitionIds?: FileUpdatecompetitionIdsInput | string[]
  }

  export type ScoreUpdateWithoutProgramInput = {
    value?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    judgeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scoringCriteria?: ScoringCriteriaUpdateOneRequiredWithoutScoresNestedInput
  }

  export type ScoreUncheckedUpdateWithoutProgramInput = {
    value?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    scoringCriteriaId?: StringFieldUpdateOperationsInput | string
    judgeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScoreUncheckedUpdateManyWithoutProgramInput = {
    value?: FloatFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    scoringCriteriaId?: StringFieldUpdateOperationsInput | string
    judgeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompetitionCreateManyBackgroundImageInput = {
    id?: string
    name: string
    description?: string | null
    organizerId: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.CompetitionStatus
    rankingUpdateMode?: $Enums.RankingUpdateMode
    createdAt?: Date | string
    updatedAt?: Date | string
    fileIds?: CompetitionCreatefileIdsInput | string[]
  }

  export type ProgramUpdateWithoutAttachmentsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    competition?: CompetitionUpdateOneRequiredWithoutProgramsNestedInput
    participants?: ParticipantUpdateManyWithoutProgramsNestedInput
    scores?: ScoreUpdateManyWithoutProgramNestedInput
    ranking?: RankingUpdateOneWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateWithoutAttachmentsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    competitionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participantIds?: ProgramUpdateparticipantIdsInput | string[]
    fileIds?: ProgramUpdatefileIdsInput | string[]
    participants?: ParticipantUncheckedUpdateManyWithoutProgramsNestedInput
    scores?: ScoreUncheckedUpdateManyWithoutProgramNestedInput
    ranking?: RankingUncheckedUpdateOneWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateManyWithoutAttachmentsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    currentStatus?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    competitionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participantIds?: ProgramUpdateparticipantIdsInput | string[]
    fileIds?: ProgramUpdatefileIdsInput | string[]
  }

  export type CompetitionUpdateWithoutFilesInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneRequiredWithoutCompetitionsNestedInput
    programs?: ProgramUpdateManyWithoutCompetitionNestedInput
    scoringCriteria?: ScoringCriteriaUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUpdateManyWithoutCompetitionNestedInput
    backgroundImage?: FileUpdateOneWithoutBackgroundImageCompetitionsNestedInput
  }

  export type CompetitionUncheckedUpdateWithoutFilesInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    backgroundImageId?: NullableStringFieldUpdateOperationsInput | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileIds?: CompetitionUpdatefileIdsInput | string[]
    programs?: ProgramUncheckedUpdateManyWithoutCompetitionNestedInput
    scoringCriteria?: ScoringCriteriaUncheckedUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUncheckedUpdateManyWithoutCompetitionNestedInput
  }

  export type CompetitionUncheckedUpdateManyWithoutFilesInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    backgroundImageId?: NullableStringFieldUpdateOperationsInput | string | null
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileIds?: CompetitionUpdatefileIdsInput | string[]
  }

  export type CompetitionUpdateWithoutBackgroundImageInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneRequiredWithoutCompetitionsNestedInput
    programs?: ProgramUpdateManyWithoutCompetitionNestedInput
    scoringCriteria?: ScoringCriteriaUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUpdateManyWithoutCompetitionNestedInput
    files?: FileUpdateManyWithoutCompetitionsNestedInput
  }

  export type CompetitionUncheckedUpdateWithoutBackgroundImageInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileIds?: CompetitionUpdatefileIdsInput | string[]
    programs?: ProgramUncheckedUpdateManyWithoutCompetitionNestedInput
    scoringCriteria?: ScoringCriteriaUncheckedUpdateManyWithoutCompetitionNestedInput
    rankings?: RankingUncheckedUpdateManyWithoutCompetitionNestedInput
    files?: FileUncheckedUpdateManyWithoutCompetitionsNestedInput
  }

  export type CompetitionUncheckedUpdateManyWithoutBackgroundImageInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCompetitionStatusFieldUpdateOperationsInput | $Enums.CompetitionStatus
    rankingUpdateMode?: EnumRankingUpdateModeFieldUpdateOperationsInput | $Enums.RankingUpdateMode
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileIds?: CompetitionUpdatefileIdsInput | string[]
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}