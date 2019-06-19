export type PrimitiveValue = string | number | boolean | null | undefined;
export type ArrayValue = PrimitiveValue[] | JSONValue[];

type JSONValue = {
  [key: string]: PrimitiveValue | ArrayValue | JSONValue;
};

export default JSONValue;
