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

import type { VepFormConfig } from 'src/content/app/tools/vep/types/vepFormConfig';

const mockVepFormConfig = {
  parameters: {
    transcript_set: {
      label: 'Transcript set',
      description: null,
      type: 'select',
      options: [
        {
          label: 'GENCODE',
          value: 'gencode_comprehensive'
        }
      ],
      default_value: 'gencode_comprehensive'
    },
    symbol: {
      label: 'Gene symbol',
      description: null,
      type: 'boolean',
      default_value: true
    },
    biotype: {
      label: 'Transcript biotype',
      description: null,
      type: 'boolean',
      default_value: true
    }
  }
} satisfies VepFormConfig;

export default mockVepFormConfig;
