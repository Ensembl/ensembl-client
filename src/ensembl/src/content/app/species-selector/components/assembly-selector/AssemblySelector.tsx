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

import React from 'react';
import { connect } from 'react-redux';
import find from 'lodash/find';

import { changeAssembly } from 'src/content/app/species-selector/state/speciesSelectorActions';
import {
  getCurrentSpeciesGenomeId,
  getCurrentSpeciesAssemblies
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import Select from 'src/shared/components/select/Select';

import { RootState } from 'src/store';
import { Assembly } from 'src/content/app/species-selector/types/species-search';

import styles from './AssemblySelector.scss';

type Props = {
  genomeId: string | null; // id of selected species; will correspond to genome_id field of an Assembly
  assemblies: Assembly[];
  onSelect: (assembly: Assembly) => void;
};

const label = <span className={styles.assemblySelectorLabel}>Assembly</span>;

export const AssemblySelector = (props: Props) => {
  const selectedAssembly = find(
    props.assemblies,
    (assembly) => assembly.genome_id === props.genomeId
  );

  const handleSelect = (index: number) => {
    props.onSelect(props.assemblies[index]);
  };

  if (!props.genomeId || !selectedAssembly) {
    // this branch covers the case when there are no items in props.assemblies
    return null;
  } else if (props.assemblies.length === 1) {
    // if there's just one assembly, there is no point in showing the select element
    return (
      <>
        {label}
        <span>{selectedAssembly.assembly_name}</span>
      </>
    );
  } else {
    // more than one item in props.assemblies
    const options = props.assemblies.map((assembly, index) => ({
      value: index,
      label: assembly.assembly_name,
      isSelected: props.genomeId === assembly.genome_id
    }));
    return (
      <>
        {label}
        <Select options={options} onSelect={handleSelect} />
      </>
    );
  }
};

const mapStateToProps = (state: RootState) => ({
  genomeId: getCurrentSpeciesGenomeId(state),
  assemblies: getCurrentSpeciesAssemblies(state)
});

const mapDispatchToProps = {
  onSelect: changeAssembly
};

export default connect(mapStateToProps, mapDispatchToProps)(AssemblySelector);
