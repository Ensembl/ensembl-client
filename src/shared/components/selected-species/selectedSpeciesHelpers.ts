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

import { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

const SPECIES_NAME_SIZE = 15;
const ASSEMBLY_NAME_SIZE = 11;
const PADDING_SIZE = 20;
const SPACE_BETWEEN = 10;
const BORDER_WIDTH = 1;

export const getDisplayName = (species: {
  common_name: string | null;
  scientific_name: string;
}) => species.common_name || species.scientific_name;

export const getFullSpeciesItemWidth = (species: CommittedItem) => {
  const name = getDisplayName(species);
  const assembly_name = species.assembly.name;

  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvasContext.font = `700 ${SPECIES_NAME_SIZE}px Lato`;
  const speciesNameWidth = Math.ceil(canvasContext.measureText(name).width);

  canvasContext.font = `${ASSEMBLY_NAME_SIZE}px Lato`;
  const assemblyNameWidth = Math.ceil(
    canvasContext.measureText(assembly_name).width
  );

  const fullWidth =
    PADDING_SIZE * 2 +
    speciesNameWidth +
    SPACE_BETWEEN +
    assemblyNameWidth +
    2 * BORDER_WIDTH;
  return fullWidth;
};
