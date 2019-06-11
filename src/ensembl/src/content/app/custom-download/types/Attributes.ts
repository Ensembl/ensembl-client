export type Attribute = {
  isChecked: boolean;
  id: string;
  label: string;
};

export type AttributesSubSection = {
  [key: string]: Attribute;
};

type AttributesSection = {
  [key: string]: AttributesSubSection;
};

export default AttributesSection;
