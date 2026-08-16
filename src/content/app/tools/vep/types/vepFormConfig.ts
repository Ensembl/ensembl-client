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

/** A child notation that mirrors its parent's state and is not independently
 *  toggleable (e.g. HGVS implying HGVSc/HGVSp). */
export type FormPanelLockedChild = {
  id: string;
  label: string;
};

/** A resource link shown inside an option's help tooltip. */
export type OptionHelpLink = {
  href: string;
  /** Visible link text; a generic label is used when omitted. */
  label?: string;
  /**
   * Show this link only when the option's label carries this major version.
   * `'4'` matches v4.1 and v4.1.1, so a point release does not silently drop
   * the link. A link without it always shows.
   *
   * For sources documented differently per version: gnomAD SV is v4.1 on
   * GRCh38 and v2.1 on GRCh37, and the v4 release announcement does not
   * describe the v2 callset. Without this, one assembly's help would cite the
   * wrong paper.
   */
  majorVersion?: string;
};

/**
 * Structured help text for a form option, shown in a tooltip via a
 * question-mark icon. Deliberately kept API-serialisable (plain strings + link
 * descriptors, no JSX) so the form_config endpoint can supply it per species in
 * future — in the same way it already drives which panels/options to show. A
 * local fallback map provides it until then (see optionHelp.ts).
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
  locked_children?: FormPanelLockedChild[];
  sub_options?: FormPanelSubOption[];
  /** Help text for the option. Optional so the API can start supplying it
   *  without a type change; until then getOptionHelp falls back to a local
   *  map keyed by option id. */
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
