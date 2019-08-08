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
