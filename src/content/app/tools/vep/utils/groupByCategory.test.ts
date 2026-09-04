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

import { groupByCategory } from './groupByCategory';

import type { FormPanelOption } from 'src/content/app/tools/vep/types/vepFormConfig';

const option = (id: string, category?: string): FormPanelOption => ({
  id,
  label: id,
  type: 'boolean',
  default: false,
  category
});

describe('groupByCategory', () => {
  it('clusters options by category, preserving first-seen order', () => {
    const groups = groupByCategory([
      option('a', 'Missense'),
      option('b', 'Splicing'),
      option('c', 'Missense')
    ]);

    expect(groups.map((g) => g.category)).toEqual(['Missense', 'Splicing']);
    expect(groups[0].options.map((o) => o.id)).toEqual(['a', 'c']);
    expect(groups[1].options.map((o) => o.id)).toEqual(['b']);
  });

  it('collects category-less options into a single undefined group', () => {
    const groups = groupByCategory([option('a'), option('b')]);

    expect(groups).toHaveLength(1);
    expect(groups[0].category).toBeUndefined();
    expect(groups[0].options.map((o) => o.id)).toEqual(['a', 'b']);
  });

  it('keeps category groups in the order their category first appears', () => {
    const groups = groupByCategory([
      option('a', 'Genome wide'),
      option('b'),
      option('c', 'Non-coding'),
      option('d', 'Genome wide')
    ]);

    expect(groups.map((g) => g.category)).toEqual([
      'Genome wide',
      undefined,
      'Non-coding'
    ]);
    expect(groups[0].options.map((o) => o.id)).toEqual(['a', 'd']);
  });

  it('returns an empty array for no options', () => {
    expect(groupByCategory([])).toEqual([]);
  });
});
