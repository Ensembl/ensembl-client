import { RadioOptions } from 'src/shared/radio/Radio';
import { Option } from 'src/shared/select/Select';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';
import JSONValue from 'src/shared/types/JSON';

export enum AttributeType {
  SECTION_GROUP = 'section_group',
  SECTION = 'section',
  // FIXME: checkbox_grid & select_multiple is just a temporary solution. We need to come up with a common name for these.
  CHECKBOX_GRID = 'checkbox_grid',
  SELECT_MULTIPLE = 'select_multiple',
  SELECT_ONE = 'select_one',
  PASTE_OR_UPLOAD = 'paste_or_upload'
}

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

export type Attributes = {
  [key: string]: AttributeWithContent | AttributeWithOptions | Attribute;
};
