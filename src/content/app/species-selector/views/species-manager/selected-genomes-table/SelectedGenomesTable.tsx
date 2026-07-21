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

import { Link } from 'react-router';

import { useAppDispatch } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { toggleSpeciesUseAndSave } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import {
  Table,
  ColumnHead,
  VerticallyCenteredCellContent
} from 'src/shared/components/table';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';
import {
  CommonName,
  ScientificName,
  AssemblyName,
  AssemblyAccessionId,
  SpeciesType,
  GenomeRelease,
  GenomeReleaseType
} from 'src/shared/components/species-name-parts-for-table';

import SpeciesSelectorIcon from 'static/icons/icon_launchbar_species_selector.svg';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './SelectedGenomesTable.module.css';

const SelectedGenomesTable = (props: {
  allSelectedGenomes: CommittedItem[];
  filteredGenomes: CommittedItem[];
  selectedGenomeIds: string[];
  onSelectedGenomeIdsChange: (genomeIds: string[]) => void;
}) => {
  const { allSelectedGenomes, filteredGenomes } = props;
  const reduxDispatch = useAppDispatch();

  const selectedGenomeIds = new Set<string>(props.selectedGenomeIds);
  const allVisibleGenomesSelected =
    !!filteredGenomes.length &&
    filteredGenomes.every((genome) => selectedGenomeIds.has(genome.genome_id));
  const someVisibleGenomesSelected = filteredGenomes.some((genome) =>
    selectedGenomeIds.has(genome.genome_id)
  );

  if (!allSelectedGenomes.length) {
    return <div>You have not selected any genomes</div>;
  }

  const getLinkToSpeciesPage = (species: CommittedItem) => {
    const { genome_id, genome_tag } = species;
    const idForUrl = genome_tag ?? genome_id;
    return urlFor.speciesPage({ genomeId: idForUrl });
  };

  const getSpeciesLinkAriaLabel = (species: CommittedItem) => {
    const { scientific_name, assembly } = species;
    return `Home page for ${scientific_name}, ${assembly.name}`;
  };

  const toggleGenomeUse = (genome: CommittedItem) => {
    reduxDispatch(toggleSpeciesUseAndSave(genome.genome_id));
  };

  const toggleGenomeSelection = (genome: CommittedItem) => {
    const updatedSelectedGenomeIds = selectedGenomeIds.has(genome.genome_id)
      ? props.selectedGenomeIds.filter(
          (genomeId) => genomeId !== genome.genome_id
        )
      : [...props.selectedGenomeIds, genome.genome_id];

    props.onSelectedGenomeIdsChange(updatedSelectedGenomeIds);
  };

  const toggleAllVisibleGenomesSelection = () => {
    const visibleGenomeIds = new Set(
      filteredGenomes.map((genome) => genome.genome_id)
    );

    const updatedSelectedGenomeIds = allVisibleGenomesSelected
      ? props.selectedGenomeIds.filter(
          (genomeId) => !visibleGenomeIds.has(genomeId)
        )
      : [
          ...props.selectedGenomeIds,
          ...filteredGenomes
            .map((genome) => genome.genome_id)
            .filter((genomeId) => !selectedGenomeIds.has(genomeId))
        ];

    props.onSelectedGenomeIdsChange(updatedSelectedGenomeIds);
  };

  return (
    <Table stickyHeader={true} className={styles.table}>
      <thead>
        <tr>
          <ColumnHead>
            <div className={styles.tableCellCheckboxWrapper}>
              <SelectAllGenomesCheckbox
                someVisibleGenomesSelected={someVisibleGenomesSelected}
                allVisibleGenomesSelected={allVisibleGenomesSelected}
                disabled={!filteredGenomes.length}
                onChange={toggleAllVisibleGenomesSelection}
              />
            </div>
          </ColumnHead>
          <ColumnHead>Genome page</ColumnHead>
          <ColumnHead>Common name</ColumnHead>
          <ColumnHead>Scientific name</ColumnHead>
          <ColumnHead>Type</ColumnHead>
          <ColumnHead>Assembly</ColumnHead>
          <ColumnHead>Release</ColumnHead>
          <ColumnHead>Release type</ColumnHead>
          <ColumnHead>Assembly accession</ColumnHead>
          <ColumnHead>Use in apps</ColumnHead>
        </tr>
      </thead>
      <tbody>
        {filteredGenomes.map((genome) => (
          <tr key={genome.genome_id}>
            <td className={styles.selectionColumnCell}>
              <VerticallyCenteredCellContent>
                <Checkbox
                  checked={selectedGenomeIds.has(genome.genome_id)}
                  onChange={() => toggleGenomeSelection(genome)}
                  aria-label={`Select ${getGenomeLabel(genome)}`}
                />
              </VerticallyCenteredCellContent>
            </td>
            <td className={styles.alignCenter}>
              <VerticallyCenteredCellContent>
                <Link
                  to={getLinkToSpeciesPage(genome)}
                  className={styles.speciesHomeLink}
                >
                  <SpeciesSelectorIcon
                    className={styles.speciesHomeIcon}
                    role="img"
                    aria-label={getSpeciesLinkAriaLabel(genome)}
                  />
                </Link>
              </VerticallyCenteredCellContent>
            </td>
            <td>
              <CommonName {...genome} />
            </td>
            <td>
              <ScientificName {...genome} />
            </td>
            <td>
              <SpeciesType {...genome} />
            </td>
            <td>
              <AssemblyName {...genome} />
            </td>
            <td>
              <GenomeRelease release={genome.release} />
            </td>
            <td>
              <GenomeReleaseType release={genome.release} />
            </td>
            <td>
              <AssemblyAccessionId {...genome} />
            </td>
            <td className={styles.alignCenter}>
              <VerticallyCenteredCellContent>
                <SlideToggle
                  className={styles.toggle}
                  isOn={genome.isEnabled}
                  onChange={() => toggleGenomeUse(genome)}
                />
              </VerticallyCenteredCellContent>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const SelectAllGenomesCheckbox = (props: {
  someVisibleGenomesSelected: boolean;
  allVisibleGenomesSelected: boolean;
  disabled: boolean;
  onChange: () => void;
}) => {
  const isChecked = props.allVisibleGenomesSelected;

  // NOTE:
  // if we want to add an indeterminate status of the checkbox,
  // that would be props.someVisibleGenomesSelected && !props.allVisibleGenomesSelected

  return (
    <Checkbox
      checked={isChecked}
      disabled={props.disabled}
      onChange={props.onChange}
      aria-label="Select all genomes in this table"
    />
  );
};

const getGenomeLabel = (genome: CommittedItem) => {
  return `${genome.common_name ?? genome.scientific_name} (${genome.assembly.name})`;
};

export default SelectedGenomesTable;
