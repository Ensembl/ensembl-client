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
  type ReactNode,
  type MouseEvent
} from 'react';
import classNames from 'classnames';

import { AutosuggestContext } from './context/AutosuggestContext';

import styles from './AutosuggestSearchField.module.css';

type Props = {
  children: ReactNode;
  data: unknown;
  className?: string;
};

const Suggestion = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const context = use(AutosuggestContext);
  const componentRef = useRef<HTMLDivElement>(null);

  if (!context) {
    throw new Error('This component requires AutosuggestContext');
  }

  const {
    state: { activeSuggestionElement }
  } = context;

  useEffect(() => {
    if (activeSuggestionElement === componentRef.current) {
      // Eslint is upset, because it doesn't want synchronous state updates in effects.
      // But this update is conditional on reading from a ref, which should not be done
      // directly during render.

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsActive(true);
    } else if (isActive) {
      setIsActive(false);
    }
  }, [activeSuggestionElement, isActive, props.data]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget;
    const newEvent = new Event('autosuggest-suggestion-click', {
      bubbles: true
    });
    element.dispatchEvent(newEvent);
  };

  const componentClasses = classNames(
    styles.suggestion,
    { [styles.suggestionActive]: isActive },
    props.className
  );

  const dataString = JSON.stringify(props.data);

  return (
    <div
      data-type="suggestion"
      data-search={dataString}
      className={componentClasses}
      ref={componentRef}
      onClick={handleClick}
    >
      {props.children}
    </div>
  );
};

export default Suggestion;
