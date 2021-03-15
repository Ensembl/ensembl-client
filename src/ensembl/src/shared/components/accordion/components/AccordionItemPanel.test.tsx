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

import React from 'react';
import { render } from '@testing-library/react';
import Accordion from './Accordion';
import AccordionItem from './AccordionItem';
import AccordionItemPanel from './AccordionItemPanel';

enum UUIDS {
  FOO = 'FOO',
  BAR = 'BAR'
}

describe('AccordionItemPanel', () => {
  it('renders without erroring', () => {
    expect(() => {
      render(<AccordionItemPanel />);
    }).not.toThrow();
  });

  describe('className prop', () => {
    it('is "accordionPanelDefault" by default', () => {
      const { container } = render(
        <Accordion>
          <AccordionItem uuid={UUIDS.FOO}>
            <AccordionItemPanel />
          </AccordionItem>
        </Accordion>
      );

      expect(
        container.querySelector('.accordionDefault .accordionPanelDefault')
      ).toBeTruthy();
    });

    it('can be extended', () => {
      const { container } = render(
        <Accordion>
          <AccordionItem uuid={UUIDS.FOO}>
            <AccordionItemPanel className="foo" />
          </AccordionItem>
        </Accordion>
      );

      expect(
        container.querySelector('.accordionDefault .accordionPanelDefault')
      ).toBeTruthy();

      expect(
        container
          .querySelector('.accordionDefault .accordionPanelDefault')
          ?.classList.contains('foo')
      ).toBeTruthy();
    });
  });

  describe('children prop', () => {
    it('is respected', () => {
      const { container } = render(
        <Accordion>
          <AccordionItem>
            <AccordionItemPanel>Hello World</AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      );
      expect(
        container.querySelector('.accordionPanelDefault')?.textContent
      ).toBe('Hello World');
    });
  });
});
