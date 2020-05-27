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
import { mount } from 'enzyme';
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
      mount(<AccordionItemPanel />);
    }).not.toThrow();
  });

  describe('className prop', () => {
    it('is "accordionPanelDefault" by default', () => {
      const wrapper = mount(
        <Accordion>
          <AccordionItem uuid={UUIDS.FOO}>
            <AccordionItemPanel />
          </AccordionItem>
        </Accordion>
      );

      expect(
        wrapper
          .find(AccordionItemPanel)
          .find('div')
          .hasClass('accordionPanelDefault')
      ).toBe(true);
    });

    it('can be extended', () => {
      const wrapper = mount(
        <Accordion>
          <AccordionItem uuid={UUIDS.FOO}>
            <AccordionItemPanel className="foo" />
          </AccordionItem>
        </Accordion>
      );

      expect(
        wrapper
          .find(AccordionItemPanel)
          .find('div')
          .hasClass('accordionPanelDefault')
      ).toBe(true);
      expect(wrapper.find(AccordionItemPanel).find('div').hasClass('foo')).toBe(
        true
      );
    });
  });

  describe('children prop', () => {
    it('is respected', () => {
      const wrapper = mount(
        <Accordion>
          <AccordionItem>
            <AccordionItemPanel>Hello World</AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      );
      expect(wrapper.find(AccordionItemPanel).text()).toBe('Hello World');
    });
  });
});
