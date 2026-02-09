
/**
 * Client
**/

import * as runtime from './runtime/client.js';
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
 * Model Trade
 * 
 */
export type Trade = $Result.DefaultSelection<Prisma.$TradePayload>
/**
 * Model Position
 * 
 */
export type Position = $Result.DefaultSelection<Prisma.$PositionPayload>
/**
 * Model StrategyPerformance
 * 
 */
export type StrategyPerformance = $Result.DefaultSelection<Prisma.$StrategyPerformancePayload>
/**
 * Model TokenWhitelist
 * 
 */
export type TokenWhitelist = $Result.DefaultSelection<Prisma.$TokenWhitelistPayload>
/**
 * Model AgentLog
 * 
 */
export type AgentLog = $Result.DefaultSelection<Prisma.$AgentLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const StrategyType: {
  CONSERVATIVE: 'CONSERVATIVE',
  BALANCED: 'BALANCED',
  AGGRESSIVE: 'AGGRESSIVE'
};

export type StrategyType = (typeof StrategyType)[keyof typeof StrategyType]


export const TradeAction: {
  BUY: 'BUY',
  SELL: 'SELL'
};

export type TradeAction = (typeof TradeAction)[keyof typeof TradeAction]


export const TradeStatus: {
  PENDING: 'PENDING',
  EXECUTING: 'EXECUTING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export type TradeStatus = (typeof TradeStatus)[keyof typeof TradeStatus]


export const RiskLevel: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel]

}

export type StrategyType = $Enums.StrategyType

export const StrategyType: typeof $Enums.StrategyType

export type TradeAction = $Enums.TradeAction

export const TradeAction: typeof $Enums.TradeAction

export type TradeStatus = $Enums.TradeStatus

export const TradeStatus: typeof $Enums.TradeStatus

export type RiskLevel = $Enums.RiskLevel

