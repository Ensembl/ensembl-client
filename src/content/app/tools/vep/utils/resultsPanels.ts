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

import type { FormPanel } from 'src/content/app/tools/vep/types/vepFormConfig';

// QUESTION: is this logic about "pinned panels" vs "live panels" still necessary?

/**
 * Which option panels the results view should lay itself out from.
 *
 * The tools API pins a job's panels at submission and returns them on the
 * results response (`metadata.display_panels`), so results render against the
 * options the job actually ran with rather than whatever the form config says
 * now. Jobs submitted before pinning existed have no pinned panels, and must
 * keep rendering exactly as they did — against the live form_config panels.
 *
 * The input form is unaffected: it always fetches the current config, so newly
 * added options still appear there.
 */
export const resolveResultsPanels = (args: {
  pinnedPanels: FormPanel[] | null | undefined;
  livePanels: FormPanel[] | undefined;
}): FormPanel[] | undefined => {
  const { pinnedPanels, livePanels } = args;
  return pinnedPanels ?? livePanels;
};
