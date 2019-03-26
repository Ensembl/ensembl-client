import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import {
  Item,
  Provider,
  ProviderState
} from '../AccordionContainer/AccordionContainer';
import { default as AccordionItem } from '../AccordionItem/AccordionItem.wrapper';
import { default as AccordionItemTitle } from '../AccordionItemTitle/AccordionItemTitle.wrapper';
import { default as Accordion } from './Accordion.wrapper';

describe('Accordion', () => {
  it('uses the passed in className', () => {
    const wrapper = mount(<Accordion className="testCSSClass" />);
    expect(wrapper.find('div').props().className).toEqual('testCSSClass');
  });

  describe('Accordion with allowMultiple parameter value set to true', () => {
    const [FooTitle, BarTitle] = [
      (): JSX.Element => <AccordionItemTitle>Foo</AccordionItemTitle>,
      (): JSX.Element => <AccordionItemTitle>Bar</AccordionItemTitle>
    ];

    function mountAccordion(): ReactWrapper {
      return mount(
        <Accordion allowMultiple={true}>
          <AccordionItem>
            <FooTitle />
          </AccordionItem>
          <AccordionItem>
            <BarTitle />
          </AccordionItem>
        </Accordion>
      );
    }

    it('expands a collapsed item when its title is clicked', () => {
      const wrapper = mountAccordion();

      wrapper.find(FooTitle).simulate('click');

      const provider = wrapper.find(Provider).instance() as Provider;

      expect(
        provider.state.items.filter((item: Item) => item.expanded === true)
          .length
      ).toEqual(1);
    });

    it('expands a collapsed item when its title is clicked, and closes the others', () => {
      const wrapper = mountAccordion();

      wrapper.find(BarTitle).simulate('click');

      const instance = wrapper.find(Provider).instance() as Provider;

      expect(
        instance.state.items.filter((item: Item) => item.expanded === true)
          .length
      ).toEqual(1);
    });

    it('collapses an expanded item when its title is clicked', () => {
      const wrapper = mountAccordion();

      const fooTitle = wrapper.find(FooTitle);

      fooTitle.simulate('click'); // open
      fooTitle.simulate('click'); // close

      const instance = wrapper.find(Provider).instance() as Provider;

      expect(
        instance.state.items.filter((item: Item) => item.expanded === true)
          .length
      ).toEqual(0);
    });
  });

  describe('Accordion with allowMultiple parameter value set to false', () => {
    const [FooTitle, BarTitle] = [
      (): JSX.Element => <AccordionItemTitle>Foo</AccordionItemTitle>,
      (): JSX.Element => <AccordionItemTitle>Bar</AccordionItemTitle>
    ];

    function mountTabpanel(): ReactWrapper {
      return mount(
        <Accordion allowMultiple={false}>
          <AccordionItem>
            <FooTitle />
          </AccordionItem>
          <AccordionItem>
            <BarTitle />
          </AccordionItem>
        </Accordion>
      );
    }

    it('expands a collapsed item when its title is clicked', () => {
      const wrapper = mountTabpanel();

      wrapper.find(FooTitle).simulate('click');

      const instance = wrapper.find(Provider).instance() as Provider;

      expect(
        instance.state.items.filter((item: Item) => item.expanded === true)
          .length
      ).toEqual(1);
    });

    it("expands a collapsed item when its title is clicked, and doesn't close the others", () => {
      const wrapper = mountTabpanel();

      wrapper.find(FooTitle).simulate('click');
      wrapper.find(BarTitle).simulate('click');

      const instance = wrapper.find(Provider).instance() as Provider;

      expect(
        instance.state.items.filter((item: Item) => item.expanded === true)
          .length
      ).toEqual(2);
    });

    it('collapses an expanded item when its title is clicked', () => {
      const wrapper = mountTabpanel();

      wrapper.find(FooTitle).simulate('click'); // open
      wrapper.find(FooTitle).simulate('click'); // close

      const instance = wrapper.find(Provider).instance() as Provider;

      expect(
        instance.state.items.filter((item: Item) => item.expanded === true)
          .length
      ).toEqual(0);
    });
  });

  it('does not expand disabled items on click', () => {
    const wrapper = mount(
      <Accordion allowMultiple={false}>
        <AccordionItem disabled={true}>
          <AccordionItemTitle className="foo">Foo Title</AccordionItemTitle>
        </AccordionItem>
      </Accordion>
    );

    const instance = wrapper.find(Provider).instance() as Provider;

    wrapper
      .find('.foo')
      .first()
      .simulate('click');
    expect(
      instance.state.items.filter((item: Item) => item.expanded === true).length
    ).toEqual(0);
  });

  it('pre-expands the item that has expanded === true', () => {
    const wrapper = mount(
      <Accordion>
        <AccordionItem expanded={true}>Fake Child</AccordionItem>
        <AccordionItem>Fake Child</AccordionItem>
      </Accordion>
    );

    const instance = wrapper.find(Provider).instance() as Provider;

    expect(
      instance.state.items.filter((item: Item) => item.expanded === true).length
    ).toEqual(1);
  });

  it('ignores multiple pre-expanded items, expanding only the first', () => {
    const hideBodyClassName = 'HIDE';
    const wrapper = mount(
      <Accordion allowMultiple={false}>
        <AccordionItem expanded={true} hideBodyClassName={hideBodyClassName}>
          Fake Child
        </AccordionItem>
        <AccordionItem expanded={true} hideBodyClassName={hideBodyClassName}>
          Fake Child
        </AccordionItem>
      </Accordion>
    );

    const instance = wrapper.find(Provider).instance() as Provider;

    expect(
      instance.state.items.filter((item: Item) => item.expanded).length
    ).toEqual(1);
    expect(
      wrapper.findWhere((item: ReactWrapper) =>
        item.hasClass(hideBodyClassName)
      ).length
    ).toEqual(1);
  });

  it('expands multiple accordion items when allowMultiple is true', () => {
    const wrapper = mount(
      <Accordion allowMultiple={true}>
        <AccordionItem expanded={true}>Fake Child</AccordionItem>
        <AccordionItem expanded={true}>Fake Child</AccordionItem>
      </Accordion>
    );

    const instance = wrapper.find(Provider).instance() as Provider;

    expect(
      instance.state.items.filter((item: Item) => item.expanded === true).length
    ).toEqual(2);
  });

  it('respects arbitrary user-defined props', () => {
    const wrapper = mount(<Accordion lang="en" />);
    const div = wrapper.find('div').getDOMNode();

    expect(div.getAttribute('lang')).toEqual('en');
  });
});
