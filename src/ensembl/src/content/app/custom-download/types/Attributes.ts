/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { RadioOptions } from 'src/shared/components/radio-group/RadioGroup';
import { Option } from 'src/shared/components/select/Select';
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
