import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import humanImage from 'tests/data/species-selector/popular-species/human38_k.svg';
import aspergillusImage from 'tests/data/species-selector/popular-species/aspergillus_k.svg';
import mouseImage from 'tests/data/species-selector/popular-species/mouse_k.svg';

import { PopularSpeciesButton } from 'src/content/app/species-selector/components/popular-species-button/PopularSpeciesButton';

import styles from './PopularSpeciesButton.stories.scss';

import { PopularSpecies } from 'src/content/app/species-selector/types/species-search';

const humanSpeciesData = {
  genome_id: 'homo_sapiens38',
  reference_genome_id: null,
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  assembly_name: 'GRCh38',
  image: humanImage,
  division_ids: [],
  isAvailable: true
};

const aspergillusSpeciesData = {
  genome_id: 'aspergillus_fumigatus',
  reference_genome_id: null,
  common_name: null,
  scientific_name: 'Aspergillus fumigatus A1163',
  assembly_name: 'ASM15014v1',
  image: aspergillusImage,
  division_ids: [],
  isAvailable: false
};

const mouseSpeciesData = {
  genome_id: 'mus_musculus',
  reference_genome_id: null,
  common_name: 'Mouse',
  scientific_name: 'Mus musculus',
  assembly_name: 'GRCm38.p6',
  image: mouseImage,
  division_ids: [],
  isAvailable: false
};

const Wrapper = () => {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | null>(
    null
  );

  const handleButtonClick = (speciesData: PopularSpecies) => {
    const { genome_id } = speciesData;
    if (genome_id !== selectedSpeciesId) {
      setSelectedSpeciesId(genome_id);
    } else {
      setSelectedSpeciesId(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <PopularSpeciesButton
        species={humanSpeciesData}
        isSelected={humanSpeciesData.genome_id === selectedSpeciesId}
        isCommitted={false}
        handleSelectedSpecies={handleButtonClick}
      />
      <PopularSpeciesButton
        species={aspergillusSpeciesData}
        isSelected={aspergillusSpeciesData.genome_id === selectedSpeciesId}
        isCommitted={false}
        handleSelectedSpecies={handleButtonClick}
      />
      <PopularSpeciesButton
        species={mouseSpeciesData}
        isSelected={mouseSpeciesData.genome_id === selectedSpeciesId}
        isCommitted={false}
        handleSelectedSpecies={handleButtonClick}
      />
    </div>
  );
};

storiesOf('Components|Species Selector/Popular species button', module).add(
  'not selected',
  () => <Wrapper />
);
