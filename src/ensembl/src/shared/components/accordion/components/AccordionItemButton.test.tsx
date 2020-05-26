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
import AccordionItemButton from './AccordionItemButton';
import AccordionItemHeading from './AccordionItemHeading';

describe('AccordionItemButton', () => {
  it('renders without erroring', () => {
    expect(() => {
      mount(<AccordionItemButton />);
    }).not.toThrow();
  });

  describe('className prop', () => {
    it('is accordionButton by default', () => {
      const wrapper = mount(
        <Accordion>
          <AccordionItem uuid={'FOO'}>
            <AccordionItemHeading>
              <AccordionItemButton>Test</AccordionItemButton>
            </AccordionItemHeading>
          </AccordionItem>
        </Accordion>
      );

      expect(
        wrapper
          .find(AccordionItemButton)
          .find('div')
          .hasClass('accordionButtonDefault')
      ).toBe(true);
    });

    it('can be extended', () => {
      const wrapper = mount(
        <Accordion>
          <AccordionItem uuid={'FOO'}>
            <AccordionItemHeading>
              <AccordionItemButton className="foo" />
            </AccordionItemHeading>
          </AccordionItem>
        </Accordion>
      );

      expect(
        wrapper
          .find(AccordionItemButton)
          .find('div')
          .hasClass('accordionButtonDefault')
      ).toBe(true);

      expect(
        wrapper.find(AccordionItemButton).find('div').hasClass('foo')
      ).toBe(true);
    });
  });

  describe('children prop', () => {
    it('is respected', () => {
      const wrapper = mount(
        <Accordion>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>Hello World</AccordionItemButton>
            </AccordionItemHeading>
          </AccordionItem>
        </Accordion>
      );

      expect(wrapper.find(AccordionItemButton).text()).toBe('Hello World');
    });
  });

  describe('disabled prop', () => {
    it('applies the accordionButtonDisabled className', () => {
      const wrapper = mount(
        <Accordion>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton disabled={true}>
                Hello World
              </AccordionItemButton>
            </AccordionItemHeading>
          </AccordionItem>
        </Accordion>
      );

      expect(wrapper.find('.accordionButtonDisabled')).toHaveLength(1);
    });
  });
});
