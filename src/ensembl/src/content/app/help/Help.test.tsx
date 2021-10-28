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

import { Menu } from 'src/shared/types/help-and-docs/menu';
import { getBreadcrumbsFromMenu } from './Help';

const sampleMenu: Menu = {
  name: 'Zero',
  items: [
    {
      name: 'One',
      type: 'collection',
      items: [
        {
          name: 'Duplicate article 1',
          type: 'article',
          url: '/duplicate'
        },
        {
          name: 'Three',
          type: 'article',
          url: '/three'
        },
        {
          name: 'Four',
          type: 'article',
          url: '/four'
        }
      ]
    },
    {
      name: 'Five',
      type: 'collection',
      items: [
        {
          name: 'Six',
          type: 'article',
          url: '/six'
        },
        {
          name: 'Seven',
          type: 'article',
          url: '/seven'
        },
        {
          name: 'Two',
          type: 'article',
          url: '/eight'
        },
        {
          name: 'Duplicate article 2',
          type: 'article',
          url: '/duplicate'
        }
      ]
    }
  ]
};
describe('getBreadcrumbsFromMenu', () => {
  it('returns the correct set of breadcrumbs for the given url', () => {
    expect(getBreadcrumbsFromMenu(sampleMenu, '/four')).toEqual([
      'One',
      'Four'
    ]);
    expect(getBreadcrumbsFromMenu(sampleMenu, '/seven')).toEqual([
      'Five',
      'Seven'
    ]);
  });

  it('returns null when there is no match', () => {
    expect(getBreadcrumbsFromMenu(sampleMenu, '/blah')).toEqual(null);
  });

  it('returns first match when there are two matches', () => {
    expect(getBreadcrumbsFromMenu(sampleMenu, '/duplicate')).toEqual([
      'One',
      'Duplicate article 1'
    ]);
  });
});
