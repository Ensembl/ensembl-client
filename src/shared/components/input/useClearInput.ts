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

import { useState, useEffect, type RefObject } from 'react';

const useClearInput = (ref: RefObject<HTMLInputElement>) => {
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return; // shouldn't happen
    }

    const inputElement = ref.current;
    const initialInputValue = inputElement.value;
    setHasContent(!!initialInputValue.length);

    inputElement.addEventListener('input', onInput);

    return () => inputElement.removeEventListener('input', onInput);
  }, [ref.current]);

  const onInput = (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;
    const inputValue = inputElement.value;
    setHasContent(!!inputValue.length);
  };

  const clearInput = () => {
    const inputElement = ref?.current;
    if (inputElement) {
      inputElement.value = '';
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      inputElement.dispatchEvent(new Event('change', { bubbles: true })); // FIXME: no point
      inputElement.focus();
    }
  };

  return {
    canClearInput: hasContent,
    clearInput
  };
};

export default useClearInput;
