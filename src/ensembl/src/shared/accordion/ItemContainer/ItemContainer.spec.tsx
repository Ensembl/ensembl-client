import { mount } from 'enzyme';
import React from 'react';
import {
  Consumer,
  CONTEXT_KEY,
  getItemStore,
  ItemContainer,
  Provider
} from './ItemContainer';

describe('ItemContainer', () => {
  it('Propagates uuid by context', () => {
    const mock = jest.fn(() => null);
    const uuid = 'foo';

    mount(
      <Provider uuid={uuid}>
        <Consumer>{mock}</Consumer>
      </Provider>
    ).instance();

    expect(mock).toHaveBeenCalledWith(
      expect.objectContaining({
        uuid
      })
    );
  });

  it('renders Provider without children', () => {
    expect(() => mount(<Provider uuid="foo" />)).not.toThrow();
  });

  it('fetches context with getItemStore', () => {
    expect.assertions(1);

    const Test = (
      props: {},
      context: { [CONTEXT_KEY]: ItemContainer }
    ): null => {
      const accordionStore = getItemStore(context);
      expect(accordionStore).toBeDefined();

      return null;
    };
    Test.contextTypes = {
      [CONTEXT_KEY]: (): null => null
    };

    mount(
      <Provider uuid="uuid">
        <Test />
      </Provider>
    );
  });
});
