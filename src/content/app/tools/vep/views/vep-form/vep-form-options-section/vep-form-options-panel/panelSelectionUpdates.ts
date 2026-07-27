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

import type {
  FormPanel,
  FormPanelOption
} from 'src/content/app/tools/vep/types/vepFormConfig';

// The parameter(s) an option toggles — each option id is its own boolean.
//
// HGVS used to drive `hgvsg` alongside `hgvs`, but HGVSg is currently hidden
// (no form control, no results row) pending chromosome synonyms, so "Select
// all" must not switch it on: it is computed only where something needs it,
// via ProtVar's `forces_on`. Add it back here when the control returns.
const optionParams = (option: FormPanelOption): string[] => [option.id];

/**
 * The parameter updates that set every top-level option in a panel to
 * `selected` — the "Select all" / "Unselect all" toggle.
 *
 * Only the options' own parameters are written; sub-options are left absent, so
 * a switched-on parent runs with its children at their defaults — exactly as a
 * manual tick does — and switching off just clears the parents (their inert
 * children are left as a manual untick leaves them).
 */
export const panelSelectionUpdates = (
  panel: FormPanel,
  selected: boolean
): Record<string, boolean> => {
  const updates: Record<string, boolean> = {};
  for (const option of panel.options) {
    for (const param of optionParams(option)) {
      updates[param] = selected;
    }
  }
  return updates;
};

/** Whether every top-level option in the panel is currently switched on. */
export const isPanelFullySelected = (
  panel: FormPanel,
  parameters: Record<string, unknown>
): boolean =>
  panel.options.length > 0 &&
  panel.options.every((option) =>
    optionParams(option).every((param) => !!parameters[param])
  );

/**
 * The same, across every panel — the section-level "Enable all default options".
 *
 * Worth being precise about "default": no top-level option is on by default, so
 * there is nothing to restore. What defaults *do* exist are the sub-options
 * (ClinVar's short variants, the suggested allele-frequency populations), and
 * leaving those absent is exactly what gives each switched-on option its default
 * configuration.
 */
export const allPanelsSelectionUpdates = (
  panels: FormPanel[],
  selected: boolean
): Record<string, boolean> =>
  Object.assign(
    {},
    ...panels.map((panel) => panelSelectionUpdates(panel, selected))
  );

/** Whether every option across every panel is currently switched on. */
export const areAllPanelsFullySelected = (
  panels: FormPanel[],
  parameters: Record<string, unknown>
): boolean =>
  panels.length > 0 &&
  panels.every((panel) => isPanelFullySelected(panel, parameters));

/** The boolean sub-options directly under an option, with their defaults. */
const booleanSubOptions = (option: FormPanelOption) =>
  (option.sub_options ?? []).flatMap((subOption) =>
    subOption.type === 'boolean'
      ? [{ id: subOption.id, default: subOption.default }]
      : []
  );

/**
 * The parameter updates for toggling one boolean sub-option, honouring an
 * option that cannot run with none of them selected (`requires_any_sub_option`).
 *
 * mutfunc is the case: a config line naming no sub-flag already means *all* of
 * them, so "none selected" cannot be expressed. Unticking the last one switches
 * the option itself off, rather than leaving a selection that would silently
 * submit the opposite of what it shows.
 */
export const subOptionToggleUpdates = (
  option: FormPanelOption,
  subOptionId: string,
  isChecked: boolean,
  parameters: Record<string, unknown>
): Record<string, boolean> => {
  const updates: Record<string, boolean> = { [subOptionId]: isChecked };
  if (!option.requires_any_sub_option || isChecked) {
    return updates;
  }
  // A sub-option the user has never touched is absent from the parameters and
  // takes its declared default — the same rule the checkbox renders by.
  const anyOtherOn = booleanSubOptions(option)
    .filter((subOption) => subOption.id !== subOptionId)
    .some((subOption) =>
      subOption.id in parameters
        ? !!parameters[subOption.id]
        : subOption.default
    );
  if (!anyOtherOn) {
    updates[option.id] = false;
  }
  return updates;
};

/**
 * The updates for switching an option on or off. For an option that needs at
 * least one sub-option, switching it *on* restores them all — otherwise
 * re-enabling one whose sub-options were all unticked would land straight back
 * in the state that cannot be submitted.
 */
export const optionToggleUpdates = (
  option: FormPanelOption,
  isChecked: boolean
): Record<string, boolean> => {
  const updates: Record<string, boolean> = { [option.id]: isChecked };
  if (option.requires_any_sub_option && isChecked) {
    for (const subOption of booleanSubOptions(option)) {
      updates[subOption.id] = true;
    }
  }
  return updates;
};
