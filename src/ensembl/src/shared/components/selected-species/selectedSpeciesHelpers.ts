import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

const SPECIES_NAME_SIZE = 14;
const ASSEMBLY_NAME_SIZE = 11;
const PADDING_SIZE = 20;
const SPACE_BETWEEN = 7;
const BORDER_WIDTH = 1;

export const getDisplayName = (species: CommittedItem) =>
  species.common_name || species.scientific_name;

export const getFullSpeciesItemWidth = (species: CommittedItem) => {
  const name = getDisplayName(species);
  const { assembly_name } = species;

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
