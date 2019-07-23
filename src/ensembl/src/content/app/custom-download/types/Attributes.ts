import { RadioOptions } from 'src/shared/radio/Radio';
import { Option } from 'src/shared/select/Select';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';
import JSONValue from 'src/shared/types/JSON';

export type Attribute = {
  type: string;
  label: string;
  id: string;
  disabled?: boolean;
};

export type AttributeWithContent = {
  type: string;
  label: string;
  id: string;
  selectedData: JSONValue;
  content: (AttributeWithContent | AttributeWithOptions | Attribute)[];
};

export type AttributeWithOptions = {
  type: string;
  label: string;
  id: string;
  options: RadioOptions | Option[] | CheckboxGridOption[];
  selectedOptions?: string[];
  selectedOption?: string;
  isChecked?: boolean;
  disabled?: boolean;
};

type Attributes = {
  [key: string]: AttributeWithContent | AttributeWithOptions | Attribute;
};

export default Attributes;
