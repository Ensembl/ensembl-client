import React from 'react';
import { mount } from 'enzyme';
import CheckboxWithSelects from './CheckboxWithSelects';
import Checkbox from 'src/shared/checkbox/Checkbox';
import Select from 'src/shared/select/Select';
import ImageButton from 'src/shared/image-button/ImageButton';

const onChange = jest.fn();

const selectOptions = [
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

  it('renders without error', () => {
    const wrapper = mount(
      <CheckboxWithSelects
        onChange={onChange}
        label={'FOO'}
        selectedOptions={[]}
        selectOptions={selectOptions}
      />
    );
    expect(wrapper.find(CheckboxWithSelects).length).toEqual(1);
  });

  it('does not check the checkbox when there are no options selected', () => {
    const wrapper = mount(
      <CheckboxWithSelects
        onChange={onChange}
        label={'FOO'}
        selectedOptions={[]}
        selectOptions={selectOptions}
      />
    );

    expect(wrapper.find(Checkbox).prop('checked')).toBe(false);
  });

  it('does not display any Select when the checkbox is unchecked', () => {
    const wrapper = mount(
      <CheckboxWithSelects
        onChange={onChange}
        label={'FOO'}
        selectedOptions={[]}
        selectOptions={selectOptions}
      />
    );

    expect(wrapper.find(Checkbox).prop('checked')).toBe(false);
    expect(wrapper.find(Select).length).toBe(0);
  });

  it('displays one Select when the checkbox is checked', () => {
    const wrapper = mount(
      <CheckboxWithSelects
        onChange={onChange}
        label={'FOO'}
        selectedOptions={[]}
        selectOptions={selectOptions}
      />
    );

    wrapper
      .find(Checkbox)
      .find('.defaultCheckbox')
      .simulate('click');
    expect(wrapper.find(Select).length).toBe(1);
  });

  it('automatically checks the checkbox if atleast one option is selected', () => {
    const wrapper = mount(
      <CheckboxWithSelects
        onChange={onChange}
        label={'FOO'}
        selectedOptions={['one']}
        selectOptions={selectOptions}
      />
    );

    expect(wrapper.find(Checkbox).prop('checked')).toBe(true);
  });

  it('does not display the remove button next to the Select if no option is selected ', () => {
    const wrapper = mount(
      <CheckboxWithSelects
        onChange={onChange}
        label={'FOO'}
        selectedOptions={[]}
        selectOptions={selectOptions}
      />
    );

    wrapper
      .find(Checkbox)
      .find('.defaultCheckbox')
      .simulate('click');
    expect(wrapper.find(Select).length).toBe(1);
    expect(wrapper.find('.removeIconHolder').length).toBe(0);
  });

  it('displays the remove button next to the Select if an option is selected', () => {
    const wrapper = mount(
      <CheckboxWithSelects
        onChange={onChange}
        label={'FOO'}
        selectedOptions={['one']}
        selectOptions={selectOptions}
      />
    );

    expect(wrapper.find('.removeIconHolder').length).toBe(1);
  });

  it('displays the Plus button when one option is selected', async () => {
    const wrapper = mount(
      <CheckboxWithSelects
        onChange={onChange}
        label={'FOO'}
        selectedOptions={['one']}
        selectOptions={selectOptions}
      />
    );

    expect(wrapper.find('.addIconHolder').length).toBe(1);
  });

  it('displays another select when the plus button is clicked', () => {
    const wrapper = mount(
      <CheckboxWithSelects
        onChange={onChange}
        label={'FOO'}
        selectedOptions={['one']}
        selectOptions={selectOptions}
      />
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
    const wrapper = mount(
      <CheckboxWithSelects
        onChange={onChange}
        label={'FOO'}
        selectedOptions={['one']}
        selectOptions={selectOptions}
      />
    );

    wrapper
      .find('.addIconHolder')
      .find(ImageButton)
      .simulate('click');
    expect(wrapper.find(Select).length).toBe(2);
  });

  it('does not display the Plus button when all the options are selected', () => {});

  it('calls the onChange function when an option is selected', () => {});

  it('calls the onChange function when an option is removed', () => {});
});
