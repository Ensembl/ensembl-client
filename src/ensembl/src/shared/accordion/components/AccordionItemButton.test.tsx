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
          .props()['className']
      ).toEqual('accordionButton');
    });

    it('can be overridden', () => {
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
          .props()['className']
      ).toEqual('foo');
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
});
