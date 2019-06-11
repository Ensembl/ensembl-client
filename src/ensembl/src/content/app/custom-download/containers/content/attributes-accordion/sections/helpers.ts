export const getMatchedSpeciesList = (searchTerm: string, props: any) => {
  let allSpecies = props.orthologueSpecies;

  const filteredSpecies: any = {};

  allSpecies.species.forEach((species: any) => {
    if (
      (species.display_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
        -1 &&
        props.shouldShowBestMatches) ||
      props.shouldShowAll
    ) {
      filteredSpecies[species.name] = {
        id: species.name,
        label: species.display_name,
        isChecked: false
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
        if (props.orthologueFilteredSpecies.default[species].isChecked) {
          filteredSpecies[species] =
            props.orthologueFilteredSpecies.default[species];
        }
      }
    );
  }

  newOrthologueFilteredSpecies.default = filteredSpecies;

  props.setOrthologueFilteredSpecies(newOrthologueFilteredSpecies);
};
