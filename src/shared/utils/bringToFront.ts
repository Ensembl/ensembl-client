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

/* 
  Given an array and a member of this array,
  return a copy of the received array, where the received member
  is guaranteed to be in the first place
*/

import findIndex from 'lodash/findIndex';
import isEqual from 'lodash/isEqual';

const bringToFront = <T>(elements: T[], promotedElement: T) => {
  const promotedElementIndex = findIndex(elements, (element) =>
    isEqual(element, promotedElement)
  );

  if (elements.length < 2 || promotedElementIndex === -1) {
    // no need to do anything for short arrays or for arrays that do not include promoted element
    return elements;
  }

  const newElements = [...elements];

  newElements.splice(promotedElementIndex, 1); // remove promoted element from the array
  newElements.unshift(promotedElement);

  return newElements;
};

export default bringToFront;
