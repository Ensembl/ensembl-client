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

const useInputFocus = (ref: RefObject<HTMLInputElement | null>) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      // shouldn't happen
      return;
    }

    const inputElement = ref.current;
    inputElement.addEventListener('focus', onFocus);
    inputElement.addEventListener('blur', onBlur);

    return () => {
      inputElement.removeEventListener('focus', onFocus);
      inputElement.removeEventListener('blur', onBlur);
    };
  }, [ref.current]);

  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  return isFocused;
};

export default useInputFocus;
