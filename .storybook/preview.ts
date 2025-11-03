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

import 'src/styles/globalStyles.ts';

export const parameters = {
  options: {
    storySort: {
      order: [
        'Design Primitives',
        'Components',
        [
          'Genome Browser',
          'Entity Viewer',
          'Species',
          'Blast',
          'Shared Components'
        ],
        'Hooks',
        'Other'
      ]
    }
  },
  docs: {
    // recipe for migrating from addons/notes
    extractComponentDescription: (_: any, { notes }: any) => {
      if (notes) {
        return typeof notes === 'string' ? notes : notes.markdown || notes.text;
      }
      return null;
    }
  }
};
