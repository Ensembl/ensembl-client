/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  use,
  useState,
  useEffect,
  useRef,
  type ComponentPropsWithRef,
  type ReactNode,
  type KeyboardEvent,
  type InputEvent
} from 'react';

import AutosuggestContextProvider, {
  AutosuggestContext
} from './context/AutosuggestContext';
import ShadedInput from 'src/shared/components/input/ShadedInput';

import styles from './AutosuggestSearchField.module.css';

type SuggestionSelectedPayload = {
  index: number; // 0-based index of the position of the suggestion in the list
  data: unknown; // data associated with the suggestion
  element: HTMLElement; // DOM element of the suggestion; hopefully not needed by consumer, but sending it for good measure
};

export type Props = Omit<
  ComponentPropsWithRef<'input'>,
  'size' | 'onSubmit'
> & {
  query: string;
  suggestions?: ReactNode;
  onSubmit?: (query: string) => void;
  onSuggestionSelected: (payload: SuggestionSelectedPayload) => void;
  help?: string;
};

const useValuesFromContext = () => {
  const context = use(AutosuggestContext);

  if (!context) {
    throw new Error('This component requires AutosuggestContext');
  }

  const {
    state,
    setActiveSuggestion,
    unsetActiveSuggestion,
    resetSuggestions
  } = context;

  const { activeSuggestionIndex, activeSuggestionElement } = state;

  return {
    activeSuggestionIndex,
    activeSuggestionElement,
    setActiveSuggestion,
    unsetActiveSuggestion,
    resetSuggestions
  };
};

const AutosuggestSearchField = (props: Props) => {
  const { query, suggestions, onSubmit, onSuggestionSelected, ...otherProps } =
    props;
  const [areSuggestionsDisabled, setAreSuggestionsDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isPointerDownOnPanel = useRef(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const {
    activeSuggestionIndex,
    activeSuggestionElement,
    setActiveSuggestion,
    unsetActiveSuggestion,
    resetSuggestions
  } = useValuesFromContext();
  const hasSuggestions = !!suggestions;

  const getAllSuggestionElements = () => {
    const container = popoverRef.current as HTMLElement;
    return container.querySelectorAll('[data-type="suggestion"]');
  };

  useEffect(() => {
    if (!hasSuggestions) {
      resetSuggestions();
    }
  }, [hasSuggestions, resetSuggestions]);

  /**
   * This function (used as a callback ref) will be called during every render.
   * It would take a useCallback to prevent this from happening.
   * But a useCallback would require changes to onSuggestionClick function
   * and all its dependencies.
   */
  const onPopoverMount = (element: HTMLDivElement) => {
    element.showPopover();
    popoverRef.current = element;

    element.addEventListener('autosuggest-suggestion-click', onSuggestionClick);

    return () => {
      popoverRef.current = null;
      element.removeEventListener(
        'autosuggest-suggestion-click',
        onSuggestionClick
      );
    };
  };

  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    if (key === 'Enter') {
      // - If one of the suggestions is focused, then submit this suggestion
      // - Alternatively, if parent has provided an onSubmit property, call it passing the query into it
      // - If onSubmit property isn't present, the component will behave as any regular input field does
      //   (i.e. if it is inside of a form, it will trigger form submission)
      setAreSuggestionsDisabled(true);
      if (activeSuggestionElement) {
        event.preventDefault();
        onSuggestionSubmit();
      } else if (onSubmit) {
        event.preventDefault();
        onSubmit(query);
      }
    } else if (key === 'ArrowDown') {
      event.preventDefault();
      if (areSuggestionsDisabled) {
        setAreSuggestionsDisabled(false);
      } else {
        focusNextSuggestion();
      }
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      focusPreviousSuggestion();
    } else if (key === 'Escape') {
      event.preventDefault();
      setAreSuggestionsDisabled(true);
      resetSuggestions();
    }
  };

  const onInput = (event: InputEvent<HTMLInputElement>) => {
    if (areSuggestionsDisabled) {
      setAreSuggestionsDisabled(false);
    }
    props.onInput?.(event);
  };

  const onSearchFieldFocus = () => {
    setAreSuggestionsDisabled(false);
  };

  // This would handle tabbing out or clicking outside the input field.
  // Notice, however, that a click on the suggestion panel also produces a blur event
  const onSearchFieldBlur = () => {
    if (isPointerDownOnPanel.current) {
      // Blur event was caused by clicking on suggestions panel;
      // ignore it
      return;
    }
    setAreSuggestionsDisabled(true);
    resetSuggestions();
  };

  const onPointerDownOnPanel = () => {
    isPointerDownOnPanel.current = true;
    setTimeout(() => {
      isPointerDownOnPanel.current = false;
    }, 0);
  };

  const focusPreviousSuggestion = () => {
    if (!suggestions || activeSuggestionIndex === null) {
      return;
    } else if (activeSuggestionIndex === 0) {
      unsetActiveSuggestion();
      return;
    }
    const allSuggestionElements = getAllSuggestionElements();
    const previousIndex = activeSuggestionIndex - 1;
    const suggestionElement = allSuggestionElements[previousIndex];

    setActiveSuggestion({
      index: previousIndex,
      element: suggestionElement as HTMLElement
    });
  };

  const focusNextSuggestion = () => {
    if (!suggestions) {
      return;
    }

    const allSuggestionElements = getAllSuggestionElements();

    if (activeSuggestionIndex === allSuggestionElements.length - 1) {
      return;
    }

    const nextIndex =
      activeSuggestionIndex === null ? 0 : activeSuggestionIndex + 1;
    const suggestionElement = allSuggestionElements[nextIndex];

    setActiveSuggestion({
      index: nextIndex,
      element: suggestionElement as HTMLElement
    });
  };

  const getSearchDataFromSuggestionElement = (element: HTMLElement) => {
    const dataString = element.dataset.search;
    return dataString ? JSON.parse(dataString) : null;
  };

  const onSuggestionSubmit = () => {
    const suggestionData = getSearchDataFromSuggestionElement(
      activeSuggestionElement as HTMLElement
    );
    const payload = {
      index: activeSuggestionIndex as number,
      element: activeSuggestionElement as HTMLElement,
      data: suggestionData
    };
    // reset suggestions

    onSuggestionSelected(payload);
  };

  const onSuggestionClick = (event: Event) => {
    const element = event.target as HTMLElement;
    const suggestionData = getSearchDataFromSuggestionElement(element);

    const suggestionElements = getAllSuggestionElements();
    const index = [...suggestionElements].indexOf(element);

    const payload = {
      index: index,
      element,
      data: suggestionData
    };

    setAreSuggestionsDisabled(true);
    onSuggestionSelected(payload);
  };

  const shouldShowSuggestions = hasSuggestions && !areSuggestionsDisabled;

  return (
    <div className={styles.wrapper}>
      <ShadedInput
        {...otherProps}
        value={query}
        onKeyDown={onKeyPress}
        onFocus={onSearchFieldFocus}
        onBlur={onSearchFieldBlur}
        onInput={onInput}
        ref={inputRef}
      />
      {shouldShowSuggestions && (
        <div
          popover="manual"
          className={styles.suggestionsPanel}
          ref={onPopoverMount}
          onPointerDown={onPointerDownOnPanel}
        >
          {suggestions}
        </div>
      )}
    </div>
  );
};

const WrappedAutosuggestSearchField = (props: Props) => {
  return (
    <AutosuggestContextProvider>
      <AutosuggestSearchField {...props} />
    </AutosuggestContextProvider>
  );
};

export default WrappedAutosuggestSearchField;
