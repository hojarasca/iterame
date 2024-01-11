export type Mapping<A, B> = (a: A) => B
export type Predicate<A> = (a: A) => boolean
export type Callback<A> = (a: A) => void
export type AreEqual<A> = (a1: A, a2: A) => boolean
