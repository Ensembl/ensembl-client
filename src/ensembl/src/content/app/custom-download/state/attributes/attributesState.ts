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

import { AttributeWithOptions } from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

export type OrthologueState = {
  searchTerm: string;
  species: CheckboxGridOption[];
  showBestMatches: boolean;
  showAll: boolean;
  applyToAllSpecies: boolean;
};

export type AttributeUi = {
  [key: string]: AttributeWithOptions | { [key: string]: AttributeWithOptions };
};

export type AttributesState = Readonly<{
  expandedPanels: string[];
  content: AttributeUi;
  selectedAttributes: JSONValue;
  ui: JSONValue;
  orthologue: OrthologueState;
}>;

export const defaultAttributesState: AttributesState = {
  expandedPanels: [],
  content: {},
  selectedAttributes: {},
  ui: {},
  orthologue: {
    searchTerm: '',
    species: [],
    showBestMatches: false,
    showAll: false,
    applyToAllSpecies: false
  }
};
