import React from 'react';

import { mount } from 'enzyme';
import Accordion from './Accordion';
import AccordionItem from './AccordionItem';
import AccordionItemHeading from './AccordionItem';
import AccordionItemButton from './AccordionItem';

enum UUIDS {
  FOO = 'FOO',
  BAR = 'Bar'
}

describe('Accordion', () => {
  it('renders without erroring', () => {
    expect(() => {
      mount(<Accordion />);
    }).not.toThrow();
  });

  describe('className', () => {
    it('is “accordion” by default', () => {
      const wrapper = mount(<Accordion data-testid={UUIDS.FOO} />);
      expect(wrapper.find('div').props().className).toEqual('accordion');
    });

    it('can be overridden', () => {
      const wrapper = mount(
        <Accordion className="foo" data-testid={UUIDS.FOO} />
      );
      expect(wrapper.find('div').props().className).toEqual('foo');
    });
  });
});
