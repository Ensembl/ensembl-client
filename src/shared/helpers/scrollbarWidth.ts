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

// Find scrollbar width and set it to css variable so that it can be used for style calculations
export const setScrollbarWidth = () => {
  // Create a dummy element for scrollbar measurement
  const element = document.createElement('div');

  element.style.position = 'absolute';
  element.style.top = '-100px';
  element.style.overflow = 'scroll';

  document.body.appendChild(element);
  const scrollbarWidth = element.offsetWidth - element.scrollWidth;

  const rootNode = document.querySelector(':root') as HTMLElement;
  rootNode?.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

  // Remove the dummy element once the css variable is set
  document.body.removeChild(element);
};
