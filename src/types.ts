import {Option} from "nochoices";

export type Mapping<A, B> = (a: A) => B
export type OptionalMapping<A, B> = (a: A) => Option<B>
export type Predicate<A> = (a: A) => boolean
export type Callback<A> = (a: A) => void
export type AreEqual<A> = (a1: A, a2: A) => boolean
export type GenValue<A> = () => A
export type CompareFn<A> = (a1: A, a2: A) => number
