import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import Panel, { PanelProps } from './Panel';

const panelContent = <p>{faker.lorem.words()}</p>;

const panelHeader = <p>{faker.lorem.words()}</p>;

const onClose = jest.fn();

const panelClassNames = {
  panel: faker.lorem.word(),
  header: faker.lorem.word(),
  body: faker.lorem.word(),
  closeButton: faker.lorem.word()
};

const defaultProps: PanelProps = {
  header: panelHeader,
  children: panelContent,
  classNames: panelClassNames
};

const renderPanel = (props?: Partial<PanelProps>) => {
  return <Panel {...defaultProps} {...props} />;
};

describe('<Tabs />', () => {
  let wrapper: any;

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays the HTML header', () => {
    wrapper = mount(renderPanel());

    expect(
      wrapper
        .find('.header')
        .children()
        .contains(defaultProps.header)
    ).toBeTruthy();
  });

  it('displays the string header', () => {
    const stringHeader = faker.lorem.words();

    wrapper = mount(renderPanel({ header: stringHeader }));
    expect(wrapper.find('.header').text()).toBe(stringHeader);
  });

  it('displays the body content', () => {
    wrapper = mount(renderPanel());
    expect(wrapper.find('.body').contains(defaultProps.children)).toBeTruthy();
  });

  it('displays the close button only if onClose is set', () => {
    wrapper = mount(renderPanel({ onClose }));
    expect(wrapper.find('.closeButton')).toHaveLength(1);
  });

  it('does not display the close button if onClose is not set', () => {
    wrapper = mount(renderPanel());
    expect(wrapper.find('.closeButton')).toHaveLength(0);
  });

  it('calls the onClose function when the close button is clicked', () => {
    wrapper = mount(renderPanel({ onClose }));
    wrapper.find('.closeButton').simulate('click');

    expect(onClose).toHaveBeenCalled();
  });

  it('applies the passed in classes', () => {
    wrapper = mount(renderPanel());

    expect(
      wrapper
        .find('.panel')
        .first()
        .hasClass(panelClassNames.panel)
    ).toBeTruthy();
    expect(
      wrapper
        .find('.body')
        .first()
        .hasClass(panelClassNames.body)
    ).toBeTruthy();
    expect(
      wrapper
        .find('.header')
        .first()
        .hasClass(panelClassNames.header)
    ).toBeTruthy();
  });

  it('applies the passed in closeButton className', () => {
    wrapper = mount(renderPanel({ onClose }));
    expect(wrapper.find('.closeButton').prop('className')).toContain(
      panelClassNames.closeButton
    );
  });
});
