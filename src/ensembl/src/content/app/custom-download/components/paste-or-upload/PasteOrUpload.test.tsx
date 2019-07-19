import React from 'react';
import { mount } from 'enzyme';
import PasteOrUpload from './PasteOrUpload';
import faker from 'faker';
import Input from 'src/shared/input/Input';
import ImageButton from 'src/shared/image-button/ImageButton';

const onChange = jest.fn();
const onRemove = jest.fn();

describe('<PasteOrUpload/>', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let wrapper: any;
  const defaultProps = {
    value: undefined,
    onChange,
    onRemove
  };

  it('renders without error', () => {
    wrapper = () => {
      mount(<PasteOrUpload {...defaultProps} />);
    };
    expect(wrapper).not.toThrow();
  });

  it('displays the text "Paste data or Upload file"', () => {
    wrapper = mount(<PasteOrUpload {...defaultProps} />);

    expect(wrapper.text()).toBe('Paste data or Upload file');
  });

  it('does not display the text "Paste data or Upload file" when a value is passed', () => {
    wrapper = mount(<PasteOrUpload {...defaultProps} value={'foo'} />);

    expect(wrapper.text()).not.toBe('Paste data or Upload file');
  });

  it('does not display the text input by default ', () => {
    wrapper = mount(<PasteOrUpload {...defaultProps} />);
    expect(wrapper.find(Input)).toHaveLength(0);
  });

  it('displays the text input by default when a value is passed', () => {
    wrapper = mount(
      <PasteOrUpload {...defaultProps} value={faker.random.words()} />
    );
    expect(wrapper.find(Input)).toHaveLength(1);
  });

  it('shows the text input on clicking the text "Paste data"', () => {
    wrapper = mount(<PasteOrUpload {...defaultProps} />);
    wrapper.find('.pasteText').simulate('click');
    expect(wrapper.find(Input)).toHaveLength(1);
  });

  it('does not display the remove icon by default', () => {
    wrapper = mount(<PasteOrUpload {...defaultProps} />);
    expect(wrapper.find('.removeIconHolder')).toHaveLength(0);
  });

  it('displays the remove icon when a value is present', () => {
    wrapper = mount(
      <PasteOrUpload {...defaultProps} value={faker.random.words()} />
    );
    expect(wrapper.find('.removeIconHolder')).toHaveLength(1);
  });

  it('displays the given placeholder', () => {
    const placeholder = faker.random.words();
    wrapper = mount(
      <PasteOrUpload
        {...defaultProps}
        value={faker.random.words()}
        placeholder={placeholder}
      />
    );
    expect(wrapper.find(Input).prop('placeholder')).toBe(placeholder);
  });

  it('displays the "Paste data or Upload file" when the input is removed', () => {
    wrapper = mount(
      <PasteOrUpload {...defaultProps} value={faker.random.words()} />
    );
    expect(wrapper.find('.removeIconHolder')).toHaveLength(1);
    wrapper.setProps({ value: undefined });
    wrapper.update();
    expect(wrapper.text()).toBe('Paste data or Upload file');
    expect(wrapper.find('.removeIconHolder')).toHaveLength(0);
  });

  it('calls the onChange function with the current value when the input is changed', () => {
    const newValue = faker.random.words();

    wrapper = mount(
      <PasteOrUpload {...defaultProps} value={faker.random.words()} />
    );
    wrapper.find(Input).prop('onChange')(newValue);
    expect(onChange).toBeCalledWith(newValue);
  });

  it('calls the onRemove function when the Remove icon is clicked', () => {
    wrapper = mount(
      <PasteOrUpload {...defaultProps} value={faker.random.words()} />
    );
    expect(wrapper.find('.removeIconHolder')).toHaveLength(1);
    wrapper.find(ImageButton).prop('onClick')();
    expect(onRemove).toBeCalled();
  });
});
