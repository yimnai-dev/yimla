import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
// @ts-ignore
type MatcherParam<M> = M extends (param : string) => param is infer U ? U extends string ? U : string : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageParentData = EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/" | "/[...path]" | "/app" | "/app/medication" | "/app/medication/new" | "/app/pharmacies" | "/app/pharmacies/[pharmacyId]" | "/app/pharmacies/[pharmacyId]/edit" | "/app/pharmacies/[pharmacyId]/pharmacists" | "/app/pharmacies/new" | "/app/pharmacists" | "/app/pharmacists/new" | "/app/subscriptions" | "/app/subscriptions/cancel" | "/app/subscriptions/success" | "/auth/forgot-password" | "/auth/login" | "/auth/reset-password" | "/auth/signup" | "/auth/verify-email" | "/tkc" | "/tkc/recommendations" | "/tkc/search-history" | "/tko" | "/tko/medication" | "/tko/pharmacies" | "/tko/pharmacies/[pharmacyId]/edit" | "/tko/pharmacies/new" | "/tko/pharmacists" | "/tko/pharmacists/new" | "/tko/subscriptions" | "/tko/subscriptions/cancel" | "/tko/subscriptions/success" | "/tkp" | "/tkp/medication" | "/tkp/medication/new" | "/tkp/search" | null
type LayoutParams = RouteParams & { path?: string; pharmacyId?: string }
type LayoutServerParentData = EnsureDefined<{}>;
type LayoutParentData = EnsureDefined<{}>;

export type PageServerData = null;
export type PageData = Expand<PageParentData>;
export type LayoutServerLoad<OutputData extends Partial<App.PageData> & Record<string, any> | void = Partial<App.PageData> & Record<string, any> | void> = Kit.ServerLoad<LayoutParams, LayoutServerParentData, OutputData, LayoutRouteId>;
export type LayoutServerLoadEvent = Parameters<LayoutServerLoad>[0];
export type LayoutServerData = Expand<OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('../../../../src/routes/+layout.server.js').load>>>>>>;
export type LayoutLoad<OutputData extends OutputDataShape<LayoutParentData> = OutputDataShape<LayoutParentData>> = Kit.Load<LayoutParams, LayoutServerData, LayoutParentData, OutputData, LayoutRouteId>;
export type LayoutLoadEvent = Parameters<LayoutLoad>[0];
export type LayoutData = Expand<Omit<LayoutParentData, keyof Kit.LoadProperties<Awaited<ReturnType<typeof import('../../../../src/routes/+layout.js').load>>>> & OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('../../../../src/routes/+layout.js').load>>>>>>;
export type RequestEvent = Kit.RequestEvent<RouteParams, RouteId>;