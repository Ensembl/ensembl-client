import React from 'react';

import { mount } from 'enzyme';
import Accordion from './Accordion';
import AccordionItem from './AccordionItem';
import AccordionItemHeading from './AccordionItemHeading';
import AccordionItemButton from './AccordionItemButton';

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

  describe('expanding and collapsing: ', () => {
    describe('allowMultipleExpanded prop', () => {
      it('permits multiple items to be expanded when explicitly true', () => {
        const [FooHeader, BarHeader] = [
          (): JSX.Element => <AccordionItemButton data-testid={UUIDS.FOO} />,
          (): JSX.Element => <AccordionItemButton data-testid={UUIDS.BAR} />
        ];

        const wrapper = mount(
          <Accordion allowMultipleExpanded={true}>
            <AccordionItem>
              <AccordionItemHeading>
                <FooHeader />
              </AccordionItemHeading>
            </AccordionItem>
            <AccordionItem>
              <AccordionItemHeading>
                <BarHeader />
              </AccordionItemHeading>
            </AccordionItem>
          </Accordion>
        );

        wrapper.find(FooHeader).simulate('click');
        wrapper.find(BarHeader).simulate('click');

        expect(
          wrapper
            .find(FooHeader)
            .find('div')
            .props()['aria-expanded']
        ).toBe(true);
        expect(
          wrapper
            .find(BarHeader)
            .find('div')
            .props()['aria-expanded']
        ).toBe(true);
      });
    });
  });
});
