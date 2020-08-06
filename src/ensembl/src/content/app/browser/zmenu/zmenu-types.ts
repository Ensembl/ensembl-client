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

// coordinates of the point at which zmenu should be pointing
export type AnchorCoordinates = {
  x: number;
  y: number;
};

export enum Markup {
  STRONG = 'strong',
  EMPHASIS = 'emphasis',
  FOCUS = 'focus',
  LIGHT = 'light'
}

export type ZmenuContentItem = {
  text: string;
  markup: Markup[];
};

export type ZmenuContentBlock = ZmenuContentItem[];

export type ZmenuContentLine = ZmenuContentBlock[];

export type ZmenuContentFeature = {
  id: string;
  track_id: string;
  lines: ZmenuContentLine[];
};

// data that is sufficient to describe an instance of Zmenu
export type ZmenuData = {
  id: string;
  anchor_coordinates: AnchorCoordinates;
  content: ZmenuContentFeature[];
};
