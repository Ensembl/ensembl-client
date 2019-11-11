import React from 'react';
import { mount } from 'enzyme';
import PasteOrUpload from './PasteOrUpload';
import faker from 'faker';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import Textarea from 'src/shared/components/textarea/Textarea';
import Upload from 'src/shared/components/upload/Upload';

const onChange = jest.fn();
const onRemove = jest.fn();
const onUpload = jest.fn();

describe('<PasteOrUpload/>', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let wrapper: any;
  const defaultProps = {
    value: null,
    onChange,
    onRemove,
    onUpload
  };

  it('renders without error', () => {
    wrapper = () => {
      mount(<PasteOrUpload {...defaultProps} />);
    };
    expect(wrapper).not.toThrow();
  });

  it('displays the text "Paste data" by default', () => {
    wrapper = mount(<PasteOrUpload {...defaultProps} />);

    expect(wrapper.text()).toContain('Paste data');
  });

  it('displays the Upload component by default', () => {
    wrapper = mount(<PasteOrUpload {...defaultProps} />);

    expect(wrapper.find(Upload)).toHaveLength(1);
  });
  it('displays the Textarea by default when a value is passed', () => {
    wrapper = mount(
      <PasteOrUpload {...defaultProps} value={faker.random.words()} />
    );
    expect(wrapper.find(Textarea)).toHaveLength(1);
  });

  it('does not display the text "Paste data" or the Upload component when a value is passed', () => {
    wrapper = mount(<PasteOrUpload {...defaultProps} value={'foo'} />);

    expect(wrapper.text()).not.toContain('Paste data');

    expect(wrapper.find(Upload)).toHaveLength(0);
  });

  it('shows the textarea on clicking the text "Paste data"', () => {
    wrapper = mount(<PasteOrUpload {...defaultProps} />);
    wrapper.find('.pasteText').simulate('click');
    expect(wrapper.find(Textarea)).toHaveLength(1);
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
    expect(wrapper.find(Textarea).prop('placeholder')).toBe(placeholder);
  });

  it('calls the onChange function with the current value when the textarea is changed', () => {
    wrapper = mount(<PasteOrUpload {...defaultProps} value={'foo'} />);
    const newValue = faker.random.words();
    const event = {
      target: { value: newValue }
    };
    wrapper.find('textarea').prop('onChange')(event);
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

  it('passes the additional uploadProps to the Upload component', () => {
    const uploadProps: any = {
      foo: 'bar'
    };
    wrapper = mount(
      <PasteOrUpload {...defaultProps} uploadProps={uploadProps} />
    );
    expect(wrapper.find(Upload).prop('foo')).toBe('bar');
  });
});
