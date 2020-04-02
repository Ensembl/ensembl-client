import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import PointerBox from './PointerBox';

describe('<PointerBox />', () => {
  let anchor: HTMLDivElement;

  beforeEach(() => {
    anchor = document.createElement('div');
    document.body.appendChild(anchor);
  });

  afterEach(() => {
    document.querySelector('.pointerBox')?.remove();
  });

  it('renders at the top level of document.body by default', () => {
    mount(<PointerBox anchor={anchor}>{faker.lorem.paragraph()}</PointerBox>);

    expect(document.querySelectorAll('body > .pointerBox').length).toBe(1);
  });

  it('can render inside anchor element', () => {
    mount(
      <PointerBox anchor={anchor} renderInsideAnchor={true}>
        {faker.lorem.paragraph()}
      </PointerBox>
    );

    expect(document.querySelectorAll('body > .pointerBox').length).toBe(0);
    expect(anchor.querySelector('.pointerBox')).toBeTruthy();
  });
});
