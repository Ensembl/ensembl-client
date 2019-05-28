import React from 'react';
import { shallow } from 'enzyme';

import { AppShell } from './App';
import AppBar from 'src/shared/app-bar/AppBar';

describe('<App />', () => {
  test('contains AppBar', () => {
    const renderedComponent = shallow(
      <AppShell>
        <div>Content</div>
      </AppShell>
    );
    expect(renderedComponent.find(AppBar).length).toEqual(1);
  });
});
