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

const renderPanel = (props: PanelProps) => {
  return <Panel {...props}></Panel>;
};

describe('<Tabs />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(renderPanel({ ...defaultProps }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays the HTML header', () => {
    expect(
      wrapper
        .find('.header')
        .children()
        .contains(defaultProps.header)
    ).toBeTruthy();
  });

  it('displays the string header', () => {
    const stringHeader = faker.lorem.words();

    wrapper = mount(renderPanel({ ...defaultProps, header: stringHeader }));
    expect(wrapper.find('.header').text()).toBe(stringHeader);
  });

  it('displays the body content', () => {
    expect(wrapper.find('.body').contains(defaultProps.children)).toBeTruthy();
  });

  it('displays the close button only if onClose is set', () => {
    wrapper = mount(renderPanel({ ...defaultProps, onClose }));
    expect(wrapper.find('.closeButton')).toHaveLength(1);
  });

  it('does not display the close button if onClose is not set', () => {
    expect(wrapper.find('.closeButton')).toHaveLength(0);
  });

  it('calls the onClose function when the close button is clicked', () => {
    wrapper = mount(renderPanel({ ...defaultProps, onClose }));
    wrapper.find('.closeButton').simulate('click');

    expect(onClose).toHaveBeenCalled();
  });

  it('applies the passed in panel className', () => {
    expect(wrapper.find('.panel').prop('className')).toContain(
      panelClassNames.panel
    );
  });

  it('applies the passed in header className', () => {
    expect(wrapper.find('.header').prop('className')).toContain(
      panelClassNames.header
    );
  });

  it('applies the passed in body className', () => {
    expect(wrapper.find('.body').prop('className')).toContain(
      panelClassNames.body
    );
  });

  it('applies the passed in closeButton className', () => {
    wrapper = mount(renderPanel({ ...defaultProps, onClose }));
    expect(wrapper.find('.closeButton').prop('className')).toContain(
      panelClassNames.closeButton
    );
  });
});
