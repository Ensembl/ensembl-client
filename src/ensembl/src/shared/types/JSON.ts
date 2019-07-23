export type PrimitiveValue = string | number | boolean | null | undefined;
export type ArrayValue = PrimitiveValue[] | JSONValue[];
export type PrimitiveOrArrayValue = PrimitiveValue | ArrayValue;

type JSONValue = {
  [key: string]: PrimitiveOrArrayValue | JSONValue;
};

export default JSONValue;
