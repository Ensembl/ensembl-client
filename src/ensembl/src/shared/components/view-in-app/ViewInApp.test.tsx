import React from 'react';
import faker from 'faker';
import { mount } from 'enzyme';

import { ViewInApp, AppButton, ViewInAppProps } from './ViewInApp';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as EntityViewerIcon } from 'static/img/launchbar/entity-viewer.svg';

const push = jest.fn();

const renderComponent = (props: Partial<ViewInAppProps>) => {
  const defaultProps = { links: {}, push };
  const completeProps = {
    ...defaultProps,
    ...props
  };

  const renderedComponent = <ViewInApp {...completeProps} />;

  return mount(renderedComponent);
};

const linkUrl = {
  genomeBrowser: faker.internet.url(),
  entityViewer: faker.internet.url()
};

const linkIcon = {
  genomeBrowser: BrowserIcon,
  entityViewer: EntityViewerIcon
};

describe('<ViewInApp />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('checks if correct url is passed when image button is clicked', () => {
    const wrapper = renderComponent({ links: linkUrl });
    expect(wrapper.find(ImageButton)).toHaveLength(2);

    wrapper.find(AppButton).forEach((button) => {
      const k = button.key() as keyof typeof linkUrl;
      button.find(ImageButton).simulate('click');
      expect(push).toHaveBeenCalledWith(linkUrl[k]);
    });
  });

  it('renders app buttons when configurations are passed as props', () => {
    const wrapper = renderComponent({ links: linkUrl });
    wrapper.find(AppButton).forEach((button) => {
      const k = button.key() as keyof typeof linkUrl;
      expect(button.find(ImageButton).prop('image')).toBe(linkIcon[k]);
    });
  });
});
