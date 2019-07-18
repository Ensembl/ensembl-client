import { RadioOptions } from 'src/shared/radio/Radio';
import { Option } from 'src/shared/select/Select';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

export type Filter = {
  type: string;
  label: string;
  id: string;
  isChecked?: boolean;
  disabled?: boolean;
  content?: Filter[];
  options?: RadioOptions | Option[] | CheckboxGridOption[];
  selectedOptions?: string[];
  selectedOption?: string;
};

export type Filters = {
  [key: string]: Filter;
};

export default Filter;
