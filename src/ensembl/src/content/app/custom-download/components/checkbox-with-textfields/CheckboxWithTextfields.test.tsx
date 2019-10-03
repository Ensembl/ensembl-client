import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import { act } from 'react-dom/test-utils';

import CheckboxWithTextfields from './CheckboxWithTextfields';
import PasteOrUpload from 'src/shared/components/paste-or-upload/PasteOrUpload';
import Checkbox from 'src/shared/components/checkbox/Checkbox';

const onChange = jest.fn();
let wrapper: any;
const defaultProps = {
  values: [],
  label: '',
  onChange,
  allowMultiple: true
};

describe('<CheckboxWithTextfields />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without error', () => {
    wrapper = () => {
      mount(<CheckboxWithTextfields {...defaultProps} />);
    };
    expect(wrapper).not.toThrow();
  });

  it('displays one PasteOrUpload component by default', () => {
    wrapper = mount(<CheckboxWithTextfields {...defaultProps} />);
    expect(wrapper.find(PasteOrUpload)).toHaveLength(1);
  });

  it('does not display the add button by default', () => {
    wrapper = mount(<CheckboxWithTextfields {...defaultProps} />);
    expect(wrapper.find('.addIconHolder')).toHaveLength(0);
  });

  it('passes the label to the checkbox component', () => {
    const label = faker.random.words();
    wrapper = mount(<CheckboxWithTextfields {...defaultProps} label={label} />);
    expect(wrapper.find(Checkbox).prop('label')).toBe(label);
  });

  it('automatically checks the checkbox when a value is passed', () => {
    wrapper = mount(
      <CheckboxWithTextfields {...defaultProps} values={['foo']} />
    );
    expect(wrapper.find(Checkbox).prop('checked')).toBe(true);
  });

  it('displays N number of PasteOrUpload components based on the values', () => {
    const values = Array(faker.random.number(10)).fill(faker.random.words());
    wrapper = mount(
      <CheckboxWithTextfields {...defaultProps} values={values} />
    );
    expect(wrapper.find(PasteOrUpload)).toHaveLength(values.length);
  });

  it('does not show the Add button when allowMultiple is set to false', () => {
    wrapper = mount(
      <CheckboxWithTextfields
        {...defaultProps}
        allowMultiple={false}
        values={['foo']}
      />
    );
    expect(wrapper.find('.addIconHolder')).toHaveLength(0);
  });

  it('calls the onChange function with the new set of values when the input is changed', async () => {
    wrapper = mount(
      <CheckboxWithTextfields {...defaultProps} values={['foo']} />
    );

    const newValue = faker.random.words();

    await act(async () => {
      wrapper
        .find(PasteOrUpload)
        .last()
        .prop('onChange')(newValue);
    });

    expect(onChange).toBeCalledWith([newValue]);
  });

  it('updates the values when an input is removed', async () => {
    wrapper = mount(
      <CheckboxWithTextfields {...defaultProps} values={['foo', 'bar']} />
    );

    await act(async () => {
      wrapper
        .find(PasteOrUpload)
        .last()
        .prop('onRemove')();
    });
    wrapper.update();

    expect(onChange).toBeCalledWith(['foo']);
  });

  it('displays the add button when the last Input field has some content', () => {
    wrapper = mount(
      <CheckboxWithTextfields {...defaultProps} values={['foo']} />
    );

    expect(wrapper.find('.addIconHolder')).toHaveLength(1);
  });
});