export const RiskLevel: typeof $Enums.RiskLevel

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
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * Read more in our [docs](https://pris.ly/d/client).
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
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


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
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

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
   * `prisma.trade`: Exposes CRUD operations for the **Trade** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Trades
    * const trades = await prisma.trade.findMany()
    * ```
    */
  get trade(): Prisma.TradeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.position`: Exposes CRUD operations for the **Position** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Positions
    * const positions = await prisma.position.findMany()
    * ```
    */
  get position(): Prisma.PositionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.strategyPerformance`: Exposes CRUD operations for the **StrategyPerformance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StrategyPerformances
    * const strategyPerformances = await prisma.strategyPerformance.findMany()
    * ```
    */
  get strategyPerformance(): Prisma.StrategyPerformanceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tokenWhitelist`: Exposes CRUD operations for the **TokenWhitelist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TokenWhitelists
    * const tokenWhitelists = await prisma.tokenWhitelist.findMany()
    * ```
    */
  get tokenWhitelist(): Prisma.TokenWhitelistDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentLog`: Exposes CRUD operations for the **AgentLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentLogs
    * const agentLogs = await prisma.agentLog.findMany()
    * ```
    */
  get agentLog(): Prisma.AgentLogDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.3.0
   * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
    Trade: 'Trade',
    Position: 'Position',
    StrategyPerformance: 'StrategyPerformance',
    TokenWhitelist: 'TokenWhitelist',
    AgentLog: 'AgentLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "trade" | "position" | "strategyPerformance" | "tokenWhitelist" | "agentLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
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
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
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
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
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
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Trade: {
        payload: Prisma.$TradePayload<ExtArgs>
        fields: Prisma.TradeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          findFirst: {
            args: Prisma.TradeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          findMany: {
            args: Prisma.TradeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>[]
          }
          create: {
            args: Prisma.TradeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          createMany: {
            args: Prisma.TradeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>[]
          }
          delete: {
            args: Prisma.TradeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          update: {
            args: Prisma.TradeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          deleteMany: {
            args: Prisma.TradeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>[]
          }
          upsert: {
            args: Prisma.TradeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          aggregate: {
            args: Prisma.TradeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrade>
          }
          groupBy: {
            args: Prisma.TradeGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradeGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradeCountArgs<ExtArgs>
            result: $Utils.Optional<TradeCountAggregateOutputType> | number
          }
        }
      }
      Position: {
        payload: Prisma.$PositionPayload<ExtArgs>
        fields: Prisma.PositionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PositionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PositionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          findFirst: {
            args: Prisma.PositionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PositionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          findMany: {
            args: Prisma.PositionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>[]
          }
          create: {
            args: Prisma.PositionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          createMany: {
            args: Prisma.PositionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PositionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>[]
          }
          delete: {
            args: Prisma.PositionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          update: {
            args: Prisma.PositionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          deleteMany: {
            args: Prisma.PositionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PositionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PositionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>[]
          }
          upsert: {
            args: Prisma.PositionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          aggregate: {
            args: Prisma.PositionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePosition>
          }
          groupBy: {
            args: Prisma.PositionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PositionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PositionCountArgs<ExtArgs>
            result: $Utils.Optional<PositionCountAggregateOutputType> | number
          }
        }
      }
      StrategyPerformance: {
        payload: Prisma.$StrategyPerformancePayload<ExtArgs>
        fields: Prisma.StrategyPerformanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StrategyPerformanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPerformancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StrategyPerformanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPerformancePayload>
          }
          findFirst: {
            args: Prisma.StrategyPerformanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPerformancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StrategyPerformanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPerformancePayload>
          }
          findMany: {
            args: Prisma.StrategyPerformanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPerformancePayload>[]
          }
          create: {
            args: Prisma.StrategyPerformanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPerformancePayload>
          }
          createMany: {
            args: Prisma.StrategyPerformanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StrategyPerformanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPerformancePayload>[]
          }
          delete: {
            args: Prisma.StrategyPerformanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPerformancePayload>
          }
          update: {
            args: Prisma.StrategyPerformanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPerformancePayload>
          }
          deleteMany: {
            args: Prisma.StrategyPerformanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StrategyPerformanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StrategyPerformanceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPerformancePayload>[]
          }
          upsert: {
            args: Prisma.StrategyPerformanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPerformancePayload>
          }
          aggregate: {
            args: Prisma.StrategyPerformanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStrategyPerformance>
          }
          groupBy: {
            args: Prisma.StrategyPerformanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<StrategyPerformanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.StrategyPerformanceCountArgs<ExtArgs>
            result: $Utils.Optional<StrategyPerformanceCountAggregateOutputType> | number
          }
        }
      }
      TokenWhitelist: {
        payload: Prisma.$TokenWhitelistPayload<ExtArgs>
        fields: Prisma.TokenWhitelistFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TokenWhitelistFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenWhitelistPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TokenWhitelistFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenWhitelistPayload>
          }
          findFirst: {
            args: Prisma.TokenWhitelistFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenWhitelistPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TokenWhitelistFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenWhitelistPayload>
          }
          findMany: {
            args: Prisma.TokenWhitelistFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenWhitelistPayload>[]
          }
          create: {
            args: Prisma.TokenWhitelistCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenWhitelistPayload>
          }
          createMany: {
            args: Prisma.TokenWhitelistCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TokenWhitelistCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenWhitelistPayload>[]
          }
          delete: {
            args: Prisma.TokenWhitelistDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenWhitelistPayload>
          }
          update: {
            args: Prisma.TokenWhitelistUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenWhitelistPayload>
          }
          deleteMany: {
            args: Prisma.TokenWhitelistDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TokenWhitelistUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TokenWhitelistUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenWhitelistPayload>[]
          }
          upsert: {
            args: Prisma.TokenWhitelistUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenWhitelistPayload>
          }
          aggregate: {
            args: Prisma.TokenWhitelistAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTokenWhitelist>
          }
          groupBy: {
            args: Prisma.TokenWhitelistGroupByArgs<ExtArgs>
            result: $Utils.Optional<TokenWhitelistGroupByOutputType>[]
          }
          count: {
            args: Prisma.TokenWhitelistCountArgs<ExtArgs>
            result: $Utils.Optional<TokenWhitelistCountAggregateOutputType> | number
          }
        }
      }
      AgentLog: {
        payload: Prisma.$AgentLogPayload<ExtArgs>
        fields: Prisma.AgentLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentLogPayload>
          }
          findFirst: {
            args: Prisma.AgentLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentLogPayload>
          }
          findMany: {
            args: Prisma.AgentLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentLogPayload>[]
          }
          create: {
            args: Prisma.AgentLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentLogPayload>
          }
          createMany: {
            args: Prisma.AgentLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentLogPayload>[]
          }
          delete: {
            args: Prisma.AgentLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentLogPayload>
          }
          update: {
            args: Prisma.AgentLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentLogPayload>
          }
          deleteMany: {
            args: Prisma.AgentLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentLogPayload>[]
          }
          upsert: {
            args: Prisma.AgentLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentLogPayload>
          }
          aggregate: {
            args: Prisma.AgentLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentLog>
          }
          groupBy: {
            args: Prisma.AgentLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentLogCountArgs<ExtArgs>
            result: $Utils.Optional<AgentLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
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
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    trade?: TradeOmit
    position?: PositionOmit
    strategyPerformance?: StrategyPerformanceOmit
    tokenWhitelist?: TokenWhitelistOmit
    agentLog?: AgentLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    trades: number
    positions: number
    performance: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trades?: boolean | UserCountOutputTypeCountTradesArgs
    positions?: boolean | UserCountOutputTypeCountPositionsArgs
    performance?: boolean | UserCountOutputTypeCountPerformanceArgs
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
  export type UserCountOutputTypeCountTradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPositionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PositionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPerformanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StrategyPerformanceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    confidenceThreshold: number | null
    maxTradeAmount: number | null
    rebalanceInterval: number | null
    stopLossPercent: number | null
    takeProfitPercent: number | null
  }

  export type UserSumAggregateOutputType = {
    confidenceThreshold: number | null
    maxTradeAmount: number | null
    rebalanceInterval: number | null
    stopLossPercent: number | null
    takeProfitPercent: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    walletAddress: string | null
    vaultAddress: string | null
    xHandle: string | null
    xUserId: string | null
    strategyType: $Enums.StrategyType | null
    confidenceThreshold: number | null
    maxTradeAmount: number | null
    autoTrade: boolean | null
    autoRebalance: boolean | null
    rebalanceInterval: number | null
    stopLossPercent: number | null
    takeProfitPercent: number | null
    riskProfile: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    walletAddress: string | null
    vaultAddress: string | null
    xHandle: string | null
    xUserId: string | null
    strategyType: $Enums.StrategyType | null
    confidenceThreshold: number | null
    maxTradeAmount: number | null
    autoTrade: boolean | null
    autoRebalance: boolean | null
    rebalanceInterval: number | null
    stopLossPercent: number | null
    takeProfitPercent: number | null
    riskProfile: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    walletAddress: number
    vaultAddress: number
    xHandle: number
    xUserId: number
    xAnalysis: number
    strategyType: number
    confidenceThreshold: number
    maxTradeAmount: number
    autoTrade: number
    autoRebalance: number
    rebalanceInterval: number
    stopLossPercent: number
    takeProfitPercent: number
    riskProfile: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    confidenceThreshold?: true
    maxTradeAmount?: true
    rebalanceInterval?: true
    stopLossPercent?: true
    takeProfitPercent?: true
  }

  export type UserSumAggregateInputType = {
    confidenceThreshold?: true
    maxTradeAmount?: true
    rebalanceInterval?: true
    stopLossPercent?: true
    takeProfitPercent?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    walletAddress?: true
    vaultAddress?: true
    xHandle?: true
    xUserId?: true
    strategyType?: true
    confidenceThreshold?: true
    maxTradeAmount?: true
    autoTrade?: true
    autoRebalance?: true
    rebalanceInterval?: true
    stopLossPercent?: true
    takeProfitPercent?: true
    riskProfile?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    walletAddress?: true
    vaultAddress?: true
    xHandle?: true
    xUserId?: true
    strategyType?: true
    confidenceThreshold?: true
    maxTradeAmount?: true
    autoTrade?: true
    autoRebalance?: true
    rebalanceInterval?: true
    stopLossPercent?: true
    takeProfitPercent?: true
    riskProfile?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    walletAddress?: true
    vaultAddress?: true
    xHandle?: true
    xUserId?: true
    xAnalysis?: true
    strategyType?: true
    confidenceThreshold?: true
    maxTradeAmount?: true
    autoTrade?: true
    autoRebalance?: true
    rebalanceInterval?: true
    stopLossPercent?: true
    takeProfitPercent?: true
    riskProfile?: true
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
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
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
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    walletAddress: string
    vaultAddress: string | null
    xHandle: string | null
    xUserId: string | null
    xAnalysis: JsonValue | null
    strategyType: $Enums.StrategyType
    confidenceThreshold: number
    maxTradeAmount: number
    autoTrade: boolean
    autoRebalance: boolean
    rebalanceInterval: number
    stopLossPercent: number | null
    takeProfitPercent: number | null
    riskProfile: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
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
    walletAddress?: boolean
    vaultAddress?: boolean
    xHandle?: boolean
    xUserId?: boolean
    xAnalysis?: boolean
    strategyType?: boolean
    confidenceThreshold?: boolean
    maxTradeAmount?: boolean
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: boolean
    stopLossPercent?: boolean
    takeProfitPercent?: boolean
    riskProfile?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    trades?: boolean | User$tradesArgs<ExtArgs>
    positions?: boolean | User$positionsArgs<ExtArgs>
    performance?: boolean | User$performanceArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletAddress?: boolean
    vaultAddress?: boolean
    xHandle?: boolean
    xUserId?: boolean
    xAnalysis?: boolean
    strategyType?: boolean
    confidenceThreshold?: boolean
    maxTradeAmount?: boolean
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: boolean
    stopLossPercent?: boolean
    takeProfitPercent?: boolean
    riskProfile?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletAddress?: boolean
    vaultAddress?: boolean
    xHandle?: boolean
    xUserId?: boolean
    xAnalysis?: boolean
    strategyType?: boolean
    confidenceThreshold?: boolean
    maxTradeAmount?: boolean
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: boolean
    stopLossPercent?: boolean
    takeProfitPercent?: boolean
    riskProfile?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    walletAddress?: boolean
    vaultAddress?: boolean
    xHandle?: boolean
    xUserId?: boolean
    xAnalysis?: boolean
    strategyType?: boolean
    confidenceThreshold?: boolean
    maxTradeAmount?: boolean
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: boolean
    stopLossPercent?: boolean
    takeProfitPercent?: boolean
    riskProfile?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletAddress" | "vaultAddress" | "xHandle" | "xUserId" | "xAnalysis" | "strategyType" | "confidenceThreshold" | "maxTradeAmount" | "autoTrade" | "autoRebalance" | "rebalanceInterval" | "stopLossPercent" | "takeProfitPercent" | "riskProfile" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trades?: boolean | User$tradesArgs<ExtArgs>
    positions?: boolean | User$positionsArgs<ExtArgs>
    performance?: boolean | User$performanceArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      trades: Prisma.$TradePayload<ExtArgs>[]
      positions: Prisma.$PositionPayload<ExtArgs>[]
      performance: Prisma.$StrategyPerformancePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      walletAddress: string
      vaultAddress: string | null
      xHandle: string | null
      xUserId: string | null
      xAnalysis: Prisma.JsonValue | null
      strategyType: $Enums.StrategyType
      confidenceThreshold: number
      maxTradeAmount: number
      autoTrade: boolean
      autoRebalance: boolean
      rebalanceInterval: number
      stopLossPercent: number | null
      takeProfitPercent: number | null
      riskProfile: string | null
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
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

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
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

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
    trades<T extends User$tradesArgs<ExtArgs> = {}>(args?: Subset<T, User$tradesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    positions<T extends User$positionsArgs<ExtArgs> = {}>(args?: Subset<T, User$positionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    performance<T extends User$performanceArgs<ExtArgs> = {}>(args?: Subset<T, User$performanceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly walletAddress: FieldRef<"User", 'String'>
    readonly vaultAddress: FieldRef<"User", 'String'>
    readonly xHandle: FieldRef<"User", 'String'>
    readonly xUserId: FieldRef<"User", 'String'>
    readonly xAnalysis: FieldRef<"User", 'Json'>
    readonly strategyType: FieldRef<"User", 'StrategyType'>
    readonly confidenceThreshold: FieldRef<"User", 'Float'>
    readonly maxTradeAmount: FieldRef<"User", 'Float'>
    readonly autoTrade: FieldRef<"User", 'Boolean'>
    readonly autoRebalance: FieldRef<"User", 'Boolean'>
    readonly rebalanceInterval: FieldRef<"User", 'Int'>
    readonly stopLossPercent: FieldRef<"User", 'Float'>
    readonly takeProfitPercent: FieldRef<"User", 'Float'>
    readonly riskProfile: FieldRef<"User", 'String'>
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
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
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
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
   * User.trades
   */
  export type User$tradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    where?: TradeWhereInput
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    cursor?: TradeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * User.positions
   */
  export type User$positionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    where?: PositionWhereInput
    orderBy?: PositionOrderByWithRelationInput | PositionOrderByWithRelationInput[]
    cursor?: PositionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PositionScalarFieldEnum | PositionScalarFieldEnum[]
  }

  /**
   * User.performance
   */
  export type User$performanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceInclude<ExtArgs> | null
    where?: StrategyPerformanceWhereInput
    orderBy?: StrategyPerformanceOrderByWithRelationInput | StrategyPerformanceOrderByWithRelationInput[]
    cursor?: StrategyPerformanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StrategyPerformanceScalarFieldEnum | StrategyPerformanceScalarFieldEnum[]
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
   * Model Trade
   */

  export type AggregateTrade = {
    _count: TradeCountAggregateOutputType | null
    _avg: TradeAvgAggregateOutputType | null
    _sum: TradeSumAggregateOutputType | null
    _min: TradeMinAggregateOutputType | null
    _max: TradeMaxAggregateOutputType | null
  }

  export type TradeAvgAggregateOutputType = {
    confidence: number | null
  }

  export type TradeSumAggregateOutputType = {
    confidence: number | null
  }

  export type TradeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    action: $Enums.TradeAction | null
    amountIn: string | null
    amountOut: string | null
    priceAtTrade: string | null
    confidence: number | null
    signalSource: string | null
    reasoning: string | null
    txHash: string | null
    status: $Enums.TradeStatus | null
    error: string | null
    createdAt: Date | null
    executedAt: Date | null
  }

  export type TradeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    action: $Enums.TradeAction | null
    amountIn: string | null
    amountOut: string | null
    priceAtTrade: string | null
    confidence: number | null
    signalSource: string | null
    reasoning: string | null
    txHash: string | null
    status: $Enums.TradeStatus | null
    error: string | null
    createdAt: Date | null
    executedAt: Date | null
  }

  export type TradeCountAggregateOutputType = {
    id: number
    userId: number
    tokenAddress: number
    tokenSymbol: number
    action: number
    amountIn: number
    amountOut: number
    priceAtTrade: number
    confidence: number
    signalSource: number
    reasoning: number
    txHash: number
    status: number
    error: number
    createdAt: number
    executedAt: number
    _all: number
  }


  export type TradeAvgAggregateInputType = {
    confidence?: true
  }

  export type TradeSumAggregateInputType = {
    confidence?: true
  }

  export type TradeMinAggregateInputType = {
    id?: true
    userId?: true
    tokenAddress?: true
    tokenSymbol?: true
    action?: true
    amountIn?: true
    amountOut?: true
    priceAtTrade?: true
    confidence?: true
    signalSource?: true
    reasoning?: true
    txHash?: true
    status?: true
    error?: true
    createdAt?: true
    executedAt?: true
  }

  export type TradeMaxAggregateInputType = {
    id?: true
    userId?: true
    tokenAddress?: true
    tokenSymbol?: true
    action?: true
    amountIn?: true
    amountOut?: true
    priceAtTrade?: true
    confidence?: true
    signalSource?: true
    reasoning?: true
    txHash?: true
    status?: true
    error?: true
    createdAt?: true
    executedAt?: true
  }

  export type TradeCountAggregateInputType = {
    id?: true
    userId?: true
    tokenAddress?: true
    tokenSymbol?: true
    action?: true
    amountIn?: true
    amountOut?: true
    priceAtTrade?: true
    confidence?: true
    signalSource?: true
    reasoning?: true
    txHash?: true
    status?: true
    error?: true
    createdAt?: true
    executedAt?: true
    _all?: true
  }

  export type TradeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trade to aggregate.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Trades
    **/
    _count?: true | TradeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradeMaxAggregateInputType
  }

  export type GetTradeAggregateType<T extends TradeAggregateArgs> = {
        [P in keyof T & keyof AggregateTrade]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrade[P]>
      : GetScalarType<T[P], AggregateTrade[P]>
  }




  export type TradeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeWhereInput
    orderBy?: TradeOrderByWithAggregationInput | TradeOrderByWithAggregationInput[]
    by: TradeScalarFieldEnum[] | TradeScalarFieldEnum
    having?: TradeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradeCountAggregateInputType | true
    _avg?: TradeAvgAggregateInputType
    _sum?: TradeSumAggregateInputType
    _min?: TradeMinAggregateInputType
    _max?: TradeMaxAggregateInputType
  }

  export type TradeGroupByOutputType = {
    id: string
    userId: string
    tokenAddress: string
    tokenSymbol: string
    action: $Enums.TradeAction
    amountIn: string
    amountOut: string
    priceAtTrade: string
    confidence: number
    signalSource: string | null
    reasoning: string | null
    txHash: string | null
    status: $Enums.TradeStatus
    error: string | null
    createdAt: Date
    executedAt: Date | null
    _count: TradeCountAggregateOutputType | null
    _avg: TradeAvgAggregateOutputType | null
    _sum: TradeSumAggregateOutputType | null
    _min: TradeMinAggregateOutputType | null
    _max: TradeMaxAggregateOutputType | null
  }

  type GetTradeGroupByPayload<T extends TradeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradeGroupByOutputType[P]>
            : GetScalarType<T[P], TradeGroupByOutputType[P]>
        }
      >
    >


  export type TradeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    action?: boolean
    amountIn?: boolean
    amountOut?: boolean
    priceAtTrade?: boolean
    confidence?: boolean
    signalSource?: boolean
    reasoning?: boolean
    txHash?: boolean
    status?: boolean
    error?: boolean
    createdAt?: boolean
    executedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trade"]>

  export type TradeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    action?: boolean
    amountIn?: boolean
    amountOut?: boolean
    priceAtTrade?: boolean
    confidence?: boolean
    signalSource?: boolean
    reasoning?: boolean
    txHash?: boolean
    status?: boolean
    error?: boolean
    createdAt?: boolean
    executedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trade"]>

  export type TradeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    action?: boolean
    amountIn?: boolean
    amountOut?: boolean
    priceAtTrade?: boolean
    confidence?: boolean
    signalSource?: boolean
    reasoning?: boolean
    txHash?: boolean
    status?: boolean
    error?: boolean
    createdAt?: boolean
    executedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trade"]>

  export type TradeSelectScalar = {
    id?: boolean
    userId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    action?: boolean
    amountIn?: boolean
    amountOut?: boolean
    priceAtTrade?: boolean
    confidence?: boolean
    signalSource?: boolean
    reasoning?: boolean
    txHash?: boolean
    status?: boolean
    error?: boolean
    createdAt?: boolean
    executedAt?: boolean
  }

  export type TradeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "tokenAddress" | "tokenSymbol" | "action" | "amountIn" | "amountOut" | "priceAtTrade" | "confidence" | "signalSource" | "reasoning" | "txHash" | "status" | "error" | "createdAt" | "executedAt", ExtArgs["result"]["trade"]>
  export type TradeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TradeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TradeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TradePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Trade"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      tokenAddress: string
      tokenSymbol: string
      action: $Enums.TradeAction
      amountIn: string
      amountOut: string
      priceAtTrade: string
      confidence: number
      signalSource: string | null
      reasoning: string | null
      txHash: string | null
      status: $Enums.TradeStatus
      error: string | null
      createdAt: Date
      executedAt: Date | null
    }, ExtArgs["result"]["trade"]>
    composites: {}
  }

  type TradeGetPayload<S extends boolean | null | undefined | TradeDefaultArgs> = $Result.GetResult<Prisma.$TradePayload, S>

  type TradeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradeCountAggregateInputType | true
    }

  export interface TradeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Trade'], meta: { name: 'Trade' } }
    /**
     * Find zero or one Trade that matches the filter.
     * @param {TradeFindUniqueArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradeFindUniqueArgs>(args: SelectSubset<T, TradeFindUniqueArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Trade that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradeFindUniqueOrThrowArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradeFindUniqueOrThrowArgs>(args: SelectSubset<T, TradeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Trade that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindFirstArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradeFindFirstArgs>(args?: SelectSubset<T, TradeFindFirstArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Trade that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindFirstOrThrowArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradeFindFirstOrThrowArgs>(args?: SelectSubset<T, TradeFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Trades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Trades
     * const trades = await prisma.trade.findMany()
     * 
     * // Get first 10 Trades
     * const trades = await prisma.trade.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradeWithIdOnly = await prisma.trade.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradeFindManyArgs>(args?: SelectSubset<T, TradeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Trade.
     * @param {TradeCreateArgs} args - Arguments to create a Trade.
     * @example
     * // Create one Trade
     * const Trade = await prisma.trade.create({
     *   data: {
     *     // ... data to create a Trade
     *   }
     * })
     * 
     */
    create<T extends TradeCreateArgs>(args: SelectSubset<T, TradeCreateArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Trades.
     * @param {TradeCreateManyArgs} args - Arguments to create many Trades.
     * @example
     * // Create many Trades
     * const trade = await prisma.trade.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradeCreateManyArgs>(args?: SelectSubset<T, TradeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Trades and returns the data saved in the database.
     * @param {TradeCreateManyAndReturnArgs} args - Arguments to create many Trades.
     * @example
     * // Create many Trades
     * const trade = await prisma.trade.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Trades and only return the `id`
     * const tradeWithIdOnly = await prisma.trade.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradeCreateManyAndReturnArgs>(args?: SelectSubset<T, TradeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Trade.
     * @param {TradeDeleteArgs} args - Arguments to delete one Trade.
     * @example
     * // Delete one Trade
     * const Trade = await prisma.trade.delete({
     *   where: {
     *     // ... filter to delete one Trade
     *   }
     * })
     * 
     */
    delete<T extends TradeDeleteArgs>(args: SelectSubset<T, TradeDeleteArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Trade.
     * @param {TradeUpdateArgs} args - Arguments to update one Trade.
     * @example
     * // Update one Trade
     * const trade = await prisma.trade.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradeUpdateArgs>(args: SelectSubset<T, TradeUpdateArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Trades.
     * @param {TradeDeleteManyArgs} args - Arguments to filter Trades to delete.
     * @example
     * // Delete a few Trades
     * const { count } = await prisma.trade.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradeDeleteManyArgs>(args?: SelectSubset<T, TradeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Trades
     * const trade = await prisma.trade.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradeUpdateManyArgs>(args: SelectSubset<T, TradeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trades and returns the data updated in the database.
     * @param {TradeUpdateManyAndReturnArgs} args - Arguments to update many Trades.
     * @example
     * // Update many Trades
     * const trade = await prisma.trade.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Trades and only return the `id`
     * const tradeWithIdOnly = await prisma.trade.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TradeUpdateManyAndReturnArgs>(args: SelectSubset<T, TradeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Trade.
     * @param {TradeUpsertArgs} args - Arguments to update or create a Trade.
     * @example
     * // Update or create a Trade
     * const trade = await prisma.trade.upsert({
     *   create: {
     *     // ... data to create a Trade
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Trade we want to update
     *   }
     * })
     */
    upsert<T extends TradeUpsertArgs>(args: SelectSubset<T, TradeUpsertArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Trades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeCountArgs} args - Arguments to filter Trades to count.
     * @example
     * // Count the number of Trades
     * const count = await prisma.trade.count({
     *   where: {
     *     // ... the filter for the Trades we want to count
     *   }
     * })
    **/
    count<T extends TradeCountArgs>(
      args?: Subset<T, TradeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Trade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TradeAggregateArgs>(args: Subset<T, TradeAggregateArgs>): Prisma.PrismaPromise<GetTradeAggregateType<T>>

    /**
     * Group by Trade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeGroupByArgs} args - Group by arguments.
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
      T extends TradeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradeGroupByArgs['orderBy'] }
        : { orderBy?: TradeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TradeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Trade model
   */
  readonly fields: TradeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Trade.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Trade model
   */
  interface TradeFieldRefs {
    readonly id: FieldRef<"Trade", 'String'>
    readonly userId: FieldRef<"Trade", 'String'>
    readonly tokenAddress: FieldRef<"Trade", 'String'>
    readonly tokenSymbol: FieldRef<"Trade", 'String'>
    readonly action: FieldRef<"Trade", 'TradeAction'>
    readonly amountIn: FieldRef<"Trade", 'String'>
    readonly amountOut: FieldRef<"Trade", 'String'>
    readonly priceAtTrade: FieldRef<"Trade", 'String'>
    readonly confidence: FieldRef<"Trade", 'Float'>
    readonly signalSource: FieldRef<"Trade", 'String'>
    readonly reasoning: FieldRef<"Trade", 'String'>
    readonly txHash: FieldRef<"Trade", 'String'>
    readonly status: FieldRef<"Trade", 'TradeStatus'>
    readonly error: FieldRef<"Trade", 'String'>
    readonly createdAt: FieldRef<"Trade", 'DateTime'>
    readonly executedAt: FieldRef<"Trade", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Trade findUnique
   */
  export type TradeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade findUniqueOrThrow
   */
  export type TradeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade findFirst
   */
  export type TradeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trades.
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trades.
     */
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * Trade findFirstOrThrow
   */
  export type TradeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trades.
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trades.
     */
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * Trade findMany
   */
  export type TradeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trades to fetch.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Trades.
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * Trade create
   */
  export type TradeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * The data needed to create a Trade.
     */
    data: XOR<TradeCreateInput, TradeUncheckedCreateInput>
  }

  /**
   * Trade createMany
   */
  export type TradeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Trades.
     */
    data: TradeCreateManyInput | TradeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Trade createManyAndReturn
   */
  export type TradeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * The data used to create many Trades.
     */
    data: TradeCreateManyInput | TradeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Trade update
   */
  export type TradeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * The data needed to update a Trade.
     */
    data: XOR<TradeUpdateInput, TradeUncheckedUpdateInput>
    /**
     * Choose, which Trade to update.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade updateMany
   */
  export type TradeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Trades.
     */
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyInput>
    /**
     * Filter which Trades to update
     */
    where?: TradeWhereInput
    /**
     * Limit how many Trades to update.
     */
    limit?: number
  }

  /**
   * Trade updateManyAndReturn
   */
  export type TradeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * The data used to update Trades.
     */
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyInput>
    /**
     * Filter which Trades to update
     */
    where?: TradeWhereInput
    /**
     * Limit how many Trades to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Trade upsert
   */
  export type TradeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * The filter to search for the Trade to update in case it exists.
     */
    where: TradeWhereUniqueInput
    /**
     * In case the Trade found by the `where` argument doesn't exist, create a new Trade with this data.
     */
    create: XOR<TradeCreateInput, TradeUncheckedCreateInput>
    /**
     * In case the Trade was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradeUpdateInput, TradeUncheckedUpdateInput>
  }

  /**
   * Trade delete
   */
  export type TradeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter which Trade to delete.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade deleteMany
   */
  export type TradeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trades to delete
     */
    where?: TradeWhereInput
    /**
     * Limit how many Trades to delete.
     */
    limit?: number
  }

  /**
   * Trade without action
   */
  export type TradeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trade
     */
    omit?: TradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
  }


  /**
   * Model Position
   */

  export type AggregatePosition = {
    _count: PositionCountAggregateOutputType | null
    _avg: PositionAvgAggregateOutputType | null
    _sum: PositionSumAggregateOutputType | null
    _min: PositionMinAggregateOutputType | null
    _max: PositionMaxAggregateOutputType | null
  }

  export type PositionAvgAggregateOutputType = {
    unrealizedPnlPct: number | null
    targetAllocation: number | null
  }

  export type PositionSumAggregateOutputType = {
    unrealizedPnlPct: number | null
    targetAllocation: number | null
  }

  export type PositionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    balance: string | null
    costBasis: string | null
    entryPrice: string | null
    currentPrice: string | null
    currentValue: string | null
    unrealizedPnl: string | null
    unrealizedPnlPct: number | null
    targetAllocation: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PositionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    balance: string | null
    costBasis: string | null
    entryPrice: string | null
    currentPrice: string | null
    currentValue: string | null
    unrealizedPnl: string | null
    unrealizedPnlPct: number | null
    targetAllocation: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PositionCountAggregateOutputType = {
    id: number
    userId: number
    tokenAddress: number
    tokenSymbol: number
    balance: number
    costBasis: number
    entryPrice: number
    currentPrice: number
    currentValue: number
    unrealizedPnl: number
    unrealizedPnlPct: number
    targetAllocation: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PositionAvgAggregateInputType = {
    unrealizedPnlPct?: true
    targetAllocation?: true
  }

  export type PositionSumAggregateInputType = {
    unrealizedPnlPct?: true
    targetAllocation?: true
  }

  export type PositionMinAggregateInputType = {
    id?: true
    userId?: true
    tokenAddress?: true
    tokenSymbol?: true
    balance?: true
    costBasis?: true
    entryPrice?: true
    currentPrice?: true
    currentValue?: true
    unrealizedPnl?: true
    unrealizedPnlPct?: true
    targetAllocation?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PositionMaxAggregateInputType = {
    id?: true
    userId?: true
    tokenAddress?: true
    tokenSymbol?: true
    balance?: true
    costBasis?: true
    entryPrice?: true
    currentPrice?: true
    currentValue?: true
    unrealizedPnl?: true
    unrealizedPnlPct?: true
    targetAllocation?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PositionCountAggregateInputType = {
    id?: true
    userId?: true
    tokenAddress?: true
    tokenSymbol?: true
    balance?: true
    costBasis?: true
    entryPrice?: true
    currentPrice?: true
    currentValue?: true
    unrealizedPnl?: true
    unrealizedPnlPct?: true
    targetAllocation?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PositionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Position to aggregate.
     */
    where?: PositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Positions to fetch.
     */
    orderBy?: PositionOrderByWithRelationInput | PositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Positions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Positions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Positions
    **/
    _count?: true | PositionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PositionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PositionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PositionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PositionMaxAggregateInputType
  }

  export type GetPositionAggregateType<T extends PositionAggregateArgs> = {
        [P in keyof T & keyof AggregatePosition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePosition[P]>
      : GetScalarType<T[P], AggregatePosition[P]>
  }




  export type PositionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PositionWhereInput
    orderBy?: PositionOrderByWithAggregationInput | PositionOrderByWithAggregationInput[]
    by: PositionScalarFieldEnum[] | PositionScalarFieldEnum
    having?: PositionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PositionCountAggregateInputType | true
    _avg?: PositionAvgAggregateInputType
    _sum?: PositionSumAggregateInputType
    _min?: PositionMinAggregateInputType
    _max?: PositionMaxAggregateInputType
  }

  export type PositionGroupByOutputType = {
    id: string
    userId: string
    tokenAddress: string
    tokenSymbol: string
    balance: string
    costBasis: string
    entryPrice: string
    currentPrice: string
    currentValue: string
    unrealizedPnl: string
    unrealizedPnlPct: number
    targetAllocation: number | null
    createdAt: Date
    updatedAt: Date
    _count: PositionCountAggregateOutputType | null
    _avg: PositionAvgAggregateOutputType | null
    _sum: PositionSumAggregateOutputType | null
    _min: PositionMinAggregateOutputType | null
    _max: PositionMaxAggregateOutputType | null
  }

  type GetPositionGroupByPayload<T extends PositionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PositionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PositionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PositionGroupByOutputType[P]>
            : GetScalarType<T[P], PositionGroupByOutputType[P]>
        }
      >
    >


  export type PositionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    balance?: boolean
    costBasis?: boolean
    entryPrice?: boolean
    currentPrice?: boolean
    currentValue?: boolean
    unrealizedPnl?: boolean
    unrealizedPnlPct?: boolean
    targetAllocation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["position"]>

  export type PositionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    balance?: boolean
    costBasis?: boolean
    entryPrice?: boolean
    currentPrice?: boolean
    currentValue?: boolean
    unrealizedPnl?: boolean
    unrealizedPnlPct?: boolean
    targetAllocation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["position"]>

  export type PositionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    balance?: boolean
    costBasis?: boolean
    entryPrice?: boolean
    currentPrice?: boolean
    currentValue?: boolean
    unrealizedPnl?: boolean
    unrealizedPnlPct?: boolean
    targetAllocation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["position"]>

  export type PositionSelectScalar = {
    id?: boolean
    userId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    balance?: boolean
    costBasis?: boolean
    entryPrice?: boolean
    currentPrice?: boolean
    currentValue?: boolean
    unrealizedPnl?: boolean
    unrealizedPnlPct?: boolean
    targetAllocation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PositionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "tokenAddress" | "tokenSymbol" | "balance" | "costBasis" | "entryPrice" | "currentPrice" | "currentValue" | "unrealizedPnl" | "unrealizedPnlPct" | "targetAllocation" | "createdAt" | "updatedAt", ExtArgs["result"]["position"]>
  export type PositionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PositionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PositionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PositionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Position"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      tokenAddress: string
      tokenSymbol: string
      balance: string
      costBasis: string
      entryPrice: string
      currentPrice: string
      currentValue: string
      unrealizedPnl: string
      unrealizedPnlPct: number
      targetAllocation: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["position"]>
    composites: {}
  }

  type PositionGetPayload<S extends boolean | null | undefined | PositionDefaultArgs> = $Result.GetResult<Prisma.$PositionPayload, S>

  type PositionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PositionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PositionCountAggregateInputType | true
    }

  export interface PositionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Position'], meta: { name: 'Position' } }
    /**
     * Find zero or one Position that matches the filter.
     * @param {PositionFindUniqueArgs} args - Arguments to find a Position
     * @example
     * // Get one Position
     * const position = await prisma.position.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PositionFindUniqueArgs>(args: SelectSubset<T, PositionFindUniqueArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Position that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PositionFindUniqueOrThrowArgs} args - Arguments to find a Position
     * @example
     * // Get one Position
     * const position = await prisma.position.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PositionFindUniqueOrThrowArgs>(args: SelectSubset<T, PositionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Position that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionFindFirstArgs} args - Arguments to find a Position
     * @example
     * // Get one Position
     * const position = await prisma.position.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PositionFindFirstArgs>(args?: SelectSubset<T, PositionFindFirstArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Position that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionFindFirstOrThrowArgs} args - Arguments to find a Position
     * @example
     * // Get one Position
     * const position = await prisma.position.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PositionFindFirstOrThrowArgs>(args?: SelectSubset<T, PositionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Positions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Positions
     * const positions = await prisma.position.findMany()
     * 
     * // Get first 10 Positions
     * const positions = await prisma.position.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const positionWithIdOnly = await prisma.position.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PositionFindManyArgs>(args?: SelectSubset<T, PositionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Position.
     * @param {PositionCreateArgs} args - Arguments to create a Position.
     * @example
     * // Create one Position
     * const Position = await prisma.position.create({
     *   data: {
     *     // ... data to create a Position
     *   }
     * })
     * 
     */
    create<T extends PositionCreateArgs>(args: SelectSubset<T, PositionCreateArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Positions.
     * @param {PositionCreateManyArgs} args - Arguments to create many Positions.
     * @example
     * // Create many Positions
     * const position = await prisma.position.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PositionCreateManyArgs>(args?: SelectSubset<T, PositionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Positions and returns the data saved in the database.
     * @param {PositionCreateManyAndReturnArgs} args - Arguments to create many Positions.
     * @example
     * // Create many Positions
     * const position = await prisma.position.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Positions and only return the `id`
     * const positionWithIdOnly = await prisma.position.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PositionCreateManyAndReturnArgs>(args?: SelectSubset<T, PositionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Position.
     * @param {PositionDeleteArgs} args - Arguments to delete one Position.
     * @example
     * // Delete one Position
     * const Position = await prisma.position.delete({
     *   where: {
     *     // ... filter to delete one Position
     *   }
     * })
     * 
     */
    delete<T extends PositionDeleteArgs>(args: SelectSubset<T, PositionDeleteArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Position.
     * @param {PositionUpdateArgs} args - Arguments to update one Position.
     * @example
     * // Update one Position
     * const position = await prisma.position.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PositionUpdateArgs>(args: SelectSubset<T, PositionUpdateArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Positions.
     * @param {PositionDeleteManyArgs} args - Arguments to filter Positions to delete.
     * @example
     * // Delete a few Positions
     * const { count } = await prisma.position.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PositionDeleteManyArgs>(args?: SelectSubset<T, PositionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Positions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Positions
     * const position = await prisma.position.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PositionUpdateManyArgs>(args: SelectSubset<T, PositionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Positions and returns the data updated in the database.
     * @param {PositionUpdateManyAndReturnArgs} args - Arguments to update many Positions.
     * @example
     * // Update many Positions
     * const position = await prisma.position.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Positions and only return the `id`
     * const positionWithIdOnly = await prisma.position.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PositionUpdateManyAndReturnArgs>(args: SelectSubset<T, PositionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Position.
     * @param {PositionUpsertArgs} args - Arguments to update or create a Position.
     * @example
     * // Update or create a Position
     * const position = await prisma.position.upsert({
     *   create: {
     *     // ... data to create a Position
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Position we want to update
     *   }
     * })
     */
    upsert<T extends PositionUpsertArgs>(args: SelectSubset<T, PositionUpsertArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Positions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionCountArgs} args - Arguments to filter Positions to count.
     * @example
     * // Count the number of Positions
     * const count = await prisma.position.count({
     *   where: {
     *     // ... the filter for the Positions we want to count
     *   }
     * })
    **/
    count<T extends PositionCountArgs>(
      args?: Subset<T, PositionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PositionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Position.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PositionAggregateArgs>(args: Subset<T, PositionAggregateArgs>): Prisma.PrismaPromise<GetPositionAggregateType<T>>

    /**
     * Group by Position.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionGroupByArgs} args - Group by arguments.
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
      T extends PositionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PositionGroupByArgs['orderBy'] }
        : { orderBy?: PositionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PositionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPositionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Position model
   */
  readonly fields: PositionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Position.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PositionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Position model
   */
  interface PositionFieldRefs {
    readonly id: FieldRef<"Position", 'String'>
    readonly userId: FieldRef<"Position", 'String'>
    readonly tokenAddress: FieldRef<"Position", 'String'>
    readonly tokenSymbol: FieldRef<"Position", 'String'>
    readonly balance: FieldRef<"Position", 'String'>
    readonly costBasis: FieldRef<"Position", 'String'>
    readonly entryPrice: FieldRef<"Position", 'String'>
    readonly currentPrice: FieldRef<"Position", 'String'>
    readonly currentValue: FieldRef<"Position", 'String'>
    readonly unrealizedPnl: FieldRef<"Position", 'String'>
    readonly unrealizedPnlPct: FieldRef<"Position", 'Float'>
    readonly targetAllocation: FieldRef<"Position", 'Float'>
    readonly createdAt: FieldRef<"Position", 'DateTime'>
    readonly updatedAt: FieldRef<"Position", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Position findUnique
   */
  export type PositionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter, which Position to fetch.
     */
    where: PositionWhereUniqueInput
  }

  /**
   * Position findUniqueOrThrow
   */
  export type PositionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter, which Position to fetch.
     */
    where: PositionWhereUniqueInput
  }

  /**
   * Position findFirst
   */
  export type PositionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter, which Position to fetch.
     */
    where?: PositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Positions to fetch.
     */
    orderBy?: PositionOrderByWithRelationInput | PositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Positions.
     */
    cursor?: PositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Positions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Positions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Positions.
     */
    distinct?: PositionScalarFieldEnum | PositionScalarFieldEnum[]
  }

  /**
   * Position findFirstOrThrow
   */
  export type PositionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter, which Position to fetch.
     */
    where?: PositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Positions to fetch.
     */
    orderBy?: PositionOrderByWithRelationInput | PositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Positions.
     */
    cursor?: PositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Positions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Positions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Positions.
     */
    distinct?: PositionScalarFieldEnum | PositionScalarFieldEnum[]
  }

  /**
   * Position findMany
   */
  export type PositionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter, which Positions to fetch.
     */
    where?: PositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Positions to fetch.
     */
    orderBy?: PositionOrderByWithRelationInput | PositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Positions.
     */
    cursor?: PositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Positions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Positions.
     */
    skip?: number
    distinct?: PositionScalarFieldEnum | PositionScalarFieldEnum[]
  }

  /**
   * Position create
   */
  export type PositionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * The data needed to create a Position.
     */
    data: XOR<PositionCreateInput, PositionUncheckedCreateInput>
  }

  /**
   * Position createMany
   */
  export type PositionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Positions.
     */
    data: PositionCreateManyInput | PositionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Position createManyAndReturn
   */
  export type PositionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * The data used to create many Positions.
     */
    data: PositionCreateManyInput | PositionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Position update
   */
  export type PositionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * The data needed to update a Position.
     */
    data: XOR<PositionUpdateInput, PositionUncheckedUpdateInput>
    /**
     * Choose, which Position to update.
     */
    where: PositionWhereUniqueInput
  }

  /**
   * Position updateMany
   */
  export type PositionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Positions.
     */
    data: XOR<PositionUpdateManyMutationInput, PositionUncheckedUpdateManyInput>
    /**
     * Filter which Positions to update
     */
    where?: PositionWhereInput
    /**
     * Limit how many Positions to update.
     */
    limit?: number
  }

  /**
   * Position updateManyAndReturn
   */
  export type PositionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * The data used to update Positions.
     */
    data: XOR<PositionUpdateManyMutationInput, PositionUncheckedUpdateManyInput>
    /**
     * Filter which Positions to update
     */
    where?: PositionWhereInput
    /**
     * Limit how many Positions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Position upsert
   */
  export type PositionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * The filter to search for the Position to update in case it exists.
     */
    where: PositionWhereUniqueInput
    /**
     * In case the Position found by the `where` argument doesn't exist, create a new Position with this data.
     */
    create: XOR<PositionCreateInput, PositionUncheckedCreateInput>
    /**
     * In case the Position was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PositionUpdateInput, PositionUncheckedUpdateInput>
  }

  /**
   * Position delete
   */
  export type PositionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter which Position to delete.
     */
    where: PositionWhereUniqueInput
  }

  /**
   * Position deleteMany
   */
  export type PositionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Positions to delete
     */
    where?: PositionWhereInput
    /**
     * Limit how many Positions to delete.
     */
    limit?: number
  }

  /**
   * Position without action
   */
  export type PositionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Position
     */
    omit?: PositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
  }


  /**
   * Model StrategyPerformance
   */

  export type AggregateStrategyPerformance = {
    _count: StrategyPerformanceCountAggregateOutputType | null
    _avg: StrategyPerformanceAvgAggregateOutputType | null
    _sum: StrategyPerformanceSumAggregateOutputType | null
    _min: StrategyPerformanceMinAggregateOutputType | null
    _max: StrategyPerformanceMaxAggregateOutputType | null
  }

  export type StrategyPerformanceAvgAggregateOutputType = {
    tradesCount: number | null
    winCount: number | null
    lossCount: number | null
    winRate: number | null
    totalPnlPct: number | null
  }

  export type StrategyPerformanceSumAggregateOutputType = {
    tradesCount: number | null
    winCount: number | null
    lossCount: number | null
    winRate: number | null
    totalPnlPct: number | null
  }

  export type StrategyPerformanceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    strategyType: $Enums.StrategyType | null
    periodStart: Date | null
    periodEnd: Date | null
    tradesCount: number | null
    winCount: number | null
    lossCount: number | null
    winRate: number | null
    totalPnl: string | null
    totalPnlPct: number | null
    bestTrade: string | null
    worstTrade: string | null
    avgTradeSize: string | null
    createdAt: Date | null
  }

  export type StrategyPerformanceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    strategyType: $Enums.StrategyType | null
    periodStart: Date | null
    periodEnd: Date | null
    tradesCount: number | null
    winCount: number | null
    lossCount: number | null
    winRate: number | null
    totalPnl: string | null
    totalPnlPct: number | null
    bestTrade: string | null
    worstTrade: string | null
    avgTradeSize: string | null
    createdAt: Date | null
  }

  export type StrategyPerformanceCountAggregateOutputType = {
    id: number
    userId: number
    strategyType: number
    periodStart: number
    periodEnd: number
    tradesCount: number
    winCount: number
    lossCount: number
    winRate: number
    totalPnl: number
    totalPnlPct: number
    bestTrade: number
    worstTrade: number
    avgTradeSize: number
    createdAt: number
    _all: number
  }


  export type StrategyPerformanceAvgAggregateInputType = {
    tradesCount?: true
    winCount?: true
    lossCount?: true
    winRate?: true
    totalPnlPct?: true
  }

  export type StrategyPerformanceSumAggregateInputType = {
    tradesCount?: true
    winCount?: true
    lossCount?: true
    winRate?: true
    totalPnlPct?: true
  }

  export type StrategyPerformanceMinAggregateInputType = {
    id?: true
    userId?: true
    strategyType?: true
    periodStart?: true
    periodEnd?: true
    tradesCount?: true
    winCount?: true
    lossCount?: true
    winRate?: true
    totalPnl?: true
    totalPnlPct?: true
    bestTrade?: true
    worstTrade?: true
    avgTradeSize?: true
    createdAt?: true
  }

  export type StrategyPerformanceMaxAggregateInputType = {
    id?: true
    userId?: true
    strategyType?: true
    periodStart?: true
    periodEnd?: true
    tradesCount?: true
    winCount?: true
    lossCount?: true
    winRate?: true
    totalPnl?: true
    totalPnlPct?: true
    bestTrade?: true
    worstTrade?: true
    avgTradeSize?: true
    createdAt?: true
  }

  export type StrategyPerformanceCountAggregateInputType = {
    id?: true
    userId?: true
    strategyType?: true
    periodStart?: true
    periodEnd?: true
    tradesCount?: true
    winCount?: true
    lossCount?: true
    winRate?: true
    totalPnl?: true
    totalPnlPct?: true
    bestTrade?: true
    worstTrade?: true
    avgTradeSize?: true
    createdAt?: true
    _all?: true
  }

  export type StrategyPerformanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StrategyPerformance to aggregate.
     */
    where?: StrategyPerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StrategyPerformances to fetch.
     */
    orderBy?: StrategyPerformanceOrderByWithRelationInput | StrategyPerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StrategyPerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StrategyPerformances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StrategyPerformances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StrategyPerformances
    **/
    _count?: true | StrategyPerformanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StrategyPerformanceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StrategyPerformanceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StrategyPerformanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StrategyPerformanceMaxAggregateInputType
  }

  export type GetStrategyPerformanceAggregateType<T extends StrategyPerformanceAggregateArgs> = {
        [P in keyof T & keyof AggregateStrategyPerformance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStrategyPerformance[P]>
      : GetScalarType<T[P], AggregateStrategyPerformance[P]>
  }




  export type StrategyPerformanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StrategyPerformanceWhereInput
    orderBy?: StrategyPerformanceOrderByWithAggregationInput | StrategyPerformanceOrderByWithAggregationInput[]
    by: StrategyPerformanceScalarFieldEnum[] | StrategyPerformanceScalarFieldEnum
    having?: StrategyPerformanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StrategyPerformanceCountAggregateInputType | true
    _avg?: StrategyPerformanceAvgAggregateInputType
    _sum?: StrategyPerformanceSumAggregateInputType
    _min?: StrategyPerformanceMinAggregateInputType
    _max?: StrategyPerformanceMaxAggregateInputType
  }

  export type StrategyPerformanceGroupByOutputType = {
    id: string
    userId: string
    strategyType: $Enums.StrategyType
    periodStart: Date
    periodEnd: Date
    tradesCount: number
    winCount: number
    lossCount: number
    winRate: number
    totalPnl: string
    totalPnlPct: number
    bestTrade: string | null
    worstTrade: string | null
    avgTradeSize: string | null
    createdAt: Date
    _count: StrategyPerformanceCountAggregateOutputType | null
    _avg: StrategyPerformanceAvgAggregateOutputType | null
    _sum: StrategyPerformanceSumAggregateOutputType | null
    _min: StrategyPerformanceMinAggregateOutputType | null
    _max: StrategyPerformanceMaxAggregateOutputType | null
  }

  type GetStrategyPerformanceGroupByPayload<T extends StrategyPerformanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StrategyPerformanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StrategyPerformanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StrategyPerformanceGroupByOutputType[P]>
            : GetScalarType<T[P], StrategyPerformanceGroupByOutputType[P]>
        }
      >
    >


  export type StrategyPerformanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    strategyType?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    tradesCount?: boolean
    winCount?: boolean
    lossCount?: boolean
    winRate?: boolean
    totalPnl?: boolean
    totalPnlPct?: boolean
    bestTrade?: boolean
    worstTrade?: boolean
    avgTradeSize?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["strategyPerformance"]>

  export type StrategyPerformanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    strategyType?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    tradesCount?: boolean
    winCount?: boolean
    lossCount?: boolean
    winRate?: boolean
    totalPnl?: boolean
    totalPnlPct?: boolean
    bestTrade?: boolean
    worstTrade?: boolean
    avgTradeSize?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["strategyPerformance"]>

  export type StrategyPerformanceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    strategyType?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    tradesCount?: boolean
    winCount?: boolean
    lossCount?: boolean
    winRate?: boolean
    totalPnl?: boolean
    totalPnlPct?: boolean
    bestTrade?: boolean
    worstTrade?: boolean
    avgTradeSize?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["strategyPerformance"]>

  export type StrategyPerformanceSelectScalar = {
    id?: boolean
    userId?: boolean
    strategyType?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    tradesCount?: boolean
    winCount?: boolean
    lossCount?: boolean
    winRate?: boolean
    totalPnl?: boolean
    totalPnlPct?: boolean
    bestTrade?: boolean
    worstTrade?: boolean
    avgTradeSize?: boolean
    createdAt?: boolean
  }

  export type StrategyPerformanceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "strategyType" | "periodStart" | "periodEnd" | "tradesCount" | "winCount" | "lossCount" | "winRate" | "totalPnl" | "totalPnlPct" | "bestTrade" | "worstTrade" | "avgTradeSize" | "createdAt", ExtArgs["result"]["strategyPerformance"]>
  export type StrategyPerformanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type StrategyPerformanceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type StrategyPerformanceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $StrategyPerformancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StrategyPerformance"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      strategyType: $Enums.StrategyType
      periodStart: Date
      periodEnd: Date
      tradesCount: number
      winCount: number
      lossCount: number
      winRate: number
      totalPnl: string
      totalPnlPct: number
      bestTrade: string | null
      worstTrade: string | null
      avgTradeSize: string | null
      createdAt: Date
    }, ExtArgs["result"]["strategyPerformance"]>
    composites: {}
  }

  type StrategyPerformanceGetPayload<S extends boolean | null | undefined | StrategyPerformanceDefaultArgs> = $Result.GetResult<Prisma.$StrategyPerformancePayload, S>

  type StrategyPerformanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StrategyPerformanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StrategyPerformanceCountAggregateInputType | true
    }

  export interface StrategyPerformanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StrategyPerformance'], meta: { name: 'StrategyPerformance' } }
    /**
     * Find zero or one StrategyPerformance that matches the filter.
     * @param {StrategyPerformanceFindUniqueArgs} args - Arguments to find a StrategyPerformance
     * @example
     * // Get one StrategyPerformance
     * const strategyPerformance = await prisma.strategyPerformance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StrategyPerformanceFindUniqueArgs>(args: SelectSubset<T, StrategyPerformanceFindUniqueArgs<ExtArgs>>): Prisma__StrategyPerformanceClient<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StrategyPerformance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StrategyPerformanceFindUniqueOrThrowArgs} args - Arguments to find a StrategyPerformance
     * @example
     * // Get one StrategyPerformance
     * const strategyPerformance = await prisma.strategyPerformance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StrategyPerformanceFindUniqueOrThrowArgs>(args: SelectSubset<T, StrategyPerformanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StrategyPerformanceClient<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StrategyPerformance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyPerformanceFindFirstArgs} args - Arguments to find a StrategyPerformance
     * @example
     * // Get one StrategyPerformance
     * const strategyPerformance = await prisma.strategyPerformance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StrategyPerformanceFindFirstArgs>(args?: SelectSubset<T, StrategyPerformanceFindFirstArgs<ExtArgs>>): Prisma__StrategyPerformanceClient<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StrategyPerformance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyPerformanceFindFirstOrThrowArgs} args - Arguments to find a StrategyPerformance
     * @example
     * // Get one StrategyPerformance
     * const strategyPerformance = await prisma.strategyPerformance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StrategyPerformanceFindFirstOrThrowArgs>(args?: SelectSubset<T, StrategyPerformanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__StrategyPerformanceClient<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StrategyPerformances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyPerformanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StrategyPerformances
     * const strategyPerformances = await prisma.strategyPerformance.findMany()
     * 
     * // Get first 10 StrategyPerformances
     * const strategyPerformances = await prisma.strategyPerformance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const strategyPerformanceWithIdOnly = await prisma.strategyPerformance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StrategyPerformanceFindManyArgs>(args?: SelectSubset<T, StrategyPerformanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StrategyPerformance.
     * @param {StrategyPerformanceCreateArgs} args - Arguments to create a StrategyPerformance.
     * @example
     * // Create one StrategyPerformance
     * const StrategyPerformance = await prisma.strategyPerformance.create({
     *   data: {
     *     // ... data to create a StrategyPerformance
     *   }
     * })
     * 
     */
    create<T extends StrategyPerformanceCreateArgs>(args: SelectSubset<T, StrategyPerformanceCreateArgs<ExtArgs>>): Prisma__StrategyPerformanceClient<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StrategyPerformances.
     * @param {StrategyPerformanceCreateManyArgs} args - Arguments to create many StrategyPerformances.
     * @example
     * // Create many StrategyPerformances
     * const strategyPerformance = await prisma.strategyPerformance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StrategyPerformanceCreateManyArgs>(args?: SelectSubset<T, StrategyPerformanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StrategyPerformances and returns the data saved in the database.
     * @param {StrategyPerformanceCreateManyAndReturnArgs} args - Arguments to create many StrategyPerformances.
     * @example
     * // Create many StrategyPerformances
     * const strategyPerformance = await prisma.strategyPerformance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StrategyPerformances and only return the `id`
     * const strategyPerformanceWithIdOnly = await prisma.strategyPerformance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StrategyPerformanceCreateManyAndReturnArgs>(args?: SelectSubset<T, StrategyPerformanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StrategyPerformance.
     * @param {StrategyPerformanceDeleteArgs} args - Arguments to delete one StrategyPerformance.
     * @example
     * // Delete one StrategyPerformance
     * const StrategyPerformance = await prisma.strategyPerformance.delete({
     *   where: {
     *     // ... filter to delete one StrategyPerformance
     *   }
     * })
     * 
     */
    delete<T extends StrategyPerformanceDeleteArgs>(args: SelectSubset<T, StrategyPerformanceDeleteArgs<ExtArgs>>): Prisma__StrategyPerformanceClient<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StrategyPerformance.
     * @param {StrategyPerformanceUpdateArgs} args - Arguments to update one StrategyPerformance.
     * @example
     * // Update one StrategyPerformance
     * const strategyPerformance = await prisma.strategyPerformance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StrategyPerformanceUpdateArgs>(args: SelectSubset<T, StrategyPerformanceUpdateArgs<ExtArgs>>): Prisma__StrategyPerformanceClient<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StrategyPerformances.
     * @param {StrategyPerformanceDeleteManyArgs} args - Arguments to filter StrategyPerformances to delete.
     * @example
     * // Delete a few StrategyPerformances
     * const { count } = await prisma.strategyPerformance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StrategyPerformanceDeleteManyArgs>(args?: SelectSubset<T, StrategyPerformanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StrategyPerformances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyPerformanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StrategyPerformances
     * const strategyPerformance = await prisma.strategyPerformance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StrategyPerformanceUpdateManyArgs>(args: SelectSubset<T, StrategyPerformanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StrategyPerformances and returns the data updated in the database.
     * @param {StrategyPerformanceUpdateManyAndReturnArgs} args - Arguments to update many StrategyPerformances.
     * @example
     * // Update many StrategyPerformances
     * const strategyPerformance = await prisma.strategyPerformance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StrategyPerformances and only return the `id`
     * const strategyPerformanceWithIdOnly = await prisma.strategyPerformance.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StrategyPerformanceUpdateManyAndReturnArgs>(args: SelectSubset<T, StrategyPerformanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StrategyPerformance.
     * @param {StrategyPerformanceUpsertArgs} args - Arguments to update or create a StrategyPerformance.
     * @example
     * // Update or create a StrategyPerformance
     * const strategyPerformance = await prisma.strategyPerformance.upsert({
     *   create: {
     *     // ... data to create a StrategyPerformance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StrategyPerformance we want to update
     *   }
     * })
     */
    upsert<T extends StrategyPerformanceUpsertArgs>(args: SelectSubset<T, StrategyPerformanceUpsertArgs<ExtArgs>>): Prisma__StrategyPerformanceClient<$Result.GetResult<Prisma.$StrategyPerformancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StrategyPerformances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyPerformanceCountArgs} args - Arguments to filter StrategyPerformances to count.
     * @example
     * // Count the number of StrategyPerformances
     * const count = await prisma.strategyPerformance.count({
     *   where: {
     *     // ... the filter for the StrategyPerformances we want to count
     *   }
     * })
    **/
    count<T extends StrategyPerformanceCountArgs>(
      args?: Subset<T, StrategyPerformanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StrategyPerformanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StrategyPerformance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyPerformanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StrategyPerformanceAggregateArgs>(args: Subset<T, StrategyPerformanceAggregateArgs>): Prisma.PrismaPromise<GetStrategyPerformanceAggregateType<T>>

    /**
     * Group by StrategyPerformance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyPerformanceGroupByArgs} args - Group by arguments.
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
      T extends StrategyPerformanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StrategyPerformanceGroupByArgs['orderBy'] }
        : { orderBy?: StrategyPerformanceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StrategyPerformanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStrategyPerformanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StrategyPerformance model
   */
  readonly fields: StrategyPerformanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StrategyPerformance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StrategyPerformanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the StrategyPerformance model
   */
  interface StrategyPerformanceFieldRefs {
    readonly id: FieldRef<"StrategyPerformance", 'String'>
    readonly userId: FieldRef<"StrategyPerformance", 'String'>
    readonly strategyType: FieldRef<"StrategyPerformance", 'StrategyType'>
    readonly periodStart: FieldRef<"StrategyPerformance", 'DateTime'>
    readonly periodEnd: FieldRef<"StrategyPerformance", 'DateTime'>
    readonly tradesCount: FieldRef<"StrategyPerformance", 'Int'>
    readonly winCount: FieldRef<"StrategyPerformance", 'Int'>
    readonly lossCount: FieldRef<"StrategyPerformance", 'Int'>
    readonly winRate: FieldRef<"StrategyPerformance", 'Float'>
    readonly totalPnl: FieldRef<"StrategyPerformance", 'String'>
    readonly totalPnlPct: FieldRef<"StrategyPerformance", 'Float'>
    readonly bestTrade: FieldRef<"StrategyPerformance", 'String'>
    readonly worstTrade: FieldRef<"StrategyPerformance", 'String'>
    readonly avgTradeSize: FieldRef<"StrategyPerformance", 'String'>
    readonly createdAt: FieldRef<"StrategyPerformance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StrategyPerformance findUnique
   */
  export type StrategyPerformanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceInclude<ExtArgs> | null
    /**
     * Filter, which StrategyPerformance to fetch.
     */
    where: StrategyPerformanceWhereUniqueInput
  }

  /**
   * StrategyPerformance findUniqueOrThrow
   */
  export type StrategyPerformanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceInclude<ExtArgs> | null
    /**
     * Filter, which StrategyPerformance to fetch.
     */
    where: StrategyPerformanceWhereUniqueInput
  }

  /**
   * StrategyPerformance findFirst
   */
  export type StrategyPerformanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceInclude<ExtArgs> | null
    /**
     * Filter, which StrategyPerformance to fetch.
     */
    where?: StrategyPerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StrategyPerformances to fetch.
     */
    orderBy?: StrategyPerformanceOrderByWithRelationInput | StrategyPerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StrategyPerformances.
     */
    cursor?: StrategyPerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StrategyPerformances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StrategyPerformances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StrategyPerformances.
     */
    distinct?: StrategyPerformanceScalarFieldEnum | StrategyPerformanceScalarFieldEnum[]
  }

  /**
   * StrategyPerformance findFirstOrThrow
   */
  export type StrategyPerformanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceInclude<ExtArgs> | null
    /**
     * Filter, which StrategyPerformance to fetch.
     */
    where?: StrategyPerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StrategyPerformances to fetch.
     */
    orderBy?: StrategyPerformanceOrderByWithRelationInput | StrategyPerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StrategyPerformances.
     */
    cursor?: StrategyPerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StrategyPerformances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StrategyPerformances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StrategyPerformances.
     */
    distinct?: StrategyPerformanceScalarFieldEnum | StrategyPerformanceScalarFieldEnum[]
  }

  /**
   * StrategyPerformance findMany
   */
  export type StrategyPerformanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceInclude<ExtArgs> | null
    /**
     * Filter, which StrategyPerformances to fetch.
     */
    where?: StrategyPerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StrategyPerformances to fetch.
     */
    orderBy?: StrategyPerformanceOrderByWithRelationInput | StrategyPerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StrategyPerformances.
     */
    cursor?: StrategyPerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StrategyPerformances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StrategyPerformances.
     */
    skip?: number
    distinct?: StrategyPerformanceScalarFieldEnum | StrategyPerformanceScalarFieldEnum[]
  }

  /**
   * StrategyPerformance create
   */
  export type StrategyPerformanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceInclude<ExtArgs> | null
    /**
     * The data needed to create a StrategyPerformance.
     */
    data: XOR<StrategyPerformanceCreateInput, StrategyPerformanceUncheckedCreateInput>
  }

  /**
   * StrategyPerformance createMany
   */
  export type StrategyPerformanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StrategyPerformances.
     */
    data: StrategyPerformanceCreateManyInput | StrategyPerformanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StrategyPerformance createManyAndReturn
   */
  export type StrategyPerformanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * The data used to create many StrategyPerformances.
     */
    data: StrategyPerformanceCreateManyInput | StrategyPerformanceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StrategyPerformance update
   */
  export type StrategyPerformanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceInclude<ExtArgs> | null
    /**
     * The data needed to update a StrategyPerformance.
     */
    data: XOR<StrategyPerformanceUpdateInput, StrategyPerformanceUncheckedUpdateInput>
    /**
     * Choose, which StrategyPerformance to update.
     */
    where: StrategyPerformanceWhereUniqueInput
  }

  /**
   * StrategyPerformance updateMany
   */
  export type StrategyPerformanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StrategyPerformances.
     */
    data: XOR<StrategyPerformanceUpdateManyMutationInput, StrategyPerformanceUncheckedUpdateManyInput>
    /**
     * Filter which StrategyPerformances to update
     */
    where?: StrategyPerformanceWhereInput
    /**
     * Limit how many StrategyPerformances to update.
     */
    limit?: number
  }

  /**
   * StrategyPerformance updateManyAndReturn
   */
  export type StrategyPerformanceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * The data used to update StrategyPerformances.
     */
    data: XOR<StrategyPerformanceUpdateManyMutationInput, StrategyPerformanceUncheckedUpdateManyInput>
    /**
     * Filter which StrategyPerformances to update
     */
    where?: StrategyPerformanceWhereInput
    /**
     * Limit how many StrategyPerformances to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StrategyPerformance upsert
   */
  export type StrategyPerformanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceInclude<ExtArgs> | null
    /**
     * The filter to search for the StrategyPerformance to update in case it exists.
     */
    where: StrategyPerformanceWhereUniqueInput
    /**
     * In case the StrategyPerformance found by the `where` argument doesn't exist, create a new StrategyPerformance with this data.
     */
    create: XOR<StrategyPerformanceCreateInput, StrategyPerformanceUncheckedCreateInput>
    /**
     * In case the StrategyPerformance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StrategyPerformanceUpdateInput, StrategyPerformanceUncheckedUpdateInput>
  }

  /**
   * StrategyPerformance delete
   */
  export type StrategyPerformanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceInclude<ExtArgs> | null
    /**
     * Filter which StrategyPerformance to delete.
     */
    where: StrategyPerformanceWhereUniqueInput
  }

  /**
   * StrategyPerformance deleteMany
   */
  export type StrategyPerformanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StrategyPerformances to delete
     */
    where?: StrategyPerformanceWhereInput
    /**
     * Limit how many StrategyPerformances to delete.
     */
    limit?: number
  }

  /**
   * StrategyPerformance without action
   */
  export type StrategyPerformanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyPerformance
     */
    select?: StrategyPerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategyPerformance
     */
    omit?: StrategyPerformanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyPerformanceInclude<ExtArgs> | null
  }


  /**
   * Model TokenWhitelist
   */

  export type AggregateTokenWhitelist = {
    _count: TokenWhitelistCountAggregateOutputType | null
    _min: TokenWhitelistMinAggregateOutputType | null
    _max: TokenWhitelistMaxAggregateOutputType | null
  }

  export type TokenWhitelistMinAggregateOutputType = {
    id: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    riskLevel: $Enums.RiskLevel | null
    minMarketCap: string | null
    verified: boolean | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TokenWhitelistMaxAggregateOutputType = {
    id: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    riskLevel: $Enums.RiskLevel | null
    minMarketCap: string | null
    verified: boolean | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TokenWhitelistCountAggregateOutputType = {
    id: number
    tokenAddress: number
    tokenSymbol: number
    riskLevel: number
    minMarketCap: number
    verified: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TokenWhitelistMinAggregateInputType = {
    id?: true
    tokenAddress?: true
    tokenSymbol?: true
    riskLevel?: true
    minMarketCap?: true
    verified?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TokenWhitelistMaxAggregateInputType = {
    id?: true
    tokenAddress?: true
    tokenSymbol?: true
    riskLevel?: true
    minMarketCap?: true
    verified?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TokenWhitelistCountAggregateInputType = {
    id?: true
    tokenAddress?: true
    tokenSymbol?: true
    riskLevel?: true
    minMarketCap?: true
    verified?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TokenWhitelistAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TokenWhitelist to aggregate.
     */
    where?: TokenWhitelistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenWhitelists to fetch.
     */
    orderBy?: TokenWhitelistOrderByWithRelationInput | TokenWhitelistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TokenWhitelistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenWhitelists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenWhitelists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TokenWhitelists
    **/
    _count?: true | TokenWhitelistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TokenWhitelistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TokenWhitelistMaxAggregateInputType
  }

  export type GetTokenWhitelistAggregateType<T extends TokenWhitelistAggregateArgs> = {
        [P in keyof T & keyof AggregateTokenWhitelist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTokenWhitelist[P]>
      : GetScalarType<T[P], AggregateTokenWhitelist[P]>
  }




  export type TokenWhitelistGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenWhitelistWhereInput
    orderBy?: TokenWhitelistOrderByWithAggregationInput | TokenWhitelistOrderByWithAggregationInput[]
    by: TokenWhitelistScalarFieldEnum[] | TokenWhitelistScalarFieldEnum
    having?: TokenWhitelistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TokenWhitelistCountAggregateInputType | true
    _min?: TokenWhitelistMinAggregateInputType
    _max?: TokenWhitelistMaxAggregateInputType
  }

  export type TokenWhitelistGroupByOutputType = {
    id: string
    tokenAddress: string
    tokenSymbol: string
    riskLevel: $Enums.RiskLevel
    minMarketCap: string | null
    verified: boolean
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: TokenWhitelistCountAggregateOutputType | null
    _min: TokenWhitelistMinAggregateOutputType | null
    _max: TokenWhitelistMaxAggregateOutputType | null
  }

  type GetTokenWhitelistGroupByPayload<T extends TokenWhitelistGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TokenWhitelistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TokenWhitelistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TokenWhitelistGroupByOutputType[P]>
            : GetScalarType<T[P], TokenWhitelistGroupByOutputType[P]>
        }
      >
    >


  export type TokenWhitelistSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    riskLevel?: boolean
    minMarketCap?: boolean
    verified?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tokenWhitelist"]>

  export type TokenWhitelistSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    riskLevel?: boolean
    minMarketCap?: boolean
    verified?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tokenWhitelist"]>

  export type TokenWhitelistSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    riskLevel?: boolean
    minMarketCap?: boolean
    verified?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tokenWhitelist"]>

  export type TokenWhitelistSelectScalar = {
    id?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    riskLevel?: boolean
    minMarketCap?: boolean
    verified?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TokenWhitelistOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tokenAddress" | "tokenSymbol" | "riskLevel" | "minMarketCap" | "verified" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["tokenWhitelist"]>

  export type $TokenWhitelistPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TokenWhitelist"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tokenAddress: string
      tokenSymbol: string
      riskLevel: $Enums.RiskLevel
      minMarketCap: string | null
      verified: boolean
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tokenWhitelist"]>
    composites: {}
  }

  type TokenWhitelistGetPayload<S extends boolean | null | undefined | TokenWhitelistDefaultArgs> = $Result.GetResult<Prisma.$TokenWhitelistPayload, S>

  type TokenWhitelistCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TokenWhitelistFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TokenWhitelistCountAggregateInputType | true
    }

  export interface TokenWhitelistDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TokenWhitelist'], meta: { name: 'TokenWhitelist' } }
    /**
     * Find zero or one TokenWhitelist that matches the filter.
     * @param {TokenWhitelistFindUniqueArgs} args - Arguments to find a TokenWhitelist
     * @example
     * // Get one TokenWhitelist
     * const tokenWhitelist = await prisma.tokenWhitelist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TokenWhitelistFindUniqueArgs>(args: SelectSubset<T, TokenWhitelistFindUniqueArgs<ExtArgs>>): Prisma__TokenWhitelistClient<$Result.GetResult<Prisma.$TokenWhitelistPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TokenWhitelist that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TokenWhitelistFindUniqueOrThrowArgs} args - Arguments to find a TokenWhitelist
     * @example
     * // Get one TokenWhitelist
     * const tokenWhitelist = await prisma.tokenWhitelist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TokenWhitelistFindUniqueOrThrowArgs>(args: SelectSubset<T, TokenWhitelistFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TokenWhitelistClient<$Result.GetResult<Prisma.$TokenWhitelistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TokenWhitelist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenWhitelistFindFirstArgs} args - Arguments to find a TokenWhitelist
     * @example
     * // Get one TokenWhitelist
     * const tokenWhitelist = await prisma.tokenWhitelist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TokenWhitelistFindFirstArgs>(args?: SelectSubset<T, TokenWhitelistFindFirstArgs<ExtArgs>>): Prisma__TokenWhitelistClient<$Result.GetResult<Prisma.$TokenWhitelistPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TokenWhitelist that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenWhitelistFindFirstOrThrowArgs} args - Arguments to find a TokenWhitelist
     * @example
     * // Get one TokenWhitelist
     * const tokenWhitelist = await prisma.tokenWhitelist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TokenWhitelistFindFirstOrThrowArgs>(args?: SelectSubset<T, TokenWhitelistFindFirstOrThrowArgs<ExtArgs>>): Prisma__TokenWhitelistClient<$Result.GetResult<Prisma.$TokenWhitelistPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TokenWhitelists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenWhitelistFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TokenWhitelists
     * const tokenWhitelists = await prisma.tokenWhitelist.findMany()
     * 
     * // Get first 10 TokenWhitelists
     * const tokenWhitelists = await prisma.tokenWhitelist.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tokenWhitelistWithIdOnly = await prisma.tokenWhitelist.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TokenWhitelistFindManyArgs>(args?: SelectSubset<T, TokenWhitelistFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenWhitelistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TokenWhitelist.
     * @param {TokenWhitelistCreateArgs} args - Arguments to create a TokenWhitelist.
     * @example
     * // Create one TokenWhitelist
     * const TokenWhitelist = await prisma.tokenWhitelist.create({
     *   data: {
     *     // ... data to create a TokenWhitelist
     *   }
     * })
     * 
     */
    create<T extends TokenWhitelistCreateArgs>(args: SelectSubset<T, TokenWhitelistCreateArgs<ExtArgs>>): Prisma__TokenWhitelistClient<$Result.GetResult<Prisma.$TokenWhitelistPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TokenWhitelists.
     * @param {TokenWhitelistCreateManyArgs} args - Arguments to create many TokenWhitelists.
     * @example
     * // Create many TokenWhitelists
     * const tokenWhitelist = await prisma.tokenWhitelist.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TokenWhitelistCreateManyArgs>(args?: SelectSubset<T, TokenWhitelistCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TokenWhitelists and returns the data saved in the database.
     * @param {TokenWhitelistCreateManyAndReturnArgs} args - Arguments to create many TokenWhitelists.
     * @example
     * // Create many TokenWhitelists
     * const tokenWhitelist = await prisma.tokenWhitelist.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TokenWhitelists and only return the `id`
     * const tokenWhitelistWithIdOnly = await prisma.tokenWhitelist.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TokenWhitelistCreateManyAndReturnArgs>(args?: SelectSubset<T, TokenWhitelistCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenWhitelistPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TokenWhitelist.
     * @param {TokenWhitelistDeleteArgs} args - Arguments to delete one TokenWhitelist.
     * @example
     * // Delete one TokenWhitelist
     * const TokenWhitelist = await prisma.tokenWhitelist.delete({
     *   where: {
     *     // ... filter to delete one TokenWhitelist
     *   }
     * })
     * 
     */
    delete<T extends TokenWhitelistDeleteArgs>(args: SelectSubset<T, TokenWhitelistDeleteArgs<ExtArgs>>): Prisma__TokenWhitelistClient<$Result.GetResult<Prisma.$TokenWhitelistPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TokenWhitelist.
     * @param {TokenWhitelistUpdateArgs} args - Arguments to update one TokenWhitelist.
     * @example
     * // Update one TokenWhitelist
     * const tokenWhitelist = await prisma.tokenWhitelist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TokenWhitelistUpdateArgs>(args: SelectSubset<T, TokenWhitelistUpdateArgs<ExtArgs>>): Prisma__TokenWhitelistClient<$Result.GetResult<Prisma.$TokenWhitelistPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TokenWhitelists.
     * @param {TokenWhitelistDeleteManyArgs} args - Arguments to filter TokenWhitelists to delete.
     * @example
     * // Delete a few TokenWhitelists
     * const { count } = await prisma.tokenWhitelist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TokenWhitelistDeleteManyArgs>(args?: SelectSubset<T, TokenWhitelistDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TokenWhitelists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenWhitelistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TokenWhitelists
     * const tokenWhitelist = await prisma.tokenWhitelist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TokenWhitelistUpdateManyArgs>(args: SelectSubset<T, TokenWhitelistUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TokenWhitelists and returns the data updated in the database.
     * @param {TokenWhitelistUpdateManyAndReturnArgs} args - Arguments to update many TokenWhitelists.
     * @example
     * // Update many TokenWhitelists
     * const tokenWhitelist = await prisma.tokenWhitelist.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TokenWhitelists and only return the `id`
     * const tokenWhitelistWithIdOnly = await prisma.tokenWhitelist.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TokenWhitelistUpdateManyAndReturnArgs>(args: SelectSubset<T, TokenWhitelistUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenWhitelistPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TokenWhitelist.
     * @param {TokenWhitelistUpsertArgs} args - Arguments to update or create a TokenWhitelist.
     * @example
     * // Update or create a TokenWhitelist
     * const tokenWhitelist = await prisma.tokenWhitelist.upsert({
     *   create: {
     *     // ... data to create a TokenWhitelist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TokenWhitelist we want to update
     *   }
     * })
     */
    upsert<T extends TokenWhitelistUpsertArgs>(args: SelectSubset<T, TokenWhitelistUpsertArgs<ExtArgs>>): Prisma__TokenWhitelistClient<$Result.GetResult<Prisma.$TokenWhitelistPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TokenWhitelists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenWhitelistCountArgs} args - Arguments to filter TokenWhitelists to count.
     * @example
     * // Count the number of TokenWhitelists
     * const count = await prisma.tokenWhitelist.count({
     *   where: {
     *     // ... the filter for the TokenWhitelists we want to count
     *   }
     * })
    **/
    count<T extends TokenWhitelistCountArgs>(
      args?: Subset<T, TokenWhitelistCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TokenWhitelistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TokenWhitelist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenWhitelistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TokenWhitelistAggregateArgs>(args: Subset<T, TokenWhitelistAggregateArgs>): Prisma.PrismaPromise<GetTokenWhitelistAggregateType<T>>

    /**
     * Group by TokenWhitelist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenWhitelistGroupByArgs} args - Group by arguments.
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
      T extends TokenWhitelistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TokenWhitelistGroupByArgs['orderBy'] }
        : { orderBy?: TokenWhitelistGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TokenWhitelistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTokenWhitelistGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TokenWhitelist model
   */
  readonly fields: TokenWhitelistFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TokenWhitelist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TokenWhitelistClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the TokenWhitelist model
   */
  interface TokenWhitelistFieldRefs {
    readonly id: FieldRef<"TokenWhitelist", 'String'>
    readonly tokenAddress: FieldRef<"TokenWhitelist", 'String'>
    readonly tokenSymbol: FieldRef<"TokenWhitelist", 'String'>
    readonly riskLevel: FieldRef<"TokenWhitelist", 'RiskLevel'>
    readonly minMarketCap: FieldRef<"TokenWhitelist", 'String'>
    readonly verified: FieldRef<"TokenWhitelist", 'Boolean'>
    readonly notes: FieldRef<"TokenWhitelist", 'String'>
    readonly createdAt: FieldRef<"TokenWhitelist", 'DateTime'>
    readonly updatedAt: FieldRef<"TokenWhitelist", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TokenWhitelist findUnique
   */
  export type TokenWhitelistFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
    /**
     * Filter, which TokenWhitelist to fetch.
     */
    where: TokenWhitelistWhereUniqueInput
  }

  /**
   * TokenWhitelist findUniqueOrThrow
   */
  export type TokenWhitelistFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
    /**
     * Filter, which TokenWhitelist to fetch.
     */
    where: TokenWhitelistWhereUniqueInput
  }

  /**
   * TokenWhitelist findFirst
   */
  export type TokenWhitelistFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
    /**
     * Filter, which TokenWhitelist to fetch.
     */
    where?: TokenWhitelistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenWhitelists to fetch.
     */
    orderBy?: TokenWhitelistOrderByWithRelationInput | TokenWhitelistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TokenWhitelists.
     */
    cursor?: TokenWhitelistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenWhitelists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenWhitelists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TokenWhitelists.
     */
    distinct?: TokenWhitelistScalarFieldEnum | TokenWhitelistScalarFieldEnum[]
  }

  /**
   * TokenWhitelist findFirstOrThrow
   */
  export type TokenWhitelistFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
    /**
     * Filter, which TokenWhitelist to fetch.
     */
    where?: TokenWhitelistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenWhitelists to fetch.
     */
    orderBy?: TokenWhitelistOrderByWithRelationInput | TokenWhitelistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TokenWhitelists.
     */
    cursor?: TokenWhitelistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenWhitelists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenWhitelists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TokenWhitelists.
     */
    distinct?: TokenWhitelistScalarFieldEnum | TokenWhitelistScalarFieldEnum[]
  }

  /**
   * TokenWhitelist findMany
   */
  export type TokenWhitelistFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
    /**
     * Filter, which TokenWhitelists to fetch.
     */
    where?: TokenWhitelistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenWhitelists to fetch.
     */
    orderBy?: TokenWhitelistOrderByWithRelationInput | TokenWhitelistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TokenWhitelists.
     */
    cursor?: TokenWhitelistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenWhitelists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenWhitelists.
     */
    skip?: number
    distinct?: TokenWhitelistScalarFieldEnum | TokenWhitelistScalarFieldEnum[]
  }

  /**
   * TokenWhitelist create
   */
  export type TokenWhitelistCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
    /**
     * The data needed to create a TokenWhitelist.
     */
    data: XOR<TokenWhitelistCreateInput, TokenWhitelistUncheckedCreateInput>
  }

  /**
   * TokenWhitelist createMany
   */
  export type TokenWhitelistCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TokenWhitelists.
     */
    data: TokenWhitelistCreateManyInput | TokenWhitelistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TokenWhitelist createManyAndReturn
   */
  export type TokenWhitelistCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
    /**
     * The data used to create many TokenWhitelists.
     */
    data: TokenWhitelistCreateManyInput | TokenWhitelistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TokenWhitelist update
   */
  export type TokenWhitelistUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
    /**
     * The data needed to update a TokenWhitelist.
     */
    data: XOR<TokenWhitelistUpdateInput, TokenWhitelistUncheckedUpdateInput>
    /**
     * Choose, which TokenWhitelist to update.
     */
    where: TokenWhitelistWhereUniqueInput
  }

  /**
   * TokenWhitelist updateMany
   */
  export type TokenWhitelistUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TokenWhitelists.
     */
    data: XOR<TokenWhitelistUpdateManyMutationInput, TokenWhitelistUncheckedUpdateManyInput>
    /**
     * Filter which TokenWhitelists to update
     */
    where?: TokenWhitelistWhereInput
    /**
     * Limit how many TokenWhitelists to update.
     */
    limit?: number
  }

  /**
   * TokenWhitelist updateManyAndReturn
   */
  export type TokenWhitelistUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
    /**
     * The data used to update TokenWhitelists.
     */
    data: XOR<TokenWhitelistUpdateManyMutationInput, TokenWhitelistUncheckedUpdateManyInput>
    /**
     * Filter which TokenWhitelists to update
     */
    where?: TokenWhitelistWhereInput
    /**
     * Limit how many TokenWhitelists to update.
     */
    limit?: number
  }

  /**
   * TokenWhitelist upsert
   */
  export type TokenWhitelistUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
    /**
     * The filter to search for the TokenWhitelist to update in case it exists.
     */
    where: TokenWhitelistWhereUniqueInput
    /**
     * In case the TokenWhitelist found by the `where` argument doesn't exist, create a new TokenWhitelist with this data.
     */
    create: XOR<TokenWhitelistCreateInput, TokenWhitelistUncheckedCreateInput>
    /**
     * In case the TokenWhitelist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TokenWhitelistUpdateInput, TokenWhitelistUncheckedUpdateInput>
  }

  /**
   * TokenWhitelist delete
   */
  export type TokenWhitelistDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
    /**
     * Filter which TokenWhitelist to delete.
     */
    where: TokenWhitelistWhereUniqueInput
  }

  /**
   * TokenWhitelist deleteMany
   */
  export type TokenWhitelistDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TokenWhitelists to delete
     */
    where?: TokenWhitelistWhereInput
    /**
     * Limit how many TokenWhitelists to delete.
     */
    limit?: number
  }

  /**
   * TokenWhitelist without action
   */
  export type TokenWhitelistDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenWhitelist
     */
    select?: TokenWhitelistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenWhitelist
     */
    omit?: TokenWhitelistOmit<ExtArgs> | null
  }


  /**
   * Model AgentLog
   */

  export type AggregateAgentLog = {
    _count: AgentLogCountAggregateOutputType | null
    _min: AgentLogMinAggregateOutputType | null
    _max: AgentLogMaxAggregateOutputType | null
  }

  export type AgentLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    success: boolean | null
    error: string | null
    createdAt: Date | null
  }

  export type AgentLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    success: boolean | null
    error: string | null
    createdAt: Date | null
  }

  export type AgentLogCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    details: number
    success: number
    error: number
    createdAt: number
    _all: number
  }


  export type AgentLogMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    success?: true
    error?: true
    createdAt?: true
  }

  export type AgentLogMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    success?: true
    error?: true
    createdAt?: true
  }

  export type AgentLogCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    details?: true
    success?: true
    error?: true
    createdAt?: true
    _all?: true
  }

  export type AgentLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentLog to aggregate.
     */
    where?: AgentLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentLogs to fetch.
     */
    orderBy?: AgentLogOrderByWithRelationInput | AgentLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentLogs
    **/
    _count?: true | AgentLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentLogMaxAggregateInputType
  }

  export type GetAgentLogAggregateType<T extends AgentLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentLog[P]>
      : GetScalarType<T[P], AggregateAgentLog[P]>
  }




  export type AgentLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentLogWhereInput
    orderBy?: AgentLogOrderByWithAggregationInput | AgentLogOrderByWithAggregationInput[]
    by: AgentLogScalarFieldEnum[] | AgentLogScalarFieldEnum
    having?: AgentLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentLogCountAggregateInputType | true
    _min?: AgentLogMinAggregateInputType
    _max?: AgentLogMaxAggregateInputType
  }

  export type AgentLogGroupByOutputType = {
    id: string
    userId: string | null
    action: string
    details: JsonValue | null
    success: boolean
    error: string | null
    createdAt: Date
    _count: AgentLogCountAggregateOutputType | null
    _min: AgentLogMinAggregateOutputType | null
    _max: AgentLogMaxAggregateOutputType | null
  }

  type GetAgentLogGroupByPayload<T extends AgentLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentLogGroupByOutputType[P]>
            : GetScalarType<T[P], AgentLogGroupByOutputType[P]>
        }
      >
    >


  export type AgentLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    details?: boolean
    success?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["agentLog"]>

  export type AgentLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    details?: boolean
    success?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["agentLog"]>

  export type AgentLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    details?: boolean
    success?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["agentLog"]>

  export type AgentLogSelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    details?: boolean
    success?: boolean
    error?: boolean
    createdAt?: boolean
  }

  export type AgentLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "action" | "details" | "success" | "error" | "createdAt", ExtArgs["result"]["agentLog"]>

  export type $AgentLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      action: string
      details: Prisma.JsonValue | null
      success: boolean
      error: string | null
      createdAt: Date
    }, ExtArgs["result"]["agentLog"]>
    composites: {}
  }

  type AgentLogGetPayload<S extends boolean | null | undefined | AgentLogDefaultArgs> = $Result.GetResult<Prisma.$AgentLogPayload, S>

  type AgentLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentLogCountAggregateInputType | true
    }

  export interface AgentLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentLog'], meta: { name: 'AgentLog' } }
    /**
     * Find zero or one AgentLog that matches the filter.
     * @param {AgentLogFindUniqueArgs} args - Arguments to find a AgentLog
     * @example
     * // Get one AgentLog
     * const agentLog = await prisma.agentLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentLogFindUniqueArgs>(args: SelectSubset<T, AgentLogFindUniqueArgs<ExtArgs>>): Prisma__AgentLogClient<$Result.GetResult<Prisma.$AgentLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentLogFindUniqueOrThrowArgs} args - Arguments to find a AgentLog
     * @example
     * // Get one AgentLog
     * const agentLog = await prisma.agentLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentLogClient<$Result.GetResult<Prisma.$AgentLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentLogFindFirstArgs} args - Arguments to find a AgentLog
     * @example
     * // Get one AgentLog
     * const agentLog = await prisma.agentLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentLogFindFirstArgs>(args?: SelectSubset<T, AgentLogFindFirstArgs<ExtArgs>>): Prisma__AgentLogClient<$Result.GetResult<Prisma.$AgentLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentLogFindFirstOrThrowArgs} args - Arguments to find a AgentLog
     * @example
     * // Get one AgentLog
     * const agentLog = await prisma.agentLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentLogClient<$Result.GetResult<Prisma.$AgentLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentLogs
     * const agentLogs = await prisma.agentLog.findMany()
     * 
     * // Get first 10 AgentLogs
     * const agentLogs = await prisma.agentLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentLogWithIdOnly = await prisma.agentLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentLogFindManyArgs>(args?: SelectSubset<T, AgentLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentLog.
     * @param {AgentLogCreateArgs} args - Arguments to create a AgentLog.
     * @example
     * // Create one AgentLog
     * const AgentLog = await prisma.agentLog.create({
     *   data: {
     *     // ... data to create a AgentLog
     *   }
     * })
     * 
     */
    create<T extends AgentLogCreateArgs>(args: SelectSubset<T, AgentLogCreateArgs<ExtArgs>>): Prisma__AgentLogClient<$Result.GetResult<Prisma.$AgentLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentLogs.
     * @param {AgentLogCreateManyArgs} args - Arguments to create many AgentLogs.
     * @example
     * // Create many AgentLogs
     * const agentLog = await prisma.agentLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentLogCreateManyArgs>(args?: SelectSubset<T, AgentLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentLogs and returns the data saved in the database.
     * @param {AgentLogCreateManyAndReturnArgs} args - Arguments to create many AgentLogs.
     * @example
     * // Create many AgentLogs
     * const agentLog = await prisma.agentLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentLogs and only return the `id`
     * const agentLogWithIdOnly = await prisma.agentLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentLog.
     * @param {AgentLogDeleteArgs} args - Arguments to delete one AgentLog.
     * @example
     * // Delete one AgentLog
     * const AgentLog = await prisma.agentLog.delete({
     *   where: {
     *     // ... filter to delete one AgentLog
     *   }
     * })
     * 
     */
    delete<T extends AgentLogDeleteArgs>(args: SelectSubset<T, AgentLogDeleteArgs<ExtArgs>>): Prisma__AgentLogClient<$Result.GetResult<Prisma.$AgentLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentLog.
     * @param {AgentLogUpdateArgs} args - Arguments to update one AgentLog.
     * @example
     * // Update one AgentLog
     * const agentLog = await prisma.agentLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentLogUpdateArgs>(args: SelectSubset<T, AgentLogUpdateArgs<ExtArgs>>): Prisma__AgentLogClient<$Result.GetResult<Prisma.$AgentLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentLogs.
     * @param {AgentLogDeleteManyArgs} args - Arguments to filter AgentLogs to delete.
     * @example
     * // Delete a few AgentLogs
     * const { count } = await prisma.agentLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentLogDeleteManyArgs>(args?: SelectSubset<T, AgentLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentLogs
     * const agentLog = await prisma.agentLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentLogUpdateManyArgs>(args: SelectSubset<T, AgentLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentLogs and returns the data updated in the database.
     * @param {AgentLogUpdateManyAndReturnArgs} args - Arguments to update many AgentLogs.
     * @example
     * // Update many AgentLogs
     * const agentLog = await prisma.agentLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentLogs and only return the `id`
     * const agentLogWithIdOnly = await prisma.agentLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentLog.
     * @param {AgentLogUpsertArgs} args - Arguments to update or create a AgentLog.
     * @example
     * // Update or create a AgentLog
     * const agentLog = await prisma.agentLog.upsert({
     *   create: {
     *     // ... data to create a AgentLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentLog we want to update
     *   }
     * })
     */
    upsert<T extends AgentLogUpsertArgs>(args: SelectSubset<T, AgentLogUpsertArgs<ExtArgs>>): Prisma__AgentLogClient<$Result.GetResult<Prisma.$AgentLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentLogCountArgs} args - Arguments to filter AgentLogs to count.
     * @example
     * // Count the number of AgentLogs
     * const count = await prisma.agentLog.count({
     *   where: {
     *     // ... the filter for the AgentLogs we want to count
     *   }
     * })
    **/
    count<T extends AgentLogCountArgs>(
      args?: Subset<T, AgentLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AgentLogAggregateArgs>(args: Subset<T, AgentLogAggregateArgs>): Prisma.PrismaPromise<GetAgentLogAggregateType<T>>

    /**
     * Group by AgentLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentLogGroupByArgs} args - Group by arguments.
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
      T extends AgentLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentLogGroupByArgs['orderBy'] }
        : { orderBy?: AgentLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AgentLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentLog model
   */
  readonly fields: AgentLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the AgentLog model
   */
  interface AgentLogFieldRefs {
    readonly id: FieldRef<"AgentLog", 'String'>
    readonly userId: FieldRef<"AgentLog", 'String'>
    readonly action: FieldRef<"AgentLog", 'String'>
    readonly details: FieldRef<"AgentLog", 'Json'>
    readonly success: FieldRef<"AgentLog", 'Boolean'>
    readonly error: FieldRef<"AgentLog", 'String'>
    readonly createdAt: FieldRef<"AgentLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentLog findUnique
   */
  export type AgentLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
    /**
     * Filter, which AgentLog to fetch.
     */
    where: AgentLogWhereUniqueInput
  }

  /**
   * AgentLog findUniqueOrThrow
   */
  export type AgentLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
    /**
     * Filter, which AgentLog to fetch.
     */
    where: AgentLogWhereUniqueInput
  }

  /**
   * AgentLog findFirst
   */
  export type AgentLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
    /**
     * Filter, which AgentLog to fetch.
     */
    where?: AgentLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentLogs to fetch.
     */
    orderBy?: AgentLogOrderByWithRelationInput | AgentLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentLogs.
     */
    cursor?: AgentLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentLogs.
     */
    distinct?: AgentLogScalarFieldEnum | AgentLogScalarFieldEnum[]
  }

  /**
   * AgentLog findFirstOrThrow
   */
  export type AgentLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
    /**
     * Filter, which AgentLog to fetch.
     */
    where?: AgentLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentLogs to fetch.
     */
    orderBy?: AgentLogOrderByWithRelationInput | AgentLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentLogs.
     */
    cursor?: AgentLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentLogs.
     */
    distinct?: AgentLogScalarFieldEnum | AgentLogScalarFieldEnum[]
  }

  /**
   * AgentLog findMany
   */
  export type AgentLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
    /**
     * Filter, which AgentLogs to fetch.
     */
    where?: AgentLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentLogs to fetch.
     */
    orderBy?: AgentLogOrderByWithRelationInput | AgentLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentLogs.
     */
    cursor?: AgentLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentLogs.
     */
    skip?: number
    distinct?: AgentLogScalarFieldEnum | AgentLogScalarFieldEnum[]
  }

  /**
   * AgentLog create
   */
  export type AgentLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AgentLog.
     */
    data: XOR<AgentLogCreateInput, AgentLogUncheckedCreateInput>
  }

  /**
   * AgentLog createMany
   */
  export type AgentLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentLogs.
     */
    data: AgentLogCreateManyInput | AgentLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentLog createManyAndReturn
   */
  export type AgentLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
    /**
     * The data used to create many AgentLogs.
     */
    data: AgentLogCreateManyInput | AgentLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentLog update
   */
  export type AgentLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AgentLog.
     */
    data: XOR<AgentLogUpdateInput, AgentLogUncheckedUpdateInput>
    /**
     * Choose, which AgentLog to update.
     */
    where: AgentLogWhereUniqueInput
  }

  /**
   * AgentLog updateMany
   */
  export type AgentLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentLogs.
     */
    data: XOR<AgentLogUpdateManyMutationInput, AgentLogUncheckedUpdateManyInput>
    /**
     * Filter which AgentLogs to update
     */
    where?: AgentLogWhereInput
    /**
     * Limit how many AgentLogs to update.
     */
    limit?: number
  }

  /**
   * AgentLog updateManyAndReturn
   */
  export type AgentLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
    /**
     * The data used to update AgentLogs.
     */
    data: XOR<AgentLogUpdateManyMutationInput, AgentLogUncheckedUpdateManyInput>
    /**
     * Filter which AgentLogs to update
     */
    where?: AgentLogWhereInput
    /**
     * Limit how many AgentLogs to update.
     */
    limit?: number
  }

  /**
   * AgentLog upsert
   */
  export type AgentLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AgentLog to update in case it exists.
     */
    where: AgentLogWhereUniqueInput
    /**
     * In case the AgentLog found by the `where` argument doesn't exist, create a new AgentLog with this data.
     */
    create: XOR<AgentLogCreateInput, AgentLogUncheckedCreateInput>
    /**
     * In case the AgentLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentLogUpdateInput, AgentLogUncheckedUpdateInput>
  }

  /**
   * AgentLog delete
   */
  export type AgentLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
    /**
     * Filter which AgentLog to delete.
     */
    where: AgentLogWhereUniqueInput
  }

  /**
   * AgentLog deleteMany
   */
  export type AgentLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentLogs to delete
     */
    where?: AgentLogWhereInput
    /**
     * Limit how many AgentLogs to delete.
     */
    limit?: number
  }

  /**
   * AgentLog without action
   */
  export type AgentLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentLog
     */
    select?: AgentLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentLog
     */
    omit?: AgentLogOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    walletAddress: 'walletAddress',
    vaultAddress: 'vaultAddress',
    xHandle: 'xHandle',
    xUserId: 'xUserId',
    xAnalysis: 'xAnalysis',
    strategyType: 'strategyType',
    confidenceThreshold: 'confidenceThreshold',
    maxTradeAmount: 'maxTradeAmount',
    autoTrade: 'autoTrade',
    autoRebalance: 'autoRebalance',
    rebalanceInterval: 'rebalanceInterval',
    stopLossPercent: 'stopLossPercent',
    takeProfitPercent: 'takeProfitPercent',
    riskProfile: 'riskProfile',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TradeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tokenAddress: 'tokenAddress',
    tokenSymbol: 'tokenSymbol',
    action: 'action',
    amountIn: 'amountIn',
    amountOut: 'amountOut',
    priceAtTrade: 'priceAtTrade',
    confidence: 'confidence',
    signalSource: 'signalSource',
    reasoning: 'reasoning',
    txHash: 'txHash',
    status: 'status',
    error: 'error',
    createdAt: 'createdAt',
    executedAt: 'executedAt'
  };

  export type TradeScalarFieldEnum = (typeof TradeScalarFieldEnum)[keyof typeof TradeScalarFieldEnum]


  export const PositionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tokenAddress: 'tokenAddress',
    tokenSymbol: 'tokenSymbol',
    balance: 'balance',
    costBasis: 'costBasis',
    entryPrice: 'entryPrice',
    currentPrice: 'currentPrice',
    currentValue: 'currentValue',
    unrealizedPnl: 'unrealizedPnl',
    unrealizedPnlPct: 'unrealizedPnlPct',
    targetAllocation: 'targetAllocation',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PositionScalarFieldEnum = (typeof PositionScalarFieldEnum)[keyof typeof PositionScalarFieldEnum]


  export const StrategyPerformanceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    strategyType: 'strategyType',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    tradesCount: 'tradesCount',
    winCount: 'winCount',
    lossCount: 'lossCount',
    winRate: 'winRate',
    totalPnl: 'totalPnl',
    totalPnlPct: 'totalPnlPct',
    bestTrade: 'bestTrade',
    worstTrade: 'worstTrade',
    avgTradeSize: 'avgTradeSize',
    createdAt: 'createdAt'
  };

  export type StrategyPerformanceScalarFieldEnum = (typeof StrategyPerformanceScalarFieldEnum)[keyof typeof StrategyPerformanceScalarFieldEnum]


  export const TokenWhitelistScalarFieldEnum: {
    id: 'id',
    tokenAddress: 'tokenAddress',
    tokenSymbol: 'tokenSymbol',
    riskLevel: 'riskLevel',
    minMarketCap: 'minMarketCap',
    verified: 'verified',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TokenWhitelistScalarFieldEnum = (typeof TokenWhitelistScalarFieldEnum)[keyof typeof TokenWhitelistScalarFieldEnum]


  export const AgentLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    details: 'details',
    success: 'success',
    error: 'error',
    createdAt: 'createdAt'
  };

  export type AgentLogScalarFieldEnum = (typeof AgentLogScalarFieldEnum)[keyof typeof AgentLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'StrategyType'
   */
  export type EnumStrategyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StrategyType'>
    


  /**
   * Reference to a field of type 'StrategyType[]'
   */
  export type ListEnumStrategyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StrategyType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TradeAction'
   */
  export type EnumTradeActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeAction'>
    


  /**
   * Reference to a field of type 'TradeAction[]'
   */
  export type ListEnumTradeActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeAction[]'>
    


  /**
   * Reference to a field of type 'TradeStatus'
   */
  export type EnumTradeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeStatus'>
    


  /**
   * Reference to a field of type 'TradeStatus[]'
   */
  export type ListEnumTradeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeStatus[]'>
    


  /**
   * Reference to a field of type 'RiskLevel'
   */
  export type EnumRiskLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RiskLevel'>
    


  /**
   * Reference to a field of type 'RiskLevel[]'
   */
  export type ListEnumRiskLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RiskLevel[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    walletAddress?: StringFilter<"User"> | string
    vaultAddress?: StringNullableFilter<"User"> | string | null
    xHandle?: StringNullableFilter<"User"> | string | null
    xUserId?: StringNullableFilter<"User"> | string | null
    xAnalysis?: JsonNullableFilter<"User">
    strategyType?: EnumStrategyTypeFilter<"User"> | $Enums.StrategyType
    confidenceThreshold?: FloatFilter<"User"> | number
    maxTradeAmount?: FloatFilter<"User"> | number
    autoTrade?: BoolFilter<"User"> | boolean
    autoRebalance?: BoolFilter<"User"> | boolean
    rebalanceInterval?: IntFilter<"User"> | number
    stopLossPercent?: FloatNullableFilter<"User"> | number | null
    takeProfitPercent?: FloatNullableFilter<"User"> | number | null
    riskProfile?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    trades?: TradeListRelationFilter
    positions?: PositionListRelationFilter
    performance?: StrategyPerformanceListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    vaultAddress?: SortOrderInput | SortOrder
    xHandle?: SortOrderInput | SortOrder
    xUserId?: SortOrderInput | SortOrder
    xAnalysis?: SortOrderInput | SortOrder
    strategyType?: SortOrder
    confidenceThreshold?: SortOrder
    maxTradeAmount?: SortOrder
    autoTrade?: SortOrder
    autoRebalance?: SortOrder
    rebalanceInterval?: SortOrder
    stopLossPercent?: SortOrderInput | SortOrder
    takeProfitPercent?: SortOrderInput | SortOrder
    riskProfile?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    trades?: TradeOrderByRelationAggregateInput
    positions?: PositionOrderByRelationAggregateInput
    performance?: StrategyPerformanceOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    walletAddress?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    vaultAddress?: StringNullableFilter<"User"> | string | null
    xHandle?: StringNullableFilter<"User"> | string | null
    xUserId?: StringNullableFilter<"User"> | string | null
    xAnalysis?: JsonNullableFilter<"User">
    strategyType?: EnumStrategyTypeFilter<"User"> | $Enums.StrategyType
    confidenceThreshold?: FloatFilter<"User"> | number
    maxTradeAmount?: FloatFilter<"User"> | number
    autoTrade?: BoolFilter<"User"> | boolean
    autoRebalance?: BoolFilter<"User"> | boolean
    rebalanceInterval?: IntFilter<"User"> | number
    stopLossPercent?: FloatNullableFilter<"User"> | number | null
    takeProfitPercent?: FloatNullableFilter<"User"> | number | null
    riskProfile?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    trades?: TradeListRelationFilter
    positions?: PositionListRelationFilter
    performance?: StrategyPerformanceListRelationFilter
  }, "id" | "walletAddress">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    vaultAddress?: SortOrderInput | SortOrder
    xHandle?: SortOrderInput | SortOrder
    xUserId?: SortOrderInput | SortOrder
    xAnalysis?: SortOrderInput | SortOrder
    strategyType?: SortOrder
    confidenceThreshold?: SortOrder
    maxTradeAmount?: SortOrder
    autoTrade?: SortOrder
    autoRebalance?: SortOrder
    rebalanceInterval?: SortOrder
    stopLossPercent?: SortOrderInput | SortOrder
    takeProfitPercent?: SortOrderInput | SortOrder
    riskProfile?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    walletAddress?: StringWithAggregatesFilter<"User"> | string
    vaultAddress?: StringNullableWithAggregatesFilter<"User"> | string | null
    xHandle?: StringNullableWithAggregatesFilter<"User"> | string | null
    xUserId?: StringNullableWithAggregatesFilter<"User"> | string | null
    xAnalysis?: JsonNullableWithAggregatesFilter<"User">
    strategyType?: EnumStrategyTypeWithAggregatesFilter<"User"> | $Enums.StrategyType
    confidenceThreshold?: FloatWithAggregatesFilter<"User"> | number
    maxTradeAmount?: FloatWithAggregatesFilter<"User"> | number
    autoTrade?: BoolWithAggregatesFilter<"User"> | boolean
    autoRebalance?: BoolWithAggregatesFilter<"User"> | boolean
    rebalanceInterval?: IntWithAggregatesFilter<"User"> | number
    stopLossPercent?: FloatNullableWithAggregatesFilter<"User"> | number | null
    takeProfitPercent?: FloatNullableWithAggregatesFilter<"User"> | number | null
    riskProfile?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TradeWhereInput = {
    AND?: TradeWhereInput | TradeWhereInput[]
    OR?: TradeWhereInput[]
    NOT?: TradeWhereInput | TradeWhereInput[]
    id?: StringFilter<"Trade"> | string
    userId?: StringFilter<"Trade"> | string
    tokenAddress?: StringFilter<"Trade"> | string
    tokenSymbol?: StringFilter<"Trade"> | string
    action?: EnumTradeActionFilter<"Trade"> | $Enums.TradeAction
    amountIn?: StringFilter<"Trade"> | string
    amountOut?: StringFilter<"Trade"> | string
    priceAtTrade?: StringFilter<"Trade"> | string
    confidence?: FloatFilter<"Trade"> | number
    signalSource?: StringNullableFilter<"Trade"> | string | null
    reasoning?: StringNullableFilter<"Trade"> | string | null
    txHash?: StringNullableFilter<"Trade"> | string | null
    status?: EnumTradeStatusFilter<"Trade"> | $Enums.TradeStatus
    error?: StringNullableFilter<"Trade"> | string | null
    createdAt?: DateTimeFilter<"Trade"> | Date | string
    executedAt?: DateTimeNullableFilter<"Trade"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TradeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    action?: SortOrder
    amountIn?: SortOrder
    amountOut?: SortOrder
    priceAtTrade?: SortOrder
    confidence?: SortOrder
    signalSource?: SortOrderInput | SortOrder
    reasoning?: SortOrderInput | SortOrder
    txHash?: SortOrderInput | SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    executedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TradeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradeWhereInput | TradeWhereInput[]
    OR?: TradeWhereInput[]
    NOT?: TradeWhereInput | TradeWhereInput[]
    userId?: StringFilter<"Trade"> | string
    tokenAddress?: StringFilter<"Trade"> | string
    tokenSymbol?: StringFilter<"Trade"> | string
    action?: EnumTradeActionFilter<"Trade"> | $Enums.TradeAction
    amountIn?: StringFilter<"Trade"> | string
    amountOut?: StringFilter<"Trade"> | string
    priceAtTrade?: StringFilter<"Trade"> | string
    confidence?: FloatFilter<"Trade"> | number
    signalSource?: StringNullableFilter<"Trade"> | string | null
    reasoning?: StringNullableFilter<"Trade"> | string | null
    txHash?: StringNullableFilter<"Trade"> | string | null
    status?: EnumTradeStatusFilter<"Trade"> | $Enums.TradeStatus
    error?: StringNullableFilter<"Trade"> | string | null
    createdAt?: DateTimeFilter<"Trade"> | Date | string
    executedAt?: DateTimeNullableFilter<"Trade"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type TradeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    action?: SortOrder
    amountIn?: SortOrder
    amountOut?: SortOrder
    priceAtTrade?: SortOrder
    confidence?: SortOrder
    signalSource?: SortOrderInput | SortOrder
    reasoning?: SortOrderInput | SortOrder
    txHash?: SortOrderInput | SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    executedAt?: SortOrderInput | SortOrder
    _count?: TradeCountOrderByAggregateInput
    _avg?: TradeAvgOrderByAggregateInput
    _max?: TradeMaxOrderByAggregateInput
    _min?: TradeMinOrderByAggregateInput
    _sum?: TradeSumOrderByAggregateInput
  }

  export type TradeScalarWhereWithAggregatesInput = {
    AND?: TradeScalarWhereWithAggregatesInput | TradeScalarWhereWithAggregatesInput[]
    OR?: TradeScalarWhereWithAggregatesInput[]
    NOT?: TradeScalarWhereWithAggregatesInput | TradeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Trade"> | string
    userId?: StringWithAggregatesFilter<"Trade"> | string
    tokenAddress?: StringWithAggregatesFilter<"Trade"> | string
    tokenSymbol?: StringWithAggregatesFilter<"Trade"> | string
    action?: EnumTradeActionWithAggregatesFilter<"Trade"> | $Enums.TradeAction
    amountIn?: StringWithAggregatesFilter<"Trade"> | string
    amountOut?: StringWithAggregatesFilter<"Trade"> | string
    priceAtTrade?: StringWithAggregatesFilter<"Trade"> | string
    confidence?: FloatWithAggregatesFilter<"Trade"> | number
    signalSource?: StringNullableWithAggregatesFilter<"Trade"> | string | null
    reasoning?: StringNullableWithAggregatesFilter<"Trade"> | string | null
    txHash?: StringNullableWithAggregatesFilter<"Trade"> | string | null
    status?: EnumTradeStatusWithAggregatesFilter<"Trade"> | $Enums.TradeStatus
    error?: StringNullableWithAggregatesFilter<"Trade"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Trade"> | Date | string
    executedAt?: DateTimeNullableWithAggregatesFilter<"Trade"> | Date | string | null
  }

  export type PositionWhereInput = {
    AND?: PositionWhereInput | PositionWhereInput[]
    OR?: PositionWhereInput[]
    NOT?: PositionWhereInput | PositionWhereInput[]
    id?: StringFilter<"Position"> | string
    userId?: StringFilter<"Position"> | string
    tokenAddress?: StringFilter<"Position"> | string
    tokenSymbol?: StringFilter<"Position"> | string
    balance?: StringFilter<"Position"> | string
    costBasis?: StringFilter<"Position"> | string
    entryPrice?: StringFilter<"Position"> | string
    currentPrice?: StringFilter<"Position"> | string
    currentValue?: StringFilter<"Position"> | string
    unrealizedPnl?: StringFilter<"Position"> | string
    unrealizedPnlPct?: FloatFilter<"Position"> | number
    targetAllocation?: FloatNullableFilter<"Position"> | number | null
    createdAt?: DateTimeFilter<"Position"> | Date | string
    updatedAt?: DateTimeFilter<"Position"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PositionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    balance?: SortOrder
    costBasis?: SortOrder
    entryPrice?: SortOrder
    currentPrice?: SortOrder
    currentValue?: SortOrder
    unrealizedPnl?: SortOrder
    unrealizedPnlPct?: SortOrder
    targetAllocation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PositionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_tokenAddress?: PositionUserIdTokenAddressCompoundUniqueInput
    AND?: PositionWhereInput | PositionWhereInput[]
    OR?: PositionWhereInput[]
    NOT?: PositionWhereInput | PositionWhereInput[]
    userId?: StringFilter<"Position"> | string
    tokenAddress?: StringFilter<"Position"> | string
    tokenSymbol?: StringFilter<"Position"> | string
    balance?: StringFilter<"Position"> | string
    costBasis?: StringFilter<"Position"> | string
    entryPrice?: StringFilter<"Position"> | string
    currentPrice?: StringFilter<"Position"> | string
    currentValue?: StringFilter<"Position"> | string
    unrealizedPnl?: StringFilter<"Position"> | string
    unrealizedPnlPct?: FloatFilter<"Position"> | number
    targetAllocation?: FloatNullableFilter<"Position"> | number | null
    createdAt?: DateTimeFilter<"Position"> | Date | string
    updatedAt?: DateTimeFilter<"Position"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_tokenAddress">

  export type PositionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    balance?: SortOrder
    costBasis?: SortOrder
    entryPrice?: SortOrder
    currentPrice?: SortOrder
    currentValue?: SortOrder
    unrealizedPnl?: SortOrder
    unrealizedPnlPct?: SortOrder
    targetAllocation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PositionCountOrderByAggregateInput
    _avg?: PositionAvgOrderByAggregateInput
    _max?: PositionMaxOrderByAggregateInput
    _min?: PositionMinOrderByAggregateInput
    _sum?: PositionSumOrderByAggregateInput
  }

  export type PositionScalarWhereWithAggregatesInput = {
    AND?: PositionScalarWhereWithAggregatesInput | PositionScalarWhereWithAggregatesInput[]
    OR?: PositionScalarWhereWithAggregatesInput[]
    NOT?: PositionScalarWhereWithAggregatesInput | PositionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Position"> | string
    userId?: StringWithAggregatesFilter<"Position"> | string
    tokenAddress?: StringWithAggregatesFilter<"Position"> | string
    tokenSymbol?: StringWithAggregatesFilter<"Position"> | string
    balance?: StringWithAggregatesFilter<"Position"> | string
    costBasis?: StringWithAggregatesFilter<"Position"> | string
    entryPrice?: StringWithAggregatesFilter<"Position"> | string
    currentPrice?: StringWithAggregatesFilter<"Position"> | string
    currentValue?: StringWithAggregatesFilter<"Position"> | string
    unrealizedPnl?: StringWithAggregatesFilter<"Position"> | string
    unrealizedPnlPct?: FloatWithAggregatesFilter<"Position"> | number
    targetAllocation?: FloatNullableWithAggregatesFilter<"Position"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Position"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Position"> | Date | string
  }

  export type StrategyPerformanceWhereInput = {
    AND?: StrategyPerformanceWhereInput | StrategyPerformanceWhereInput[]
    OR?: StrategyPerformanceWhereInput[]
    NOT?: StrategyPerformanceWhereInput | StrategyPerformanceWhereInput[]
    id?: StringFilter<"StrategyPerformance"> | string
    userId?: StringFilter<"StrategyPerformance"> | string
    strategyType?: EnumStrategyTypeFilter<"StrategyPerformance"> | $Enums.StrategyType
    periodStart?: DateTimeFilter<"StrategyPerformance"> | Date | string
    periodEnd?: DateTimeFilter<"StrategyPerformance"> | Date | string
    tradesCount?: IntFilter<"StrategyPerformance"> | number
    winCount?: IntFilter<"StrategyPerformance"> | number
    lossCount?: IntFilter<"StrategyPerformance"> | number
    winRate?: FloatFilter<"StrategyPerformance"> | number
    totalPnl?: StringFilter<"StrategyPerformance"> | string
    totalPnlPct?: FloatFilter<"StrategyPerformance"> | number
    bestTrade?: StringNullableFilter<"StrategyPerformance"> | string | null
    worstTrade?: StringNullableFilter<"StrategyPerformance"> | string | null
    avgTradeSize?: StringNullableFilter<"StrategyPerformance"> | string | null
    createdAt?: DateTimeFilter<"StrategyPerformance"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type StrategyPerformanceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    strategyType?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    tradesCount?: SortOrder
    winCount?: SortOrder
    lossCount?: SortOrder
    winRate?: SortOrder
    totalPnl?: SortOrder
    totalPnlPct?: SortOrder
    bestTrade?: SortOrderInput | SortOrder
    worstTrade?: SortOrderInput | SortOrder
    avgTradeSize?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type StrategyPerformanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StrategyPerformanceWhereInput | StrategyPerformanceWhereInput[]
    OR?: StrategyPerformanceWhereInput[]
    NOT?: StrategyPerformanceWhereInput | StrategyPerformanceWhereInput[]
    userId?: StringFilter<"StrategyPerformance"> | string
    strategyType?: EnumStrategyTypeFilter<"StrategyPerformance"> | $Enums.StrategyType
    periodStart?: DateTimeFilter<"StrategyPerformance"> | Date | string
    periodEnd?: DateTimeFilter<"StrategyPerformance"> | Date | string
    tradesCount?: IntFilter<"StrategyPerformance"> | number
    winCount?: IntFilter<"StrategyPerformance"> | number
    lossCount?: IntFilter<"StrategyPerformance"> | number
    winRate?: FloatFilter<"StrategyPerformance"> | number
    totalPnl?: StringFilter<"StrategyPerformance"> | string
    totalPnlPct?: FloatFilter<"StrategyPerformance"> | number
    bestTrade?: StringNullableFilter<"StrategyPerformance"> | string | null
    worstTrade?: StringNullableFilter<"StrategyPerformance"> | string | null
    avgTradeSize?: StringNullableFilter<"StrategyPerformance"> | string | null
    createdAt?: DateTimeFilter<"StrategyPerformance"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type StrategyPerformanceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    strategyType?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    tradesCount?: SortOrder
    winCount?: SortOrder
    lossCount?: SortOrder
    winRate?: SortOrder
    totalPnl?: SortOrder
    totalPnlPct?: SortOrder
    bestTrade?: SortOrderInput | SortOrder
    worstTrade?: SortOrderInput | SortOrder
    avgTradeSize?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: StrategyPerformanceCountOrderByAggregateInput
    _avg?: StrategyPerformanceAvgOrderByAggregateInput
    _max?: StrategyPerformanceMaxOrderByAggregateInput
    _min?: StrategyPerformanceMinOrderByAggregateInput
    _sum?: StrategyPerformanceSumOrderByAggregateInput
  }

  export type StrategyPerformanceScalarWhereWithAggregatesInput = {
    AND?: StrategyPerformanceScalarWhereWithAggregatesInput | StrategyPerformanceScalarWhereWithAggregatesInput[]
    OR?: StrategyPerformanceScalarWhereWithAggregatesInput[]
    NOT?: StrategyPerformanceScalarWhereWithAggregatesInput | StrategyPerformanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StrategyPerformance"> | string
    userId?: StringWithAggregatesFilter<"StrategyPerformance"> | string
    strategyType?: EnumStrategyTypeWithAggregatesFilter<"StrategyPerformance"> | $Enums.StrategyType
    periodStart?: DateTimeWithAggregatesFilter<"StrategyPerformance"> | Date | string
    periodEnd?: DateTimeWithAggregatesFilter<"StrategyPerformance"> | Date | string
    tradesCount?: IntWithAggregatesFilter<"StrategyPerformance"> | number
    winCount?: IntWithAggregatesFilter<"StrategyPerformance"> | number
    lossCount?: IntWithAggregatesFilter<"StrategyPerformance"> | number
    winRate?: FloatWithAggregatesFilter<"StrategyPerformance"> | number
    totalPnl?: StringWithAggregatesFilter<"StrategyPerformance"> | string
    totalPnlPct?: FloatWithAggregatesFilter<"StrategyPerformance"> | number
    bestTrade?: StringNullableWithAggregatesFilter<"StrategyPerformance"> | string | null
    worstTrade?: StringNullableWithAggregatesFilter<"StrategyPerformance"> | string | null
    avgTradeSize?: StringNullableWithAggregatesFilter<"StrategyPerformance"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StrategyPerformance"> | Date | string
  }

  export type TokenWhitelistWhereInput = {
    AND?: TokenWhitelistWhereInput | TokenWhitelistWhereInput[]
    OR?: TokenWhitelistWhereInput[]
    NOT?: TokenWhitelistWhereInput | TokenWhitelistWhereInput[]
    id?: StringFilter<"TokenWhitelist"> | string
    tokenAddress?: StringFilter<"TokenWhitelist"> | string
    tokenSymbol?: StringFilter<"TokenWhitelist"> | string
    riskLevel?: EnumRiskLevelFilter<"TokenWhitelist"> | $Enums.RiskLevel
    minMarketCap?: StringNullableFilter<"TokenWhitelist"> | string | null
    verified?: BoolFilter<"TokenWhitelist"> | boolean
    notes?: StringNullableFilter<"TokenWhitelist"> | string | null
    createdAt?: DateTimeFilter<"TokenWhitelist"> | Date | string
    updatedAt?: DateTimeFilter<"TokenWhitelist"> | Date | string
  }

  export type TokenWhitelistOrderByWithRelationInput = {
    id?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    riskLevel?: SortOrder
    minMarketCap?: SortOrderInput | SortOrder
    verified?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenWhitelistWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenAddress?: string
    AND?: TokenWhitelistWhereInput | TokenWhitelistWhereInput[]
    OR?: TokenWhitelistWhereInput[]
    NOT?: TokenWhitelistWhereInput | TokenWhitelistWhereInput[]
    tokenSymbol?: StringFilter<"TokenWhitelist"> | string
    riskLevel?: EnumRiskLevelFilter<"TokenWhitelist"> | $Enums.RiskLevel
    minMarketCap?: StringNullableFilter<"TokenWhitelist"> | string | null
    verified?: BoolFilter<"TokenWhitelist"> | boolean
    notes?: StringNullableFilter<"TokenWhitelist"> | string | null
    createdAt?: DateTimeFilter<"TokenWhitelist"> | Date | string
    updatedAt?: DateTimeFilter<"TokenWhitelist"> | Date | string
  }, "id" | "tokenAddress">

  export type TokenWhitelistOrderByWithAggregationInput = {
    id?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    riskLevel?: SortOrder
    minMarketCap?: SortOrderInput | SortOrder
    verified?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TokenWhitelistCountOrderByAggregateInput
    _max?: TokenWhitelistMaxOrderByAggregateInput
    _min?: TokenWhitelistMinOrderByAggregateInput
  }

  export type TokenWhitelistScalarWhereWithAggregatesInput = {
    AND?: TokenWhitelistScalarWhereWithAggregatesInput | TokenWhitelistScalarWhereWithAggregatesInput[]
    OR?: TokenWhitelistScalarWhereWithAggregatesInput[]
    NOT?: TokenWhitelistScalarWhereWithAggregatesInput | TokenWhitelistScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TokenWhitelist"> | string
    tokenAddress?: StringWithAggregatesFilter<"TokenWhitelist"> | string
    tokenSymbol?: StringWithAggregatesFilter<"TokenWhitelist"> | string
    riskLevel?: EnumRiskLevelWithAggregatesFilter<"TokenWhitelist"> | $Enums.RiskLevel
    minMarketCap?: StringNullableWithAggregatesFilter<"TokenWhitelist"> | string | null
    verified?: BoolWithAggregatesFilter<"TokenWhitelist"> | boolean
    notes?: StringNullableWithAggregatesFilter<"TokenWhitelist"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TokenWhitelist"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TokenWhitelist"> | Date | string
  }

  export type AgentLogWhereInput = {
    AND?: AgentLogWhereInput | AgentLogWhereInput[]
    OR?: AgentLogWhereInput[]
    NOT?: AgentLogWhereInput | AgentLogWhereInput[]
    id?: StringFilter<"AgentLog"> | string
    userId?: StringNullableFilter<"AgentLog"> | string | null
    action?: StringFilter<"AgentLog"> | string
    details?: JsonNullableFilter<"AgentLog">
    success?: BoolFilter<"AgentLog"> | boolean
    error?: StringNullableFilter<"AgentLog"> | string | null
    createdAt?: DateTimeFilter<"AgentLog"> | Date | string
  }

  export type AgentLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    success?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AgentLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AgentLogWhereInput | AgentLogWhereInput[]
    OR?: AgentLogWhereInput[]
    NOT?: AgentLogWhereInput | AgentLogWhereInput[]
    userId?: StringNullableFilter<"AgentLog"> | string | null
    action?: StringFilter<"AgentLog"> | string
    details?: JsonNullableFilter<"AgentLog">
    success?: BoolFilter<"AgentLog"> | boolean
    error?: StringNullableFilter<"AgentLog"> | string | null
    createdAt?: DateTimeFilter<"AgentLog"> | Date | string
  }, "id">

  export type AgentLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    success?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AgentLogCountOrderByAggregateInput
    _max?: AgentLogMaxOrderByAggregateInput
    _min?: AgentLogMinOrderByAggregateInput
  }

  export type AgentLogScalarWhereWithAggregatesInput = {
    AND?: AgentLogScalarWhereWithAggregatesInput | AgentLogScalarWhereWithAggregatesInput[]
    OR?: AgentLogScalarWhereWithAggregatesInput[]
    NOT?: AgentLogScalarWhereWithAggregatesInput | AgentLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentLog"> | string
    userId?: StringNullableWithAggregatesFilter<"AgentLog"> | string | null
    action?: StringWithAggregatesFilter<"AgentLog"> | string
    details?: JsonNullableWithAggregatesFilter<"AgentLog">
    success?: BoolWithAggregatesFilter<"AgentLog"> | boolean
    error?: StringNullableWithAggregatesFilter<"AgentLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AgentLog"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    walletAddress: string
    vaultAddress?: string | null
    xHandle?: string | null
    xUserId?: string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: $Enums.StrategyType
    confidenceThreshold?: number
    maxTradeAmount?: number
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: number
    stopLossPercent?: number | null
    takeProfitPercent?: number | null
    riskProfile?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trades?: TradeCreateNestedManyWithoutUserInput
    positions?: PositionCreateNestedManyWithoutUserInput
    performance?: StrategyPerformanceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    walletAddress: string
    vaultAddress?: string | null
    xHandle?: string | null
    xUserId?: string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: $Enums.StrategyType
    confidenceThreshold?: number
    maxTradeAmount?: number
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: number
    stopLossPercent?: number | null
    takeProfitPercent?: number | null
    riskProfile?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput
    positions?: PositionUncheckedCreateNestedManyWithoutUserInput
    performance?: StrategyPerformanceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    vaultAddress?: NullableStringFieldUpdateOperationsInput | string | null
    xHandle?: NullableStringFieldUpdateOperationsInput | string | null
    xUserId?: NullableStringFieldUpdateOperationsInput | string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    confidenceThreshold?: FloatFieldUpdateOperationsInput | number
    maxTradeAmount?: FloatFieldUpdateOperationsInput | number
    autoTrade?: BoolFieldUpdateOperationsInput | boolean
    autoRebalance?: BoolFieldUpdateOperationsInput | boolean
    rebalanceInterval?: IntFieldUpdateOperationsInput | number
    stopLossPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    takeProfitPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUpdateManyWithoutUserNestedInput
    positions?: PositionUpdateManyWithoutUserNestedInput
    performance?: StrategyPerformanceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    vaultAddress?: NullableStringFieldUpdateOperationsInput | string | null
    xHandle?: NullableStringFieldUpdateOperationsInput | string | null
    xUserId?: NullableStringFieldUpdateOperationsInput | string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    confidenceThreshold?: FloatFieldUpdateOperationsInput | number
    maxTradeAmount?: FloatFieldUpdateOperationsInput | number
    autoTrade?: BoolFieldUpdateOperationsInput | boolean
    autoRebalance?: BoolFieldUpdateOperationsInput | boolean
    rebalanceInterval?: IntFieldUpdateOperationsInput | number
    stopLossPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    takeProfitPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput
    positions?: PositionUncheckedUpdateManyWithoutUserNestedInput
    performance?: StrategyPerformanceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    walletAddress: string
    vaultAddress?: string | null
    xHandle?: string | null
    xUserId?: string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: $Enums.StrategyType
    confidenceThreshold?: number
    maxTradeAmount?: number
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: number
    stopLossPercent?: number | null
    takeProfitPercent?: number | null
    riskProfile?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    vaultAddress?: NullableStringFieldUpdateOperationsInput | string | null
    xHandle?: NullableStringFieldUpdateOperationsInput | string | null
    xUserId?: NullableStringFieldUpdateOperationsInput | string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    confidenceThreshold?: FloatFieldUpdateOperationsInput | number
    maxTradeAmount?: FloatFieldUpdateOperationsInput | number
    autoTrade?: BoolFieldUpdateOperationsInput | boolean
    autoRebalance?: BoolFieldUpdateOperationsInput | boolean
    rebalanceInterval?: IntFieldUpdateOperationsInput | number
    stopLossPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    takeProfitPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    vaultAddress?: NullableStringFieldUpdateOperationsInput | string | null
    xHandle?: NullableStringFieldUpdateOperationsInput | string | null
    xUserId?: NullableStringFieldUpdateOperationsInput | string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    confidenceThreshold?: FloatFieldUpdateOperationsInput | number
    maxTradeAmount?: FloatFieldUpdateOperationsInput | number
    autoTrade?: BoolFieldUpdateOperationsInput | boolean
    autoRebalance?: BoolFieldUpdateOperationsInput | boolean
    rebalanceInterval?: IntFieldUpdateOperationsInput | number
    stopLossPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    takeProfitPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeCreateInput = {
    id?: string
    tokenAddress: string
    tokenSymbol: string
    action: $Enums.TradeAction
    amountIn: string
    amountOut: string
    priceAtTrade: string
    confidence: number
    signalSource?: string | null
    reasoning?: string | null
    txHash?: string | null
    status?: $Enums.TradeStatus
    error?: string | null
    createdAt?: Date | string
    executedAt?: Date | string | null
    user: UserCreateNestedOneWithoutTradesInput
  }

  export type TradeUncheckedCreateInput = {
    id?: string
    userId: string
    tokenAddress: string
    tokenSymbol: string
    action: $Enums.TradeAction
    amountIn: string
    amountOut: string
    priceAtTrade: string
    confidence: number
    signalSource?: string | null
    reasoning?: string | null
    txHash?: string | null
    status?: $Enums.TradeStatus
    error?: string | null
    createdAt?: Date | string
    executedAt?: Date | string | null
  }

  export type TradeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    action?: EnumTradeActionFieldUpdateOperationsInput | $Enums.TradeAction
    amountIn?: StringFieldUpdateOperationsInput | string
    amountOut?: StringFieldUpdateOperationsInput | string
    priceAtTrade?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    signalSource?: NullableStringFieldUpdateOperationsInput | string | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutTradesNestedInput
  }

  export type TradeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    action?: EnumTradeActionFieldUpdateOperationsInput | $Enums.TradeAction
    amountIn?: StringFieldUpdateOperationsInput | string
    amountOut?: StringFieldUpdateOperationsInput | string
    priceAtTrade?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    signalSource?: NullableStringFieldUpdateOperationsInput | string | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TradeCreateManyInput = {
    id?: string
    userId: string
    tokenAddress: string
    tokenSymbol: string
    action: $Enums.TradeAction
    amountIn: string
    amountOut: string
    priceAtTrade: string
    confidence: number
    signalSource?: string | null
    reasoning?: string | null
    txHash?: string | null
    status?: $Enums.TradeStatus
    error?: string | null
    createdAt?: Date | string
    executedAt?: Date | string | null
  }

  export type TradeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    action?: EnumTradeActionFieldUpdateOperationsInput | $Enums.TradeAction
    amountIn?: StringFieldUpdateOperationsInput | string
    amountOut?: StringFieldUpdateOperationsInput | string
    priceAtTrade?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    signalSource?: NullableStringFieldUpdateOperationsInput | string | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TradeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    action?: EnumTradeActionFieldUpdateOperationsInput | $Enums.TradeAction
    amountIn?: StringFieldUpdateOperationsInput | string
    amountOut?: StringFieldUpdateOperationsInput | string
    priceAtTrade?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    signalSource?: NullableStringFieldUpdateOperationsInput | string | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PositionCreateInput = {
    id?: string
    tokenAddress: string
    tokenSymbol: string
    balance: string
    costBasis: string
    entryPrice: string
    currentPrice: string
    currentValue: string
    unrealizedPnl: string
    unrealizedPnlPct: number
    targetAllocation?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPositionsInput
  }

  export type PositionUncheckedCreateInput = {
    id?: string
    userId: string
    tokenAddress: string
    tokenSymbol: string
    balance: string
    costBasis: string
    entryPrice: string
    currentPrice: string
    currentValue: string
    unrealizedPnl: string
    unrealizedPnlPct: number
    targetAllocation?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PositionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    balance?: StringFieldUpdateOperationsInput | string
    costBasis?: StringFieldUpdateOperationsInput | string
    entryPrice?: StringFieldUpdateOperationsInput | string
    currentPrice?: StringFieldUpdateOperationsInput | string
    currentValue?: StringFieldUpdateOperationsInput | string
    unrealizedPnl?: StringFieldUpdateOperationsInput | string
    unrealizedPnlPct?: FloatFieldUpdateOperationsInput | number
    targetAllocation?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPositionsNestedInput
  }

  export type PositionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    balance?: StringFieldUpdateOperationsInput | string
    costBasis?: StringFieldUpdateOperationsInput | string
    entryPrice?: StringFieldUpdateOperationsInput | string
    currentPrice?: StringFieldUpdateOperationsInput | string
    currentValue?: StringFieldUpdateOperationsInput | string
    unrealizedPnl?: StringFieldUpdateOperationsInput | string
    unrealizedPnlPct?: FloatFieldUpdateOperationsInput | number
    targetAllocation?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PositionCreateManyInput = {
    id?: string
    userId: string
    tokenAddress: string
    tokenSymbol: string
    balance: string
    costBasis: string
    entryPrice: string
    currentPrice: string
    currentValue: string
    unrealizedPnl: string
    unrealizedPnlPct: number
    targetAllocation?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PositionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    balance?: StringFieldUpdateOperationsInput | string
    costBasis?: StringFieldUpdateOperationsInput | string
    entryPrice?: StringFieldUpdateOperationsInput | string
    currentPrice?: StringFieldUpdateOperationsInput | string
    currentValue?: StringFieldUpdateOperationsInput | string
    unrealizedPnl?: StringFieldUpdateOperationsInput | string
    unrealizedPnlPct?: FloatFieldUpdateOperationsInput | number
    targetAllocation?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PositionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    balance?: StringFieldUpdateOperationsInput | string
    costBasis?: StringFieldUpdateOperationsInput | string
    entryPrice?: StringFieldUpdateOperationsInput | string
    currentPrice?: StringFieldUpdateOperationsInput | string
    currentValue?: StringFieldUpdateOperationsInput | string
    unrealizedPnl?: StringFieldUpdateOperationsInput | string
    unrealizedPnlPct?: FloatFieldUpdateOperationsInput | number
    targetAllocation?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategyPerformanceCreateInput = {
    id?: string
    strategyType: $Enums.StrategyType
    periodStart: Date | string
    periodEnd: Date | string
    tradesCount: number
    winCount: number
    lossCount: number
    winRate: number
    totalPnl: string
    totalPnlPct: number
    bestTrade?: string | null
    worstTrade?: string | null
    avgTradeSize?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPerformanceInput
  }

  export type StrategyPerformanceUncheckedCreateInput = {
    id?: string
    userId: string
    strategyType: $Enums.StrategyType
    periodStart: Date | string
    periodEnd: Date | string
    tradesCount: number
    winCount: number
    lossCount: number
    winRate: number
    totalPnl: string
    totalPnlPct: number
    bestTrade?: string | null
    worstTrade?: string | null
    avgTradeSize?: string | null
    createdAt?: Date | string
  }

  export type StrategyPerformanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    tradesCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    lossCount?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    totalPnl?: StringFieldUpdateOperationsInput | string
    totalPnlPct?: FloatFieldUpdateOperationsInput | number
    bestTrade?: NullableStringFieldUpdateOperationsInput | string | null
    worstTrade?: NullableStringFieldUpdateOperationsInput | string | null
    avgTradeSize?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPerformanceNestedInput
  }

  export type StrategyPerformanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    tradesCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    lossCount?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    totalPnl?: StringFieldUpdateOperationsInput | string
    totalPnlPct?: FloatFieldUpdateOperationsInput | number
    bestTrade?: NullableStringFieldUpdateOperationsInput | string | null
    worstTrade?: NullableStringFieldUpdateOperationsInput | string | null
    avgTradeSize?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategyPerformanceCreateManyInput = {
    id?: string
    userId: string
    strategyType: $Enums.StrategyType
    periodStart: Date | string
    periodEnd: Date | string
    tradesCount: number
    winCount: number
    lossCount: number
    winRate: number
    totalPnl: string
    totalPnlPct: number
    bestTrade?: string | null
    worstTrade?: string | null
    avgTradeSize?: string | null
    createdAt?: Date | string
  }

  export type StrategyPerformanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    tradesCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    lossCount?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    totalPnl?: StringFieldUpdateOperationsInput | string
    totalPnlPct?: FloatFieldUpdateOperationsInput | number
    bestTrade?: NullableStringFieldUpdateOperationsInput | string | null
    worstTrade?: NullableStringFieldUpdateOperationsInput | string | null
    avgTradeSize?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategyPerformanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    tradesCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    lossCount?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    totalPnl?: StringFieldUpdateOperationsInput | string
    totalPnlPct?: FloatFieldUpdateOperationsInput | number
    bestTrade?: NullableStringFieldUpdateOperationsInput | string | null
    worstTrade?: NullableStringFieldUpdateOperationsInput | string | null
    avgTradeSize?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenWhitelistCreateInput = {
    id?: string
    tokenAddress: string
    tokenSymbol: string
    riskLevel: $Enums.RiskLevel
    minMarketCap?: string | null
    verified?: boolean
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenWhitelistUncheckedCreateInput = {
    id?: string
    tokenAddress: string
    tokenSymbol: string
    riskLevel: $Enums.RiskLevel
    minMarketCap?: string | null
    verified?: boolean
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenWhitelistUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    minMarketCap?: NullableStringFieldUpdateOperationsInput | string | null
    verified?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenWhitelistUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    minMarketCap?: NullableStringFieldUpdateOperationsInput | string | null
    verified?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenWhitelistCreateManyInput = {
    id?: string
    tokenAddress: string
    tokenSymbol: string
    riskLevel: $Enums.RiskLevel
    minMarketCap?: string | null
    verified?: boolean
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenWhitelistUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    minMarketCap?: NullableStringFieldUpdateOperationsInput | string | null
    verified?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenWhitelistUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    minMarketCap?: NullableStringFieldUpdateOperationsInput | string | null
    verified?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentLogCreateInput = {
    id?: string
    userId?: string | null
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    success: boolean
    error?: string | null
    createdAt?: Date | string
  }

  export type AgentLogUncheckedCreateInput = {
    id?: string
    userId?: string | null
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    success: boolean
    error?: string | null
    createdAt?: Date | string
  }

  export type AgentLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    success?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    success?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentLogCreateManyInput = {
    id?: string
    userId?: string | null
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    success: boolean
    error?: string | null
    createdAt?: Date | string
  }

  export type AgentLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    success?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    success?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumStrategyTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StrategyType | EnumStrategyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StrategyType[] | ListEnumStrategyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StrategyType[] | ListEnumStrategyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStrategyTypeFilter<$PrismaModel> | $Enums.StrategyType
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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

  export type TradeListRelationFilter = {
    every?: TradeWhereInput
    some?: TradeWhereInput
    none?: TradeWhereInput
  }

  export type PositionListRelationFilter = {
    every?: PositionWhereInput
    some?: PositionWhereInput
    none?: PositionWhereInput
  }

  export type StrategyPerformanceListRelationFilter = {
    every?: StrategyPerformanceWhereInput
    some?: StrategyPerformanceWhereInput
    none?: StrategyPerformanceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TradeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PositionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StrategyPerformanceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    vaultAddress?: SortOrder
    xHandle?: SortOrder
    xUserId?: SortOrder
    xAnalysis?: SortOrder
    strategyType?: SortOrder
    confidenceThreshold?: SortOrder
    maxTradeAmount?: SortOrder
    autoTrade?: SortOrder
    autoRebalance?: SortOrder
    rebalanceInterval?: SortOrder
    stopLossPercent?: SortOrder
    takeProfitPercent?: SortOrder
    riskProfile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    confidenceThreshold?: SortOrder
    maxTradeAmount?: SortOrder
    rebalanceInterval?: SortOrder
    stopLossPercent?: SortOrder
    takeProfitPercent?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    vaultAddress?: SortOrder
    xHandle?: SortOrder
    xUserId?: SortOrder
    strategyType?: SortOrder
    confidenceThreshold?: SortOrder
    maxTradeAmount?: SortOrder
    autoTrade?: SortOrder
    autoRebalance?: SortOrder
    rebalanceInterval?: SortOrder
    stopLossPercent?: SortOrder
    takeProfitPercent?: SortOrder
    riskProfile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    vaultAddress?: SortOrder
    xHandle?: SortOrder
    xUserId?: SortOrder
    strategyType?: SortOrder
    confidenceThreshold?: SortOrder
    maxTradeAmount?: SortOrder
    autoTrade?: SortOrder
    autoRebalance?: SortOrder
    rebalanceInterval?: SortOrder
    stopLossPercent?: SortOrder
    takeProfitPercent?: SortOrder
    riskProfile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    confidenceThreshold?: SortOrder
    maxTradeAmount?: SortOrder
    rebalanceInterval?: SortOrder
    stopLossPercent?: SortOrder
    takeProfitPercent?: SortOrder
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
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumStrategyTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StrategyType | EnumStrategyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StrategyType[] | ListEnumStrategyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StrategyType[] | ListEnumStrategyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStrategyTypeWithAggregatesFilter<$PrismaModel> | $Enums.StrategyType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStrategyTypeFilter<$PrismaModel>
    _max?: NestedEnumStrategyTypeFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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

  export type EnumTradeActionFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeAction | EnumTradeActionFieldRefInput<$PrismaModel>
    in?: $Enums.TradeAction[] | ListEnumTradeActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeAction[] | ListEnumTradeActionFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeActionFilter<$PrismaModel> | $Enums.TradeAction
  }

  export type EnumTradeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeStatus | EnumTradeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeStatusFilter<$PrismaModel> | $Enums.TradeStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TradeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    action?: SortOrder
    amountIn?: SortOrder
    amountOut?: SortOrder
    priceAtTrade?: SortOrder
    confidence?: SortOrder
    signalSource?: SortOrder
    reasoning?: SortOrder
    txHash?: SortOrder
    status?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    executedAt?: SortOrder
  }

  export type TradeAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type TradeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    action?: SortOrder
    amountIn?: SortOrder
    amountOut?: SortOrder
    priceAtTrade?: SortOrder
    confidence?: SortOrder
    signalSource?: SortOrder
    reasoning?: SortOrder
    txHash?: SortOrder
    status?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    executedAt?: SortOrder
  }

  export type TradeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    action?: SortOrder
    amountIn?: SortOrder
    amountOut?: SortOrder
    priceAtTrade?: SortOrder
    confidence?: SortOrder
    signalSource?: SortOrder
    reasoning?: SortOrder
    txHash?: SortOrder
    status?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    executedAt?: SortOrder
  }

  export type TradeSumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type EnumTradeActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeAction | EnumTradeActionFieldRefInput<$PrismaModel>
    in?: $Enums.TradeAction[] | ListEnumTradeActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeAction[] | ListEnumTradeActionFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeActionWithAggregatesFilter<$PrismaModel> | $Enums.TradeAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeActionFilter<$PrismaModel>
    _max?: NestedEnumTradeActionFilter<$PrismaModel>
  }

  export type EnumTradeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeStatus | EnumTradeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeStatusWithAggregatesFilter<$PrismaModel> | $Enums.TradeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeStatusFilter<$PrismaModel>
    _max?: NestedEnumTradeStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PositionUserIdTokenAddressCompoundUniqueInput = {
    userId: string
    tokenAddress: string
  }

  export type PositionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    balance?: SortOrder
    costBasis?: SortOrder
    entryPrice?: SortOrder
    currentPrice?: SortOrder
    currentValue?: SortOrder
    unrealizedPnl?: SortOrder
    unrealizedPnlPct?: SortOrder
    targetAllocation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PositionAvgOrderByAggregateInput = {
    unrealizedPnlPct?: SortOrder
    targetAllocation?: SortOrder
  }

  export type PositionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    balance?: SortOrder
    costBasis?: SortOrder
    entryPrice?: SortOrder
    currentPrice?: SortOrder
    currentValue?: SortOrder
    unrealizedPnl?: SortOrder
    unrealizedPnlPct?: SortOrder
    targetAllocation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PositionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    balance?: SortOrder
    costBasis?: SortOrder
    entryPrice?: SortOrder
    currentPrice?: SortOrder
    currentValue?: SortOrder
    unrealizedPnl?: SortOrder
    unrealizedPnlPct?: SortOrder
    targetAllocation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PositionSumOrderByAggregateInput = {
    unrealizedPnlPct?: SortOrder
    targetAllocation?: SortOrder
  }

  export type StrategyPerformanceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    strategyType?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    tradesCount?: SortOrder
    winCount?: SortOrder
    lossCount?: SortOrder
    winRate?: SortOrder
    totalPnl?: SortOrder
    totalPnlPct?: SortOrder
    bestTrade?: SortOrder
    worstTrade?: SortOrder
    avgTradeSize?: SortOrder
    createdAt?: SortOrder
  }

  export type StrategyPerformanceAvgOrderByAggregateInput = {
    tradesCount?: SortOrder
    winCount?: SortOrder
    lossCount?: SortOrder
    winRate?: SortOrder
    totalPnlPct?: SortOrder
  }

  export type StrategyPerformanceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    strategyType?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    tradesCount?: SortOrder
    winCount?: SortOrder
    lossCount?: SortOrder
    winRate?: SortOrder
    totalPnl?: SortOrder
    totalPnlPct?: SortOrder
    bestTrade?: SortOrder
    worstTrade?: SortOrder
    avgTradeSize?: SortOrder
    createdAt?: SortOrder
  }

  export type StrategyPerformanceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    strategyType?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    tradesCount?: SortOrder
    winCount?: SortOrder
    lossCount?: SortOrder
    winRate?: SortOrder
    totalPnl?: SortOrder
    totalPnlPct?: SortOrder
    bestTrade?: SortOrder
    worstTrade?: SortOrder
    avgTradeSize?: SortOrder
    createdAt?: SortOrder
  }

  export type StrategyPerformanceSumOrderByAggregateInput = {
    tradesCount?: SortOrder
    winCount?: SortOrder
    lossCount?: SortOrder
    winRate?: SortOrder
    totalPnlPct?: SortOrder
  }

  export type EnumRiskLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelFilter<$PrismaModel> | $Enums.RiskLevel
  }

  export type TokenWhitelistCountOrderByAggregateInput = {
    id?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    riskLevel?: SortOrder
    minMarketCap?: SortOrder
    verified?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenWhitelistMaxOrderByAggregateInput = {
    id?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    riskLevel?: SortOrder
    minMarketCap?: SortOrder
    verified?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenWhitelistMinOrderByAggregateInput = {
    id?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    riskLevel?: SortOrder
    minMarketCap?: SortOrder
    verified?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumRiskLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelWithAggregatesFilter<$PrismaModel> | $Enums.RiskLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRiskLevelFilter<$PrismaModel>
    _max?: NestedEnumRiskLevelFilter<$PrismaModel>
  }

  export type AgentLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    details?: SortOrder
    success?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    success?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    success?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type TradeCreateNestedManyWithoutUserInput = {
    create?: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput> | TradeCreateWithoutUserInput[] | TradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[]
    createMany?: TradeCreateManyUserInputEnvelope
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
  }

  export type PositionCreateNestedManyWithoutUserInput = {
    create?: XOR<PositionCreateWithoutUserInput, PositionUncheckedCreateWithoutUserInput> | PositionCreateWithoutUserInput[] | PositionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PositionCreateOrConnectWithoutUserInput | PositionCreateOrConnectWithoutUserInput[]
    createMany?: PositionCreateManyUserInputEnvelope
    connect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
  }

  export type StrategyPerformanceCreateNestedManyWithoutUserInput = {
    create?: XOR<StrategyPerformanceCreateWithoutUserInput, StrategyPerformanceUncheckedCreateWithoutUserInput> | StrategyPerformanceCreateWithoutUserInput[] | StrategyPerformanceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StrategyPerformanceCreateOrConnectWithoutUserInput | StrategyPerformanceCreateOrConnectWithoutUserInput[]
    createMany?: StrategyPerformanceCreateManyUserInputEnvelope
    connect?: StrategyPerformanceWhereUniqueInput | StrategyPerformanceWhereUniqueInput[]
  }

  export type TradeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput> | TradeCreateWithoutUserInput[] | TradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[]
    createMany?: TradeCreateManyUserInputEnvelope
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
  }

  export type PositionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PositionCreateWithoutUserInput, PositionUncheckedCreateWithoutUserInput> | PositionCreateWithoutUserInput[] | PositionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PositionCreateOrConnectWithoutUserInput | PositionCreateOrConnectWithoutUserInput[]
    createMany?: PositionCreateManyUserInputEnvelope
    connect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
  }

  export type StrategyPerformanceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<StrategyPerformanceCreateWithoutUserInput, StrategyPerformanceUncheckedCreateWithoutUserInput> | StrategyPerformanceCreateWithoutUserInput[] | StrategyPerformanceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StrategyPerformanceCreateOrConnectWithoutUserInput | StrategyPerformanceCreateOrConnectWithoutUserInput[]
    createMany?: StrategyPerformanceCreateManyUserInputEnvelope
    connect?: StrategyPerformanceWhereUniqueInput | StrategyPerformanceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumStrategyTypeFieldUpdateOperationsInput = {
    set?: $Enums.StrategyType
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TradeUpdateManyWithoutUserNestedInput = {
    create?: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput> | TradeCreateWithoutUserInput[] | TradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[]
    upsert?: TradeUpsertWithWhereUniqueWithoutUserInput | TradeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TradeCreateManyUserInputEnvelope
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    update?: TradeUpdateWithWhereUniqueWithoutUserInput | TradeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TradeUpdateManyWithWhereWithoutUserInput | TradeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[]
  }

  export type PositionUpdateManyWithoutUserNestedInput = {
    create?: XOR<PositionCreateWithoutUserInput, PositionUncheckedCreateWithoutUserInput> | PositionCreateWithoutUserInput[] | PositionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PositionCreateOrConnectWithoutUserInput | PositionCreateOrConnectWithoutUserInput[]
    upsert?: PositionUpsertWithWhereUniqueWithoutUserInput | PositionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PositionCreateManyUserInputEnvelope
    set?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    disconnect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    delete?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    connect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    update?: PositionUpdateWithWhereUniqueWithoutUserInput | PositionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PositionUpdateManyWithWhereWithoutUserInput | PositionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PositionScalarWhereInput | PositionScalarWhereInput[]
  }

  export type StrategyPerformanceUpdateManyWithoutUserNestedInput = {
    create?: XOR<StrategyPerformanceCreateWithoutUserInput, StrategyPerformanceUncheckedCreateWithoutUserInput> | StrategyPerformanceCreateWithoutUserInput[] | StrategyPerformanceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StrategyPerformanceCreateOrConnectWithoutUserInput | StrategyPerformanceCreateOrConnectWithoutUserInput[]
    upsert?: StrategyPerformanceUpsertWithWhereUniqueWithoutUserInput | StrategyPerformanceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: StrategyPerformanceCreateManyUserInputEnvelope
    set?: StrategyPerformanceWhereUniqueInput | StrategyPerformanceWhereUniqueInput[]
    disconnect?: StrategyPerformanceWhereUniqueInput | StrategyPerformanceWhereUniqueInput[]
    delete?: StrategyPerformanceWhereUniqueInput | StrategyPerformanceWhereUniqueInput[]
    connect?: StrategyPerformanceWhereUniqueInput | StrategyPerformanceWhereUniqueInput[]
    update?: StrategyPerformanceUpdateWithWhereUniqueWithoutUserInput | StrategyPerformanceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: StrategyPerformanceUpdateManyWithWhereWithoutUserInput | StrategyPerformanceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: StrategyPerformanceScalarWhereInput | StrategyPerformanceScalarWhereInput[]
  }

  export type TradeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput> | TradeCreateWithoutUserInput[] | TradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[]
    upsert?: TradeUpsertWithWhereUniqueWithoutUserInput | TradeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TradeCreateManyUserInputEnvelope
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    update?: TradeUpdateWithWhereUniqueWithoutUserInput | TradeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TradeUpdateManyWithWhereWithoutUserInput | TradeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[]
  }

  export type PositionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PositionCreateWithoutUserInput, PositionUncheckedCreateWithoutUserInput> | PositionCreateWithoutUserInput[] | PositionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PositionCreateOrConnectWithoutUserInput | PositionCreateOrConnectWithoutUserInput[]
    upsert?: PositionUpsertWithWhereUniqueWithoutUserInput | PositionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PositionCreateManyUserInputEnvelope
    set?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    disconnect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    delete?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    connect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    update?: PositionUpdateWithWhereUniqueWithoutUserInput | PositionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PositionUpdateManyWithWhereWithoutUserInput | PositionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PositionScalarWhereInput | PositionScalarWhereInput[]
  }

  export type StrategyPerformanceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<StrategyPerformanceCreateWithoutUserInput, StrategyPerformanceUncheckedCreateWithoutUserInput> | StrategyPerformanceCreateWithoutUserInput[] | StrategyPerformanceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StrategyPerformanceCreateOrConnectWithoutUserInput | StrategyPerformanceCreateOrConnectWithoutUserInput[]
    upsert?: StrategyPerformanceUpsertWithWhereUniqueWithoutUserInput | StrategyPerformanceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: StrategyPerformanceCreateManyUserInputEnvelope
    set?: StrategyPerformanceWhereUniqueInput | StrategyPerformanceWhereUniqueInput[]
    disconnect?: StrategyPerformanceWhereUniqueInput | StrategyPerformanceWhereUniqueInput[]
    delete?: StrategyPerformanceWhereUniqueInput | StrategyPerformanceWhereUniqueInput[]
    connect?: StrategyPerformanceWhereUniqueInput | StrategyPerformanceWhereUniqueInput[]
    update?: StrategyPerformanceUpdateWithWhereUniqueWithoutUserInput | StrategyPerformanceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: StrategyPerformanceUpdateManyWithWhereWithoutUserInput | StrategyPerformanceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: StrategyPerformanceScalarWhereInput | StrategyPerformanceScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTradesInput = {
    create?: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTradesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumTradeActionFieldUpdateOperationsInput = {
    set?: $Enums.TradeAction
  }

  export type EnumTradeStatusFieldUpdateOperationsInput = {
    set?: $Enums.TradeStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutTradesNestedInput = {
    create?: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTradesInput
    upsert?: UserUpsertWithoutTradesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTradesInput, UserUpdateWithoutTradesInput>, UserUncheckedUpdateWithoutTradesInput>
  }

  export type UserCreateNestedOneWithoutPositionsInput = {
    create?: XOR<UserCreateWithoutPositionsInput, UserUncheckedCreateWithoutPositionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPositionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPositionsNestedInput = {
    create?: XOR<UserCreateWithoutPositionsInput, UserUncheckedCreateWithoutPositionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPositionsInput
    upsert?: UserUpsertWithoutPositionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPositionsInput, UserUpdateWithoutPositionsInput>, UserUncheckedUpdateWithoutPositionsInput>
  }

  export type UserCreateNestedOneWithoutPerformanceInput = {
    create?: XOR<UserCreateWithoutPerformanceInput, UserUncheckedCreateWithoutPerformanceInput>
    connectOrCreate?: UserCreateOrConnectWithoutPerformanceInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPerformanceNestedInput = {
    create?: XOR<UserCreateWithoutPerformanceInput, UserUncheckedCreateWithoutPerformanceInput>
    connectOrCreate?: UserCreateOrConnectWithoutPerformanceInput
    upsert?: UserUpsertWithoutPerformanceInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPerformanceInput, UserUpdateWithoutPerformanceInput>, UserUncheckedUpdateWithoutPerformanceInput>
  }

  export type EnumRiskLevelFieldUpdateOperationsInput = {
    set?: $Enums.RiskLevel
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
  }

  export type NestedEnumStrategyTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StrategyType | EnumStrategyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StrategyType[] | ListEnumStrategyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StrategyType[] | ListEnumStrategyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStrategyTypeFilter<$PrismaModel> | $Enums.StrategyType
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumStrategyTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StrategyType | EnumStrategyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StrategyType[] | ListEnumStrategyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StrategyType[] | ListEnumStrategyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStrategyTypeWithAggregatesFilter<$PrismaModel> | $Enums.StrategyType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStrategyTypeFilter<$PrismaModel>
    _max?: NestedEnumStrategyTypeFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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

  export type NestedEnumTradeActionFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeAction | EnumTradeActionFieldRefInput<$PrismaModel>
    in?: $Enums.TradeAction[] | ListEnumTradeActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeAction[] | ListEnumTradeActionFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeActionFilter<$PrismaModel> | $Enums.TradeAction
  }

  export type NestedEnumTradeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeStatus | EnumTradeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeStatusFilter<$PrismaModel> | $Enums.TradeStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumTradeActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeAction | EnumTradeActionFieldRefInput<$PrismaModel>
    in?: $Enums.TradeAction[] | ListEnumTradeActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeAction[] | ListEnumTradeActionFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeActionWithAggregatesFilter<$PrismaModel> | $Enums.TradeAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeActionFilter<$PrismaModel>
    _max?: NestedEnumTradeActionFilter<$PrismaModel>
  }

  export type NestedEnumTradeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeStatus | EnumTradeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeStatusWithAggregatesFilter<$PrismaModel> | $Enums.TradeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeStatusFilter<$PrismaModel>
    _max?: NestedEnumTradeStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumRiskLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelFilter<$PrismaModel> | $Enums.RiskLevel
  }

  export type NestedEnumRiskLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelWithAggregatesFilter<$PrismaModel> | $Enums.RiskLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRiskLevelFilter<$PrismaModel>
    _max?: NestedEnumRiskLevelFilter<$PrismaModel>
  }

  export type TradeCreateWithoutUserInput = {
    id?: string
    tokenAddress: string
    tokenSymbol: string
    action: $Enums.TradeAction
    amountIn: string
    amountOut: string
    priceAtTrade: string
    confidence: number
    signalSource?: string | null
    reasoning?: string | null
    txHash?: string | null
    status?: $Enums.TradeStatus
    error?: string | null
    createdAt?: Date | string
    executedAt?: Date | string | null
  }

  export type TradeUncheckedCreateWithoutUserInput = {
    id?: string
    tokenAddress: string
    tokenSymbol: string
    action: $Enums.TradeAction
    amountIn: string
    amountOut: string
    priceAtTrade: string
    confidence: number
    signalSource?: string | null
    reasoning?: string | null
    txHash?: string | null
    status?: $Enums.TradeStatus
    error?: string | null
    createdAt?: Date | string
    executedAt?: Date | string | null
  }

  export type TradeCreateOrConnectWithoutUserInput = {
    where: TradeWhereUniqueInput
    create: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput>
  }

  export type TradeCreateManyUserInputEnvelope = {
    data: TradeCreateManyUserInput | TradeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PositionCreateWithoutUserInput = {
    id?: string
    tokenAddress: string
    tokenSymbol: string
    balance: string
    costBasis: string
    entryPrice: string
    currentPrice: string
    currentValue: string
    unrealizedPnl: string
    unrealizedPnlPct: number
    targetAllocation?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PositionUncheckedCreateWithoutUserInput = {
    id?: string
    tokenAddress: string
    tokenSymbol: string
    balance: string
    costBasis: string
    entryPrice: string
    currentPrice: string
    currentValue: string
    unrealizedPnl: string
    unrealizedPnlPct: number
    targetAllocation?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PositionCreateOrConnectWithoutUserInput = {
    where: PositionWhereUniqueInput
    create: XOR<PositionCreateWithoutUserInput, PositionUncheckedCreateWithoutUserInput>
  }

  export type PositionCreateManyUserInputEnvelope = {
    data: PositionCreateManyUserInput | PositionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type StrategyPerformanceCreateWithoutUserInput = {
    id?: string
    strategyType: $Enums.StrategyType
    periodStart: Date | string
    periodEnd: Date | string
    tradesCount: number
    winCount: number
    lossCount: number
    winRate: number
    totalPnl: string
    totalPnlPct: number
    bestTrade?: string | null
    worstTrade?: string | null
    avgTradeSize?: string | null
    createdAt?: Date | string
  }

  export type StrategyPerformanceUncheckedCreateWithoutUserInput = {
    id?: string
    strategyType: $Enums.StrategyType
    periodStart: Date | string
    periodEnd: Date | string
    tradesCount: number
    winCount: number
    lossCount: number
    winRate: number
    totalPnl: string
    totalPnlPct: number
    bestTrade?: string | null
    worstTrade?: string | null
    avgTradeSize?: string | null
    createdAt?: Date | string
  }

  export type StrategyPerformanceCreateOrConnectWithoutUserInput = {
    where: StrategyPerformanceWhereUniqueInput
    create: XOR<StrategyPerformanceCreateWithoutUserInput, StrategyPerformanceUncheckedCreateWithoutUserInput>
  }

  export type StrategyPerformanceCreateManyUserInputEnvelope = {
    data: StrategyPerformanceCreateManyUserInput | StrategyPerformanceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TradeUpsertWithWhereUniqueWithoutUserInput = {
    where: TradeWhereUniqueInput
    update: XOR<TradeUpdateWithoutUserInput, TradeUncheckedUpdateWithoutUserInput>
    create: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput>
  }

  export type TradeUpdateWithWhereUniqueWithoutUserInput = {
    where: TradeWhereUniqueInput
    data: XOR<TradeUpdateWithoutUserInput, TradeUncheckedUpdateWithoutUserInput>
  }

  export type TradeUpdateManyWithWhereWithoutUserInput = {
    where: TradeScalarWhereInput
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyWithoutUserInput>
  }

  export type TradeScalarWhereInput = {
    AND?: TradeScalarWhereInput | TradeScalarWhereInput[]
    OR?: TradeScalarWhereInput[]
    NOT?: TradeScalarWhereInput | TradeScalarWhereInput[]
    id?: StringFilter<"Trade"> | string
    userId?: StringFilter<"Trade"> | string
    tokenAddress?: StringFilter<"Trade"> | string
    tokenSymbol?: StringFilter<"Trade"> | string
    action?: EnumTradeActionFilter<"Trade"> | $Enums.TradeAction
    amountIn?: StringFilter<"Trade"> | string
    amountOut?: StringFilter<"Trade"> | string
    priceAtTrade?: StringFilter<"Trade"> | string
    confidence?: FloatFilter<"Trade"> | number
    signalSource?: StringNullableFilter<"Trade"> | string | null
    reasoning?: StringNullableFilter<"Trade"> | string | null
    txHash?: StringNullableFilter<"Trade"> | string | null
    status?: EnumTradeStatusFilter<"Trade"> | $Enums.TradeStatus
    error?: StringNullableFilter<"Trade"> | string | null
    createdAt?: DateTimeFilter<"Trade"> | Date | string
    executedAt?: DateTimeNullableFilter<"Trade"> | Date | string | null
  }

  export type PositionUpsertWithWhereUniqueWithoutUserInput = {
    where: PositionWhereUniqueInput
    update: XOR<PositionUpdateWithoutUserInput, PositionUncheckedUpdateWithoutUserInput>
    create: XOR<PositionCreateWithoutUserInput, PositionUncheckedCreateWithoutUserInput>
  }

  export type PositionUpdateWithWhereUniqueWithoutUserInput = {
    where: PositionWhereUniqueInput
    data: XOR<PositionUpdateWithoutUserInput, PositionUncheckedUpdateWithoutUserInput>
  }

  export type PositionUpdateManyWithWhereWithoutUserInput = {
    where: PositionScalarWhereInput
    data: XOR<PositionUpdateManyMutationInput, PositionUncheckedUpdateManyWithoutUserInput>
  }

  export type PositionScalarWhereInput = {
    AND?: PositionScalarWhereInput | PositionScalarWhereInput[]
    OR?: PositionScalarWhereInput[]
    NOT?: PositionScalarWhereInput | PositionScalarWhereInput[]
    id?: StringFilter<"Position"> | string
    userId?: StringFilter<"Position"> | string
    tokenAddress?: StringFilter<"Position"> | string
    tokenSymbol?: StringFilter<"Position"> | string
    balance?: StringFilter<"Position"> | string
    costBasis?: StringFilter<"Position"> | string
    entryPrice?: StringFilter<"Position"> | string
    currentPrice?: StringFilter<"Position"> | string
    currentValue?: StringFilter<"Position"> | string
    unrealizedPnl?: StringFilter<"Position"> | string
    unrealizedPnlPct?: FloatFilter<"Position"> | number
    targetAllocation?: FloatNullableFilter<"Position"> | number | null
    createdAt?: DateTimeFilter<"Position"> | Date | string
    updatedAt?: DateTimeFilter<"Position"> | Date | string
  }

  export type StrategyPerformanceUpsertWithWhereUniqueWithoutUserInput = {
    where: StrategyPerformanceWhereUniqueInput
    update: XOR<StrategyPerformanceUpdateWithoutUserInput, StrategyPerformanceUncheckedUpdateWithoutUserInput>
    create: XOR<StrategyPerformanceCreateWithoutUserInput, StrategyPerformanceUncheckedCreateWithoutUserInput>
  }

  export type StrategyPerformanceUpdateWithWhereUniqueWithoutUserInput = {
    where: StrategyPerformanceWhereUniqueInput
    data: XOR<StrategyPerformanceUpdateWithoutUserInput, StrategyPerformanceUncheckedUpdateWithoutUserInput>
  }

  export type StrategyPerformanceUpdateManyWithWhereWithoutUserInput = {
    where: StrategyPerformanceScalarWhereInput
    data: XOR<StrategyPerformanceUpdateManyMutationInput, StrategyPerformanceUncheckedUpdateManyWithoutUserInput>
  }

  export type StrategyPerformanceScalarWhereInput = {
    AND?: StrategyPerformanceScalarWhereInput | StrategyPerformanceScalarWhereInput[]
    OR?: StrategyPerformanceScalarWhereInput[]
    NOT?: StrategyPerformanceScalarWhereInput | StrategyPerformanceScalarWhereInput[]
    id?: StringFilter<"StrategyPerformance"> | string
    userId?: StringFilter<"StrategyPerformance"> | string
    strategyType?: EnumStrategyTypeFilter<"StrategyPerformance"> | $Enums.StrategyType
    periodStart?: DateTimeFilter<"StrategyPerformance"> | Date | string
    periodEnd?: DateTimeFilter<"StrategyPerformance"> | Date | string
    tradesCount?: IntFilter<"StrategyPerformance"> | number
    winCount?: IntFilter<"StrategyPerformance"> | number
    lossCount?: IntFilter<"StrategyPerformance"> | number
    winRate?: FloatFilter<"StrategyPerformance"> | number
    totalPnl?: StringFilter<"StrategyPerformance"> | string
    totalPnlPct?: FloatFilter<"StrategyPerformance"> | number
    bestTrade?: StringNullableFilter<"StrategyPerformance"> | string | null
    worstTrade?: StringNullableFilter<"StrategyPerformance"> | string | null
    avgTradeSize?: StringNullableFilter<"StrategyPerformance"> | string | null
    createdAt?: DateTimeFilter<"StrategyPerformance"> | Date | string
  }

  export type UserCreateWithoutTradesInput = {
    id?: string
    walletAddress: string
    vaultAddress?: string | null
    xHandle?: string | null
    xUserId?: string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: $Enums.StrategyType
    confidenceThreshold?: number
    maxTradeAmount?: number
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: number
    stopLossPercent?: number | null
    takeProfitPercent?: number | null
    riskProfile?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    positions?: PositionCreateNestedManyWithoutUserInput
    performance?: StrategyPerformanceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTradesInput = {
    id?: string
    walletAddress: string
    vaultAddress?: string | null
    xHandle?: string | null
    xUserId?: string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: $Enums.StrategyType
    confidenceThreshold?: number
    maxTradeAmount?: number
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: number
    stopLossPercent?: number | null
    takeProfitPercent?: number | null
    riskProfile?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    positions?: PositionUncheckedCreateNestedManyWithoutUserInput
    performance?: StrategyPerformanceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTradesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>
  }

  export type UserUpsertWithoutTradesInput = {
    update: XOR<UserUpdateWithoutTradesInput, UserUncheckedUpdateWithoutTradesInput>
    create: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTradesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTradesInput, UserUncheckedUpdateWithoutTradesInput>
  }

  export type UserUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    vaultAddress?: NullableStringFieldUpdateOperationsInput | string | null
    xHandle?: NullableStringFieldUpdateOperationsInput | string | null
    xUserId?: NullableStringFieldUpdateOperationsInput | string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    confidenceThreshold?: FloatFieldUpdateOperationsInput | number
    maxTradeAmount?: FloatFieldUpdateOperationsInput | number
    autoTrade?: BoolFieldUpdateOperationsInput | boolean
    autoRebalance?: BoolFieldUpdateOperationsInput | boolean
    rebalanceInterval?: IntFieldUpdateOperationsInput | number
    stopLossPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    takeProfitPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    positions?: PositionUpdateManyWithoutUserNestedInput
    performance?: StrategyPerformanceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    vaultAddress?: NullableStringFieldUpdateOperationsInput | string | null
    xHandle?: NullableStringFieldUpdateOperationsInput | string | null
    xUserId?: NullableStringFieldUpdateOperationsInput | string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    confidenceThreshold?: FloatFieldUpdateOperationsInput | number
    maxTradeAmount?: FloatFieldUpdateOperationsInput | number
    autoTrade?: BoolFieldUpdateOperationsInput | boolean
    autoRebalance?: BoolFieldUpdateOperationsInput | boolean
    rebalanceInterval?: IntFieldUpdateOperationsInput | number
    stopLossPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    takeProfitPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    positions?: PositionUncheckedUpdateManyWithoutUserNestedInput
    performance?: StrategyPerformanceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPositionsInput = {
    id?: string
    walletAddress: string
    vaultAddress?: string | null
    xHandle?: string | null
    xUserId?: string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: $Enums.StrategyType
    confidenceThreshold?: number
    maxTradeAmount?: number
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: number
    stopLossPercent?: number | null
    takeProfitPercent?: number | null
    riskProfile?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trades?: TradeCreateNestedManyWithoutUserInput
    performance?: StrategyPerformanceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPositionsInput = {
    id?: string
    walletAddress: string
    vaultAddress?: string | null
    xHandle?: string | null
    xUserId?: string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: $Enums.StrategyType
    confidenceThreshold?: number
    maxTradeAmount?: number
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: number
    stopLossPercent?: number | null
    takeProfitPercent?: number | null
    riskProfile?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput
    performance?: StrategyPerformanceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPositionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPositionsInput, UserUncheckedCreateWithoutPositionsInput>
  }

  export type UserUpsertWithoutPositionsInput = {
    update: XOR<UserUpdateWithoutPositionsInput, UserUncheckedUpdateWithoutPositionsInput>
    create: XOR<UserCreateWithoutPositionsInput, UserUncheckedCreateWithoutPositionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPositionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPositionsInput, UserUncheckedUpdateWithoutPositionsInput>
  }

  export type UserUpdateWithoutPositionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    vaultAddress?: NullableStringFieldUpdateOperationsInput | string | null
    xHandle?: NullableStringFieldUpdateOperationsInput | string | null
    xUserId?: NullableStringFieldUpdateOperationsInput | string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    confidenceThreshold?: FloatFieldUpdateOperationsInput | number
    maxTradeAmount?: FloatFieldUpdateOperationsInput | number
    autoTrade?: BoolFieldUpdateOperationsInput | boolean
    autoRebalance?: BoolFieldUpdateOperationsInput | boolean
    rebalanceInterval?: IntFieldUpdateOperationsInput | number
    stopLossPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    takeProfitPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUpdateManyWithoutUserNestedInput
    performance?: StrategyPerformanceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPositionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    vaultAddress?: NullableStringFieldUpdateOperationsInput | string | null
    xHandle?: NullableStringFieldUpdateOperationsInput | string | null
    xUserId?: NullableStringFieldUpdateOperationsInput | string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    confidenceThreshold?: FloatFieldUpdateOperationsInput | number
    maxTradeAmount?: FloatFieldUpdateOperationsInput | number
    autoTrade?: BoolFieldUpdateOperationsInput | boolean
    autoRebalance?: BoolFieldUpdateOperationsInput | boolean
    rebalanceInterval?: IntFieldUpdateOperationsInput | number
    stopLossPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    takeProfitPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput
    performance?: StrategyPerformanceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPerformanceInput = {
    id?: string
    walletAddress: string
    vaultAddress?: string | null
    xHandle?: string | null
    xUserId?: string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: $Enums.StrategyType
    confidenceThreshold?: number
    maxTradeAmount?: number
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: number
    stopLossPercent?: number | null
    takeProfitPercent?: number | null
    riskProfile?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trades?: TradeCreateNestedManyWithoutUserInput
    positions?: PositionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPerformanceInput = {
    id?: string
    walletAddress: string
    vaultAddress?: string | null
    xHandle?: string | null
    xUserId?: string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: $Enums.StrategyType
    confidenceThreshold?: number
    maxTradeAmount?: number
    autoTrade?: boolean
    autoRebalance?: boolean
    rebalanceInterval?: number
    stopLossPercent?: number | null
    takeProfitPercent?: number | null
    riskProfile?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput
    positions?: PositionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPerformanceInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPerformanceInput, UserUncheckedCreateWithoutPerformanceInput>
  }

  export type UserUpsertWithoutPerformanceInput = {
    update: XOR<UserUpdateWithoutPerformanceInput, UserUncheckedUpdateWithoutPerformanceInput>
    create: XOR<UserCreateWithoutPerformanceInput, UserUncheckedCreateWithoutPerformanceInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPerformanceInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPerformanceInput, UserUncheckedUpdateWithoutPerformanceInput>
  }

  export type UserUpdateWithoutPerformanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    vaultAddress?: NullableStringFieldUpdateOperationsInput | string | null
    xHandle?: NullableStringFieldUpdateOperationsInput | string | null
    xUserId?: NullableStringFieldUpdateOperationsInput | string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    confidenceThreshold?: FloatFieldUpdateOperationsInput | number
    maxTradeAmount?: FloatFieldUpdateOperationsInput | number
    autoTrade?: BoolFieldUpdateOperationsInput | boolean
    autoRebalance?: BoolFieldUpdateOperationsInput | boolean
    rebalanceInterval?: IntFieldUpdateOperationsInput | number
    stopLossPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    takeProfitPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUpdateManyWithoutUserNestedInput
    positions?: PositionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPerformanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: StringFieldUpdateOperationsInput | string
    vaultAddress?: NullableStringFieldUpdateOperationsInput | string | null
    xHandle?: NullableStringFieldUpdateOperationsInput | string | null
    xUserId?: NullableStringFieldUpdateOperationsInput | string | null
    xAnalysis?: NullableJsonNullValueInput | InputJsonValue
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    confidenceThreshold?: FloatFieldUpdateOperationsInput | number
    maxTradeAmount?: FloatFieldUpdateOperationsInput | number
    autoTrade?: BoolFieldUpdateOperationsInput | boolean
    autoRebalance?: BoolFieldUpdateOperationsInput | boolean
    rebalanceInterval?: IntFieldUpdateOperationsInput | number
    stopLossPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    takeProfitPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput
    positions?: PositionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TradeCreateManyUserInput = {
    id?: string
    tokenAddress: string
    tokenSymbol: string
    action: $Enums.TradeAction
    amountIn: string
    amountOut: string
    priceAtTrade: string
    confidence: number
    signalSource?: string | null
    reasoning?: string | null
    txHash?: string | null
    status?: $Enums.TradeStatus
    error?: string | null
    createdAt?: Date | string
    executedAt?: Date | string | null
  }

  export type PositionCreateManyUserInput = {
    id?: string
    tokenAddress: string
    tokenSymbol: string
    balance: string
    costBasis: string
    entryPrice: string
    currentPrice: string
    currentValue: string
    unrealizedPnl: string
    unrealizedPnlPct: number
    targetAllocation?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StrategyPerformanceCreateManyUserInput = {
    id?: string
    strategyType: $Enums.StrategyType
    periodStart: Date | string
    periodEnd: Date | string
    tradesCount: number
    winCount: number
    lossCount: number
    winRate: number
    totalPnl: string
    totalPnlPct: number
    bestTrade?: string | null
    worstTrade?: string | null
    avgTradeSize?: string | null
    createdAt?: Date | string
  }

  export type TradeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    action?: EnumTradeActionFieldUpdateOperationsInput | $Enums.TradeAction
    amountIn?: StringFieldUpdateOperationsInput | string
    amountOut?: StringFieldUpdateOperationsInput | string
    priceAtTrade?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    signalSource?: NullableStringFieldUpdateOperationsInput | string | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TradeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    action?: EnumTradeActionFieldUpdateOperationsInput | $Enums.TradeAction
    amountIn?: StringFieldUpdateOperationsInput | string
    amountOut?: StringFieldUpdateOperationsInput | string
    priceAtTrade?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    signalSource?: NullableStringFieldUpdateOperationsInput | string | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TradeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    action?: EnumTradeActionFieldUpdateOperationsInput | $Enums.TradeAction
    amountIn?: StringFieldUpdateOperationsInput | string
    amountOut?: StringFieldUpdateOperationsInput | string
    priceAtTrade?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    signalSource?: NullableStringFieldUpdateOperationsInput | string | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PositionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    balance?: StringFieldUpdateOperationsInput | string
    costBasis?: StringFieldUpdateOperationsInput | string
    entryPrice?: StringFieldUpdateOperationsInput | string
    currentPrice?: StringFieldUpdateOperationsInput | string
    currentValue?: StringFieldUpdateOperationsInput | string
    unrealizedPnl?: StringFieldUpdateOperationsInput | string
    unrealizedPnlPct?: FloatFieldUpdateOperationsInput | number
    targetAllocation?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PositionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    balance?: StringFieldUpdateOperationsInput | string
    costBasis?: StringFieldUpdateOperationsInput | string
    entryPrice?: StringFieldUpdateOperationsInput | string
    currentPrice?: StringFieldUpdateOperationsInput | string
    currentValue?: StringFieldUpdateOperationsInput | string
    unrealizedPnl?: StringFieldUpdateOperationsInput | string
    unrealizedPnlPct?: FloatFieldUpdateOperationsInput | number
    targetAllocation?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PositionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    balance?: StringFieldUpdateOperationsInput | string
    costBasis?: StringFieldUpdateOperationsInput | string
    entryPrice?: StringFieldUpdateOperationsInput | string
    currentPrice?: StringFieldUpdateOperationsInput | string
    currentValue?: StringFieldUpdateOperationsInput | string
    unrealizedPnl?: StringFieldUpdateOperationsInput | string
    unrealizedPnlPct?: FloatFieldUpdateOperationsInput | number
    targetAllocation?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategyPerformanceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    tradesCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    lossCount?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    totalPnl?: StringFieldUpdateOperationsInput | string
    totalPnlPct?: FloatFieldUpdateOperationsInput | number
    bestTrade?: NullableStringFieldUpdateOperationsInput | string | null
    worstTrade?: NullableStringFieldUpdateOperationsInput | string | null
    avgTradeSize?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategyPerformanceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    tradesCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    lossCount?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    totalPnl?: StringFieldUpdateOperationsInput | string
    totalPnlPct?: FloatFieldUpdateOperationsInput | number
    bestTrade?: NullableStringFieldUpdateOperationsInput | string | null
    worstTrade?: NullableStringFieldUpdateOperationsInput | string | null
    avgTradeSize?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategyPerformanceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    strategyType?: EnumStrategyTypeFieldUpdateOperationsInput | $Enums.StrategyType
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    tradesCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    lossCount?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    totalPnl?: StringFieldUpdateOperationsInput | string
    totalPnlPct?: FloatFieldUpdateOperationsInput | number
    bestTrade?: NullableStringFieldUpdateOperationsInput | string | null
    worstTrade?: NullableStringFieldUpdateOperationsInput | string | null
    avgTradeSize?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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