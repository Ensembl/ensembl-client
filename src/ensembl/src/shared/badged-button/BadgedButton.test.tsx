import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import BadgedButton from './BadgedButton';
import Button from '../button/Button';

const onClick = jest.fn();

const defaultProps = {
  badge: faker.lorem.words()
};

const renderButton = (
  ButtonComponent: React.FunctionComponent<any>,
  props: any = defaultProps
) => mount(<ButtonComponent {...props} />);

describe('BadgedButton', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderButton(BadgedButton, {
      ...defaultProps,
      children: <Button onClick={onClick}>{faker.lorem.words()}</Button>
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the passed in button', () => {
    expect(wrapper.find('button').length).toEqual(1);
  });

  it('assigns the "badgeDefault" class to the badge by default', () => {
    const renderedBadge = wrapper.find('div.badgeDefault');
    expect(renderedBadge).toHaveLength(1);
  });

  it('extends the badge class', () => {
    const fakeClassName = faker.lorem.word();

    const wrapper = renderButton(BadgedButton, {
      ...defaultProps,
      children: <Button onClick={onClick}>{faker.lorem.words()}</Button>,
      className: fakeClassName
    });
    const renderedBadge = wrapper.find('div.badgeDefault');

    expect(renderedBadge.hasClass(fakeClassName)).toBe(true);
  });
});
