import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import { HeaderButtons } from './HeaderButtons';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { Status } from 'src/shared/types/status';

describe('<HeaderButtons />', () => {
  let toggleLaunchbarFn: () => void;
  let toggleAccountFn: () => void;
  let shallowWrapper: ShallowWrapper;

  beforeEach(() => {
    toggleLaunchbarFn = jest.fn();
    toggleAccountFn = jest.fn();
    shallowWrapper = shallow(
      <HeaderButtons
        toggleAccount={toggleAccountFn}
        toggleLaunchbar={toggleLaunchbarFn}
      />
    );
  });

  test('contains button for toggling launchbar', () => {
    const launchbarButton = shallowWrapper
      .find(ImageButton)
      .filterWhere(
        (wrapper) => wrapper.prop('description') === 'Ensembl app launchbar'
      );
    expect(launchbarButton.prop('onClick')).toBe(toggleLaunchbarFn);
  });

  test('contains disabled user account button', () => {
    const launchbarButton = shallowWrapper
      .find(ImageButton)
      .filterWhere(
        (wrapper) => wrapper.prop('description') === 'Ensembl account'
      );
    expect(launchbarButton.prop('status')).toBe(Status.DISABLED);
  });
});
