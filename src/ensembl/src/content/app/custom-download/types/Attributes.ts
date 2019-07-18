import { RadioOptions } from 'src/shared/radio/Radio';
import { Option } from 'src/shared/select/Select';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

export type Attribute = {
  type: string;
  label: string;
  id: string;
  isChecked?: boolean;
  disabled?: boolean;
  content?: Attribute[];
  options?: RadioOptions | Option[] | CheckboxGridOption[];
  selectedOptions?: string[];
  selectedOption?: string;
};

export type Attributes = {
  [key: string]: Attribute;
};

export default Attribute;
