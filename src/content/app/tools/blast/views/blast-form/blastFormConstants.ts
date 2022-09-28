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

const columnWidth = 860;
const columnGap = 45;
const leftPagePadding = 60;
const rightPagePadding = 30;
const smallViewportBreakpoint =
  columnWidth * 2 + columnGap + leftPagePadding + rightPagePadding;

export const smallViewportMediaQuery = `(max-width: ${
  smallViewportBreakpoint - 1
}px)`; // subtract 1 because we are matching the max width
