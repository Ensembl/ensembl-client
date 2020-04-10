import React from 'react';
import faker from 'faker';
import { mount } from 'enzyme';
import sampleSize from 'lodash/sampleSize';

import {
  ViewInApp,
  AppButton,
  AppName,
  Apps,
  ViewInAppProps
} from './ViewInApp';
import ImageButton from 'src/shared/components/image-button/ImageButton';

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

const appLinkTuples = Object.keys(Apps).map(
  (appName) => [appName as AppName, faker.internet.url()] as const
);
const randomSampleSize = Math.ceil(Math.random() * appLinkTuples.length);
const tuplesSample = sampleSize(appLinkTuples, randomSampleSize);

const links = tuplesSample.reduce((result, tuple) => {
  const [appName, link] = tuple;
  return {
    ...result,
    [appName]: link
  };
}, {}) as Record<AppName, string>;

describe('<ViewInApp />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns null if the links prop is empty', () => {
    const wrapper = renderComponent({ links: {} });
    expect(wrapper.html()).toBe(null);
  });

  it('renders correct number of buttons', () => {
    const wrapper = renderComponent({ links });
    expect(wrapper.find(ImageButton)).toHaveLength(Object.keys(links).length);
  });

  it('switches to correct url when clicked', () => {
    const wrapper = renderComponent({ links });
    tuplesSample.forEach(([appName, link]) => {
      const imageButton = wrapper
        .find(AppButton)
        .findWhere((element) => element.prop('appId') === appName)
        .find(ImageButton);

      imageButton.simulate('click');
      expect(push).toHaveBeenCalledWith(link);
    });
  });
});
