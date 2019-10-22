import React from 'react';
import { mount, render } from 'enzyme';
import faker from 'faker';
import Textarea from './Textarea';

describe('<Textarea />', () => {
  const commonTextareaProps = {
    id: faker.random.word(),
    name: faker.random.word(),
    className: faker.random.word(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn()
  };

  const getWrappedTextarea = (props: any) => mount(<Textarea {...props} />);

  const getStaticallyWrappedTextarea = (props: any) =>
    render(<Textarea {...props} />);

  afterEach(() => {
    jest.resetAllMocks();
  });

  const textareaValue = faker.random.words();

  describe('rendering', () => {
    const props = {
      ...commonTextareaProps,
      value: textareaValue
    };

    test('passes relevant props to the Textarea element', () => {
      const wrappedTextarea = getStaticallyWrappedTextarea(props);

      expect(wrappedTextarea.attr('id')).toBe(commonTextareaProps.id);
      expect(wrappedTextarea.attr('name')).toBe(commonTextareaProps.name);
      expect(wrappedTextarea.attr('class')).toMatch(
        commonTextareaProps.className
      );
    });

    test('disableResize class name is applied when resizable is false', () => {
      const wrappedTextarea = getStaticallyWrappedTextarea({
        ...commonTextareaProps,
        resizable: false
      });
      expect(wrappedTextarea.hasClass('disableResize')).toBe(true);
    });
  });

  describe('responding with data', () => {
    test('passes string value to onChange', () => {
      const changedValue = faker.random.words();
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: textareaValue
      });

      wrappedTextarea.simulate('change', { target: { value: changedValue } });
      expect(commonTextareaProps.onChange).toHaveBeenLastCalledWith(
        changedValue
      );
    });

    test('passes string value to onFocus', () => {
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: textareaValue
      });

      wrappedTextarea.simulate('focus');
      expect(commonTextareaProps.onFocus).toHaveBeenLastCalledWith(
        textareaValue
      );
    });

    test('passes string value to onBlur', () => {
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: textareaValue
      });

      wrappedTextarea.simulate('blur');
      expect(commonTextareaProps.onBlur).toHaveBeenLastCalledWith(
        textareaValue
      );
    });
  });

  describe('responding with events', () => {
    test('passes event to onChange', () => {
      const changedValue = faker.random.words();
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: textareaValue,
        callbackWithEvent: true
      });

      wrappedTextarea.simulate('change', { target: { value: changedValue } });
      expect(commonTextareaProps.onChange.mock.calls[0][0].target.value).toBe(
        changedValue
      );
    });

    test('passes event to onFocus', () => {
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: textareaValue,
        callbackWithEvent: true
      });

      wrappedTextarea.simulate('focus');
      expect(commonTextareaProps.onFocus.mock.calls[0][0].target.value).toBe(
        textareaValue
      );
    });

    test('passes event to onBlur', () => {
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: textareaValue,
        callbackWithEvent: true
      });

      wrappedTextarea.simulate('blur');
      expect(commonTextareaProps.onBlur.mock.calls[0][0].target.value).toBe(
        textareaValue
      );
    });
  });
});
