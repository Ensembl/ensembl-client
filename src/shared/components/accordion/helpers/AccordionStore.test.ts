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

import AccordionStore from './AccordionStore';

enum UUIDS {
  FOO = 'FOO',
  BAR = 'BAR'
}

describe('Accordion', () => {
  describe('constructor', () => {
    it('correctly instantiates with all expected methods', () => {
      const container = new AccordionStore({});
      expect(container).toBeDefined();
      expect(container.allowMultipleExpanded).toBeDefined();
      expect(container.allowZeroExpanded).toBeDefined();
      expect(container.toggleExpanded).toBeDefined();
      expect(container.isItemExpanded).toBeDefined();
      expect(container.isItemDisabled).toBeDefined();
    });

    it('respects the `allowMultipleExpanded` property', () => {
      const container = new AccordionStore({
        allowMultipleExpanded: true
      });

      expect(container.allowMultipleExpanded).toEqual(true);
    });

    it('respects the `allowZeroExpanded` property', () => {
      const container = new AccordionStore({
        allowZeroExpanded: true
      });

      expect(container.allowZeroExpanded).toEqual(true);
    });

    it('respects the `expanded` property', () => {
      const container = new AccordionStore({
        allowZeroExpanded: true,
        expanded: ['foo']
      });

      expect(container.expanded).toEqual(['foo']);
    });
  });

  describe('toggleExpanded', () => {
    describe('expanding', () => {
      it('expands an item', () => {
        const container = new AccordionStore({}).toggleExpanded(UUIDS.FOO);

        expect(container.expanded).toEqual([UUIDS.FOO]);
      });

      it('collapses the currently expanded items', () => {
        const container = new AccordionStore({
          expanded: [UUIDS.BAR]
        }).toggleExpanded(UUIDS.FOO);

        expect(container.expanded).toEqual([UUIDS.FOO]);
      });
    });

    describe('collapsing', () => {
      it('doesnt collapse the only expanded item', () => {
        const container = new AccordionStore({
          expanded: [UUIDS.FOO]
        }).toggleExpanded(UUIDS.FOO);

        expect(container.expanded).toEqual([UUIDS.FOO]);
      });

      it('collapses the only expanded item when allowZeroExpanded', () => {
        const container = new AccordionStore({
          allowZeroExpanded: true,
          expanded: [UUIDS.FOO]
        }).toggleExpanded(UUIDS.FOO);

        expect(container.expanded).toEqual([]);
      });
    });
  });

  describe('isDisabled', () => {
    describe('expanded item', () => {
      it('is disabled if alone', () => {
        const container = new AccordionStore({
          expanded: [UUIDS.FOO]
        });

        expect(container.isItemDisabled(UUIDS.FOO)).toEqual(true);
      });

      it('is not disabled if multiple expanded', () => {
        const container = new AccordionStore({
          allowMultipleExpanded: true,
          expanded: [UUIDS.FOO, UUIDS.BAR]
        });

        expect(container.isItemDisabled(UUIDS.FOO)).toEqual(false);
      });

      it('is not disabled if allowZeroExpanded', () => {
        const container = new AccordionStore({
          allowZeroExpanded: true,
          expanded: [UUIDS.FOO]
        });

        expect(container.isItemDisabled(UUIDS.FOO)).toEqual(false);
      });
    });

    describe('collapsed item', () => {
      it('is not disabled', () => {
        const container = new AccordionStore({});

        expect(container.isItemDisabled(UUIDS.FOO)).toEqual(false);
      });
    });
  });
});
