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
    it('is "accordionPanel" by default', () => {
      const wrapper = mount(
        <Accordion>
          <AccordionItem uuid={UUIDS.FOO}>
            <AccordionItemPanel />
          </AccordionItem>
        </Accordion>
      );

      expect(wrapper.find(AccordionItemPanel).prop('className')).toEqual(
        'accordionPanel'
      );
    });

    it('can be overridden', () => {
      const wrapper = mount(
        <Accordion>
          <AccordionItem uuid={UUIDS.FOO}>
            <AccordionItemPanel className="foo" />
          </AccordionItem>
        </Accordion>
      );

      expect(wrapper.find(AccordionItemPanel).prop('className')).toEqual('foo');
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
