import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { BrowserImage, BrowserImageProps } from './BrowserImage';
import { CircleLoader } from 'src/shared/components/loader/Loader';
import configureStore from 'src/store';

describe('<BrowserImage />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserImageProps = {
    trackStates: {},
    browserCogTrackList: {},
    browserNavOpened: false,
    regionEditorActive: false,
    regionFieldActive: false,
    browserActivated: false,
    activateBrowser: jest.fn(),
    updateBrowserNavStates: jest.fn(),
    updateBrowserActivated: jest.fn(),
    updateBrowserActiveEnsObject: jest.fn(),
    setChrLocation: jest.fn(),
    setActualChrLocation: jest.fn(),
    updateMessageCounter: jest.fn(),
    updateDefaultPositionFlag: jest.fn(),
    changeHighlightedTrackId: jest.fn()
  };

  const store = configureStore();

  const wrappingComponent = (props: any) => (
    <Provider store={store}>{props.children}</Provider>
  );

  const mountBrowserImageComponent = (props?: Partial<BrowserImageProps>) =>
    mount(<BrowserImage {...defaultProps} {...props} />, { wrappingComponent });

  describe('rendering', () => {
    test('renders loader if browser is not activated', () => {
      const wrapper = mountBrowserImageComponent();
      expect(wrapper.find(CircleLoader)).toHaveLength(1);
    });

    test('has an overlay on top when region field is active', () => {
      const wrapper = mountBrowserImageComponent({ regionFieldActive: true });
      expect(wrapper.find('.browserOverlay').length).toBe(1);
    });

    test('has an overlay on top when region editor is active', () => {
      const wrapper = mountBrowserImageComponent({ regionEditorActive: true });
      expect(wrapper.find('.browserOverlay').length).toBe(1);
    });
  });

  describe('behaviour', () => {
    test('activates browser on mount', () => {
      const wrapper = mountBrowserImageComponent();
      expect(wrapper.props().activateBrowser).toHaveBeenCalled();
    });
  });
});
