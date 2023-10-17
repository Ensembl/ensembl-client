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

export const sortStringAsc = (a: string | null, b: string | null) => {
  if (a === b || (!a && !b)) {
    return 0;
  } else if (!a) {
    return 1;
  } else if (!b) {
    return -1;
  } else {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }
};

export const sortStringDesc = (a: string | null, b: string | null) => {
  if (a === b || (!a && !b)) {
    return 0;
  } else if (!a) {
    return -1;
  } else if (!b) {
    return 1;
  } else {
    return b.toLowerCase().localeCompare(a.toLowerCase());
  }
};

// accepts elements that are either numbers or nulls
export const sortNumberAsc = (a: number | null, b: number | null) => {
  if (a === b) {
    return 0;
  } else if (a === null) {
    return 1;
  } else if (b === null) {
    return -1;
  } else {
    return a - b;
  }
};

// accepts elements that are either numbers or nulls
export const sortNumberDesc = (a: number | null, b: number | null) => {
  if (a === b) {
    return 0;
  } else if (a === null) {
    return 1;
  } else if (b === null) {
    return -1;
  } else {
    return b - a;
  }
};
