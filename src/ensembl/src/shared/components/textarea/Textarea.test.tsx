import React from 'react';
import { mount, render } from 'enzyme';

import Textarea from './Textarea';

describe('<Textarea />', () => {
  const commonTextareaProps = {
    id: 'testId',
    name: 'testTextareaName',
    className: 'testTextareaClass',
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

  describe('rendering', () => {
    const TextareaValue = 'foo';
    const props = {
      ...commonTextareaProps,
      value: TextareaValue
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
      const TextareaValue = 'foo';
      const changedValue = TextareaValue + '1';
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: TextareaValue
      });

      wrappedTextarea.simulate('change', { target: { value: changedValue } });
      expect(commonTextareaProps.onChange).toHaveBeenLastCalledWith(
        changedValue
      );
    });

    test('passes string value to onFocus', () => {
      const TextareaValue = 'foo';
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: TextareaValue
      });

      wrappedTextarea.simulate('focus');
      expect(commonTextareaProps.onFocus).toHaveBeenLastCalledWith(
        TextareaValue
      );
    });

    test('passes string value to onBlur', () => {
      const TextareaValue = 'foo';
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: TextareaValue
      });

      wrappedTextarea.simulate('blur');
      expect(commonTextareaProps.onBlur).toHaveBeenLastCalledWith(
        TextareaValue
      );
    });
  });

  describe('responding with events', () => {
    test('passes event to onChange', () => {
      const TextareaValue = 'foo';
      const changedValue = TextareaValue + '1';
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: TextareaValue,
        callbackWithEvent: true
      });

      wrappedTextarea.simulate('change', { target: { value: changedValue } });
      expect(commonTextareaProps.onChange.mock.calls[0][0].target.value).toBe(
        changedValue
      );
    });

    test('passes event to onFocus', () => {
      const TextareaValue = 'foo';
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: TextareaValue,
        callbackWithEvent: true
      });

      wrappedTextarea.simulate('focus');
      expect(commonTextareaProps.onFocus.mock.calls[0][0].target.value).toBe(
        TextareaValue
      );
    });

    test('passes event to onBlur', () => {
      const TextareaValue = 'foo';
      const wrappedTextarea = getWrappedTextarea({
        ...commonTextareaProps,
        value: TextareaValue,
        callbackWithEvent: true
      });

      wrappedTextarea.simulate('blur');
      expect(commonTextareaProps.onBlur.mock.calls[0][0].target.value).toBe(
        TextareaValue
      );
    });
  });
});
