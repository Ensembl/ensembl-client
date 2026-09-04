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
const optionParams = (option: FormPanelOption): string[] => [option.id];

/**
 * The parameter updates that set every top-level option in a panel to
 * `selected` — the "Select all" / "Unselect all" toggle.
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

const booleanSubOptions = (
  option: FormPanelOption
): { id: string; default: boolean }[] =>
  (option.sub_options ?? []).flatMap((subOption) => {
    if (subOption.type === 'boolean') {
      return [{ id: subOption.id, default: subOption.default }];
    }
    if (subOption.type === 'group') {
      return subOption.options.map((nested) => ({
        id: nested.id,
        default: nested.default
      }));
    }
    return [];
  });

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

export const optionToggleUpdates = (
  option: FormPanelOption,
  isChecked: boolean
): Record<string, boolean> => {
  const updates: Record<string, boolean> = { [option.id]: isChecked };
  if (option.requires_any_sub_option && isChecked) {
    for (const subOption of booleanSubOptions(option)) {
      updates[subOption.id] = subOption.default;
    }
  }
  return updates;
};
