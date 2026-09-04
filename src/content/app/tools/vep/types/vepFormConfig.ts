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
// which option panels/options to show for the selected species/assembly. Each
// option `id` matches a submission parameter name, so selections round-trip
// into the generated config.ini.

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
  // A labelled group of nested options (e.g. gnomAD exomes' genetic-ancestry
  // groups, each with its own sex sub-options). Has no id of its own — it's a
  // heading + nested `FormPanelOption`s that carry the parameters.
  | {
      type: 'group';
      label?: string;
      options: FormPanelOption[];
    };

/** A resource link shown inside an option's help tooltip. */
export type OptionHelpLink = {
  href: string;
  /** Visible link text; a generic label is used when omitted. */
  label?: string;
};

/**
 * Structured help text for a form option, shown in a tooltip via a
 * question-mark icon. Plain strings + link descriptors rather than JSX, because
 * form_config supplies it: it is authored in the annotation spec's `help`
 * section, alongside the label and panel that decide where the option appears.
 */
export type OptionHelp = {
  /** Description text. A `*span*` is rendered emphasised (a small markdown
   *  subset, so the string stays serialisable). A `{version}` is replaced with
   *  the version in the option's own label, so one description can serve an
   *  option id that appears at different versions per assembly; it collapses
   *  cleanly when the label carries no version. */
  description: string;
  /** Zero or more resource links rendered after the description. */
  links?: OptionHelpLink[];
};

export type FormPanelOption = {
  id: string;
  label: string;
  type: 'boolean';
  default: boolean;
  category?: string; // Optional label used to group options within a panel.
  sub_options?: FormPanelSubOption[];
  /** Help text for the option, from the spec. Optional: an option with none —
   *  `updownstream_distance`, say — simply shows no tooltip. */
  help?: OptionHelp;
  /**
   * The option cannot run with none of its sub-options selected. mutfunc does
   * everything when told nothing, so a config line naming no sub-flag already
   * means *all* of them — "none" is not a state the plugin can be asked for.
   * Unticking the last sub-option therefore switches the option itself off, and
   * switching it back on restores them all.
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
