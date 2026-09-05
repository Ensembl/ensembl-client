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

type CommonParameterFields = {
  label: string;
  description: string | null;
};

type SelectParameterOption = {
  label: string;
  value: string;
};

type SelectParameter = CommonParameterFields & {
  type: 'select';
  options: SelectParameterOption[];
  default_value: string;
};

// --- Form panels (species-dependent) ---------------------------------------
// The tools API's form_config endpoint returns a `panels` structure describing
// which option panels/options to show for the selected species/assembly.

/** A sub-option revealed when its parent option is checked. */
export type FormPanelSubOption =
  | {
      id: string;
      label?: string;
      type: 'boolean';
      default: boolean;
    }
  | {
      id: string;
      label?: string;
      type: 'select';
      default: string;
      options: SelectParameterOption[];
    }
  | {
      id: string;
      label?: string;
      type: 'number';
      default: number;
      min?: number;
      max?: number;
    }
  // A labelled group of nested options has no id of its own
  | {
      type: 'group';
      label?: string;
      options: FormPanelOption[];
    };

export type OptionHelpLink = {
  href: string;
  label?: string;
};

export type OptionHelp = {
  /** Description text may include asterisks to mark up fragments of text
   * that have to be emphasised (i.e. *text* -> <em>text</em>)
   */
  description: string;
  links?: OptionHelpLink[];
};

export type FormPanelOption = {
  id: string;
  label: string;
  type: 'boolean';
  default: boolean;
  category?: string; // Optional label used to group options within a panel.
  sub_options?: FormPanelSubOption[];
  help?: OptionHelp;
  /**
   * The option cannot run with none of its sub-options selected.
   * E.g. mutfunc
   */
  requires_any_sub_option?: boolean;
};

export type FormPanel = {
  id: string;
  label: string;
  options: FormPanelOption[];
};

export type VepFormConfig = {
  parameters: {
    transcript_set: SelectParameter;
  };
  panels: FormPanel[];
};

export type VepFormParameterName = keyof VepFormConfig['parameters'];
