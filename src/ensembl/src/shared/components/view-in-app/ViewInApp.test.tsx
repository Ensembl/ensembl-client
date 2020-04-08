import React from 'react';
import { Link } from 'react-router-dom';
import { mount } from 'enzyme';

import ViewInApp from './ViewInApp';
import * as urlFor from 'src/shared/helpers/urlHelper';

jest.mock('react-router-dom', () => ({
  Link: () => <div>Link</div>
}));

describe('<ViewInApp />', () => {
  it('contains Link and ImageButton', () => {
    const url = urlFor.browser();
    const wrapper = mount(<ViewInApp links={{ genomeBrowser: url }} />);
    expect(wrapper.find(Link)).toHaveLength(1);
  });
});
