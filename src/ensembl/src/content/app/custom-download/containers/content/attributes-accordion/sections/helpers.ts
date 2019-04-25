import { getSpeciesList } from 'src/services/custom-download.ts';

export const getMatchedSpeciesList = async (searchTerm: string, props: any) => {
  let allSpecies;

  if (!props.orthologueSpecies.length) {
    allSpecies = await getSpeciesList();
    props.setOrthologueSpecies(allSpecies);
  } else {
    allSpecies = props.orthologueSpecies;
  }
  const filteredSpecies: any = {};

  allSpecies.forEach((species: any) => {
    if (
      species.display_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
      -1
    ) {
      filteredSpecies[species.name] = {
        id: species.name,
        label: species.display_name,
        checkedStatus: false
      };
    }
  });

  const newOrthologueAttributes: any = {};

  if (props.orthologueAttributes && props.orthologueAttributes.default) {
    Object.keys(props.orthologueAttributes.default).forEach(
      (species: string) => {
        if (props.orthologueAttributes.default[species].checkedStatus) {
          filteredSpecies[species] =
            props.orthologueAttributes.default[species];
        }
      }
    );
  }

  newOrthologueAttributes.default = filteredSpecies;

  props.setOrthologueAttributes(newOrthologueAttributes);
};
