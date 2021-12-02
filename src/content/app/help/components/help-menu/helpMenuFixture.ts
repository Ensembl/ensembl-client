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

import { Menu as MenuType } from 'src/shared/types/help-and-docs/menu';

const menu: MenuType = {
  name: 'help',
  items: [
    {
      name: 'Getting Started',
      type: 'article',
      url: '/help'
    },
    {
      name: 'Using Ensembl',
      type: 'collection',
      items: [
        {
          name: 'Viewing Ensembl data',
          type: 'collection',
          items: [
            {
              name: 'Genome browser',
              type: 'collection',
              items: [
                {
                  name: 'What is the Genome browser?',
                  type: 'article',
                  url: '/help/articles/what-is-the-genome-browser'
                },
                {
                  name: 'Track configuration',
                  type: 'article',
                  url: '/help/articles/track-configuration'
                },
                {
                  name: 'Genome browser navigation',
                  type: 'article',
                  url: '/help/articles/genome-browser-navigation'
                },
                {
                  name: 'What is a Focus entity?',
                  type: 'article',
                  url: '/help/articles/what-is-a-focus-entity'
                }
              ]
            },
            {
              name: 'Entity viewer',
              type: 'collection',
              items: [
                {
                  name: 'What is the Entity viewer?',
                  type: 'article',
                  url: '/help/articles/what-is-the-entity-viewer'
                },
                {
                  name: 'What’s in the Transcripts view?',
                  type: 'article',
                  url: '/help/articles/what-s-in-the-transcripts-view'
                },
                {
                  name: 'What’s in the Gene function?',
                  type: 'article',
                  url: '/help/articles/what-s-in-the-gene-function'
                },
                {
                  name: 'What’s in the Overview panel?',
                  type: 'article',
                  url: '/help/articles/what-s-in-the-overview-panel'
                },
                {
                  name: 'What’s in the External references panel?',
                  type: 'article',
                  url: '/help/articles/what-s-in-the-external-references-panel'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default menu;
