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

import type { FormPanelOption } from 'src/content/app/tools/vep/types/vepFormConfig';

export type OptionGroup = {
  category?: string;
  options: FormPanelOption[];
};

/**
 * Cluster a panel's options by their `category`, preserving first-seen order.
 * Options without a category fall into a single unlabelled group. Shared by the
 * form's job-options panels and the results annotation detail so both render the
 * form_config panel -> category -> option hierarchy identically.
 */
export const groupByCategory = (options: FormPanelOption[]): OptionGroup[] => {
  const groups: OptionGroup[] = [];
  const byCategory = new Map<string | undefined, OptionGroup>();
  for (const option of options) {
    let group = byCategory.get(option.category);
    if (!group) {
      group = { category: option.category, options: [] };
      byCategory.set(option.category, group);
      groups.push(group);
    }
    group.options.push(option);
  }
  return groups;
};
