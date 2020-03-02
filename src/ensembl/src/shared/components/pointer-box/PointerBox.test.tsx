import React, { useRef } from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import PointerBox from './PointerBox';

describe('<PointerBox />', () => {

  let anchor: HTMLDivElement;
  // let anchorRef: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    anchor = document.createElement("div");
    document.body.appendChild(anchor);

    // const Anchor = () => {
    //   anchorRef = useRef<HTMLDivElement>(null);

    //   return <div ref={anchorRef}>I am anchor</div>
    // };
    // renderedAnchor = mount(<Anchor />);
  });

  afterEach(() => {
    const pointerBox = document.querySelector('.pointerBox');
    if (pointerBox) {
      const parent = pointerBox.parentElement;
      parent?.removeChild(pointerBox);
    }
  })

  it('renders at the top level of document.body by default', () => {
    mount(
      <PointerBox anchor={anchor}>
        { faker.lorem.paragraph() }
      </PointerBox>
    );

    expect(document.querySelectorAll('body > .pointerBox').length).toBe(1);
  });
  
  it('can render inside anchor element', () => {
    mount(
      <PointerBox
        anchor={anchor}
        renderInsideAnchor={true}
      >
        { faker.lorem.paragraph() }
      </PointerBox>
    );

    expect(document.querySelectorAll('body > .pointerBox').length).toBe(0);
    expect(anchor.querySelector('.pointerBox')).toBeTruthy();
  });

  it('clears after itself?', () => {
    console.log(document.querySelectorAll('.pointerBox').length);
  });
});


/*

import React, { useRef } from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { mount } from 'enzyme';

import PointerBox from './PointerBox';

describe('<PointerBox />', () => {

  let anchor, container;

  beforeEach(() => {
    container = document.createElement("div");
    anchor = document.createElement("div");
    document.body.appendChild(container);
    document.body.appendChild(anchor);
  });

  it('renders at the top level of document.body by default', () => {
    act(() => {
      render(<PointerBox anchor={anchor} />, container);
    });
    console.log(document.body);
  });
  
});

*/
