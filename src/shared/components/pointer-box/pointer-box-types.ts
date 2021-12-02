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
The first part of position name signifies the direction in which PointerBox
is positioned relative to the anchor.
The second part of position name refers to the direction in which the body
of the pointer box will grow with more content

Examples:

anchor
__/\____________
| BOTTOM_RIGHT |
|______________|

__________
|          \ 
|  LEFT    /  anchor
|  BOTTOM |
|         |
|_________|

*/

export enum Position {
  TOP_LEFT = 'top_left',
  TOP_RIGHT = 'top_right',
  RIGHT_TOP = 'right_top',
  RIGHT_BOTTOM = 'right_bottom',
  BOTTOM_RIGHT = 'bottom_right',
  BOTTOM_LEFT = 'bottom_left',
  LEFT_BOTTOM = 'left_bottom',
  LEFT_TOP = 'left_top'
}
