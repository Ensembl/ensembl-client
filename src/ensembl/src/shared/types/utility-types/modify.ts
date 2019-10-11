/*

The Modify type makes it possible to overwrite specific fields of a given type

e.g.:

type InitialType = {
  foo: string;
  bar: string;
};

type ModifiedType = Modify<InitialType, {
  bar: number;
}>

will give us the ModifiedType that is {
  foo: string,
  bar: number
}
*/

export type Modify<T, R> = Omit<T, keyof R> & R;
