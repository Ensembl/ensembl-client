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

import { SlugReference } from './types';

class HelpPopupHistory {
  private references: SlugReference[] = [];
  private cursor = 0;

  constructor(reference?: SlugReference) {
    if (reference) {
      this.add(reference);
    }
  }

  add(reference: SlugReference) {
    // remove all references that may be after the cursor
    // (the newly added reference should become the last one)
    this.references = this.references.slice(0, this.cursor + 1);

    this.references.push(reference);
    this.cursor = this.references.length - 1;
  }

  hasNext() {
    return this.references.length > this.cursor + 1;
  }

  hasPrevious() {
    return this.cursor > 0;
  }

  getNext() {
    if (this.hasNext()) {
      this.cursor += 1;
      return this.references[this.cursor];
    } else {
      return null;
    }
  }

  getPrevious() {
    if (this.hasPrevious()) {
      this.cursor -= 1;
      return this.references[this.cursor];
    } else {
      return null;
    }
  }
}

export default HelpPopupHistory;
