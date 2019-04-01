import React from 'react';
import { render } from 'enzyme';

import { Content, withInnerContent } from './Content';
import styles from './Content.scss';

describe('<Content />', () => {
  let contentComponent: any;

  beforeEach(() => {
    contentComponent = <Content launchbarExpanded={true}>foo</Content>;
  });

  test('renders without error', () => {
    expect(() => render(contentComponent)).not.toThrow();
  });

  describe('<main> element', () => {
    test('collapses correctly', () => {
      const wrapper = render(contentComponent);
      expect(wrapper.has(`.${styles.shorter}`)).toBeTruthy();
    });

    test('expands correctly', () => {
      const wrapper = render(<Content launchbarExpanded={false}>foo</Content>);
      expect(wrapper.has(`.${styles.taller}`)).toBeTruthy();
    });
  });

  describe('withInnerContent', () => {
    test('injects content into the Content component', () => {
      const text = 'I am inner content';
      const InnerContent = () => <div>{text}</div>;
      const WithInnerContent = withInnerContent(<InnerContent />);
      const wrapper = render(<WithInnerContent launchbarExpanded={false} />);

      expect(wrapper.text()).toBe(text);
    });
  });
});
