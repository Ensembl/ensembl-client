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

// creating dummy elements to simulate scrollbar
// Find scrollbar width and set it to css variable so that it can be used to calculate the right padding
// Removing dummy elements once css variable is set
export const setScrollbarWidth = () => {
  // Creating invisible container and child to show scrollbar
  const outer = document.createElement('div');
  const inner = document.createElement('div');

  outer.style.position = 'absolute';
  outer.style.top = '0';
  outer.style.overflow = 'scroll';

  outer.appendChild(inner);
  document.body.appendChild(outer);
  const scrollbarWidth = outer.offsetWidth - outer.scrollWidth;

  const rootNode = document.querySelector(':root') as HTMLElement;
  rootNode?.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

  document.body.removeChild(outer);
};
