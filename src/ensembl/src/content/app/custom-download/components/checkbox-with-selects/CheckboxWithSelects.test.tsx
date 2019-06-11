import React from 'react';
import { mount } from 'enzyme';
import CheckboxWithSelects from './CheckboxWithSelects';
import Checkbox from 'src/shared/checkbox/Checkbox';
import Select from 'src/shared/select/Select';
import ImageButton from 'src/shared/image-button/ImageButton';

const onChange = jest.fn();

const options = [
  {
    value: 'one',
    label: 'one',
    isSelected: false
  },
  {
    value: 'two',
    label: 'two',
    isSelected: false
  },
  {
    value: 'three',
    label: 'three',
    isSelected: false
  },
  {
    value: 'four',
    label: 'four',
    isSelected: false
  },
  {
    value: 'five',
    label: 'five',
    isSelected: false
  }
];
describe('<CheckboxWithSelects />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let wrapper: any;
  const defaultProps = {
    onChange: onChange,
    label: 'foo',
    selectedOptions: [],
    options: options
  };

  it('renders without error', () => {
    wrapper = mount(<CheckboxWithSelects {...defaultProps} />);
    expect(wrapper.find(CheckboxWithSelects).length).toEqual(1);
  });

  it('does not check the checkbox when there are no options selected', () => {
    wrapper = mount(<CheckboxWithSelects {...defaultProps} />);

    expect(wrapper.find(Checkbox).prop('checked')).toBe(false);
  });

  it('does not display any Select when the checkbox is unchecked', () => {
    wrapper = mount(<CheckboxWithSelects {...defaultProps} />);

    expect(wrapper.find(Checkbox).prop('checked')).toBe(false);
    expect(wrapper.find(Select).length).toBe(0);
  });

  it('displays one Select when the checkbox is checked', () => {
    wrapper = mount(<CheckboxWithSelects {...defaultProps} />);

    wrapper
      .find(Checkbox)
      .find('.defaultCheckbox')
      .simulate('click');
    expect(wrapper.find(Select).length).toBe(1);
  });

  it('automatically checks the checkbox if at least one option is selected', () => {
    wrapper = mount(
      <CheckboxWithSelects {...defaultProps} selectedOptions={['one']} />
    );

    expect(wrapper.find(Checkbox).prop('checked')).toBe(true);
  });

  it('does not display the remove button next to the Select if no option is selected ', () => {
    wrapper = mount(<CheckboxWithSelects {...defaultProps} />);

    wrapper
      .find(Checkbox)
      .find('.defaultCheckbox')
      .simulate('click');
    expect(wrapper.find(Select).length).toBe(1);
    expect(wrapper.find('.removeIconHolder').length).toBe(0);
  });

  it('displays the remove button next to the Select if an option is selected', () => {
    wrapper = mount(
      <CheckboxWithSelects {...defaultProps} selectedOptions={['one']} />
    );

    expect(wrapper.find('.removeIconHolder').length).toBe(1);
  });

  it('displays the Plus button when one option is selected', () => {
    wrapper = mount(
      <CheckboxWithSelects {...defaultProps} selectedOptions={['one']} />
    );

    expect(wrapper.find('.addIconHolder').length).toBe(1);
  });

  it('displays another select when the plus button is clicked', () => {
    wrapper = mount(
      <CheckboxWithSelects {...defaultProps} selectedOptions={['one']} />
    );

    wrapper
      .find('.addIconHolder')
      .find(ImageButton)
      .simulate('click');
    expect(
      wrapper
        .find(Select)
        .last()
        .prop('options')
    ).toHaveLength(4);
  });

  it('hides the options that are already selected within the new Select', () => {
    wrapper = mount(
      <CheckboxWithSelects {...defaultProps} selectedOptions={['one']} />
    );

    wrapper
      .find('.addIconHolder')
      .find(ImageButton)
      .simulate('click');
    expect(wrapper.find(Select).length).toBe(2);
  });

  it('does not display the Plus button when all the options are selected', () => {
    wrapper = mount(
      <CheckboxWithSelects
        {...defaultProps}
        selectedOptions={['one', 'two', 'three', 'four', 'five']}
      />
    );

    expect(wrapper.find('.addIconHolder').length).toBe(0);
  });

  it('calls the onChange function when an option is selected', () => {
    wrapper = mount(
      <CheckboxWithSelects {...defaultProps} selectedOptions={['one']} />
    );

    wrapper
      .find('.addIconHolder')
      .find(ImageButton)
      .simulate('click');

    wrapper
      .find(Select)
      .last()
      .find('.selectControl')
      .simulate('click');
    wrapper.update();
    wrapper
      .find('.optionsPanel')
      .last()
      .find('li')
      .first()
      .simulate('click');

    expect(onChange).toHaveBeenCalledWith(['one', 'two']);
  });

  it('calls the onChange function when an option is removed', () => {
    wrapper = mount(
      <CheckboxWithSelects {...defaultProps} selectedOptions={['one', 'two']} />
    );
    wrapper
      .find('.removeIconHolder')
      .last()
      .find(ImageButton)
      .simulate('click');

    expect(onChange).toHaveBeenCalledWith(['one']);
  });
});
