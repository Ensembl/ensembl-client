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

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { setFocus } from './genomeBrowserCommands';

const createMockGenomeBrowser = () => ({
  jump: vi.fn(),
  wait: vi.fn(),
  switch: vi.fn()
});

describe('genomeBrowserCommands', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('setFocus', () => {
    it('supports transcript focus with bringIntoView', () => {
      const genomeBrowser = createMockGenomeBrowser();

      setFocus({
        genomeBrowser: genomeBrowser as any,
        genomeId: 'homo_sapiens_GCA_000001405_28',
        focusType: 'transcript',
        focusId: 'ENST00000380737',
        bringIntoView: true
      });

      expect(genomeBrowser.jump).toHaveBeenCalledWith(
        'focus:transcript:homo_sapiens_GCA_000001405_28:ENST00000380737'
      );
      expect(genomeBrowser.wait).toHaveBeenCalled();
      expect(genomeBrowser.switch).toHaveBeenCalledWith(
        ['track', 'focus'],
        true
      );
      expect(genomeBrowser.switch).toHaveBeenCalledWith(
        ['track', 'focus', 'label'],
        true
      );
      expect(genomeBrowser.switch).toHaveBeenCalledWith(
        ['track', 'focus', 'item', 'transcript'],
        {
          genome_id: 'homo_sapiens_GCA_000001405_28',
          item_id: 'ENST00000380737'
        }
      );
    });

    it('supports transcript focus without bringIntoView jump', () => {
      const genomeBrowser = createMockGenomeBrowser();

      setFocus({
        genomeBrowser: genomeBrowser as any,
        genomeId: 'homo_sapiens_GCA_000001405_28',
        focusType: 'transcript',
        focusId: 'ENST00000380737'
      });

      expect(genomeBrowser.jump).not.toHaveBeenCalled();
      expect(genomeBrowser.wait).not.toHaveBeenCalled();
      expect(genomeBrowser.switch).toHaveBeenCalledWith(
        ['track', 'focus', 'item', 'transcript'],
        {
          genome_id: 'homo_sapiens_GCA_000001405_28',
          item_id: 'ENST00000380737'
        }
      );
    });
  });
});
