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
      (species.display_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
        -1 &&
        props.shouldShowBestMatches) ||
      props.shouldShowAll
    ) {
      filteredSpecies[species.name] = {
        id: species.name,
        label: species.display_name,
        checkedStatus: false
      };
    }
  });

  const newOrthologueFilteredSpecies: any = {};

  if (
    props.orthologueFilteredSpecies &&
    props.orthologueFilteredSpecies.default
  ) {
    Object.keys(props.orthologueFilteredSpecies.default).forEach(
      (species: string) => {
        if (props.orthologueFilteredSpecies.default[species].checkedStatus) {
          filteredSpecies[species] =
            props.orthologueFilteredSpecies.default[species];
        }
      }
    );
  }

  newOrthologueFilteredSpecies.default = filteredSpecies;

  props.setOrthologueFilteredSpecies(newOrthologueFilteredSpecies);
};
