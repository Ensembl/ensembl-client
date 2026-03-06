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

import { standardTaxonRanks, findNodesByRank } from './taxonSelectorUtils';

// TODO: move the type to the correct place
import { type TaxonNode } from 'stories/species-selector-new/taxon-selector/data';

import styles from './TaxonSelector.module.css';

type Props = {
  taxons: TaxonNode[];
  onTaxonClick: (taxonId: number) => void;
};

const TaxonSelector = (props: Props) => {
  const taxonGroups = standardTaxonRanks.map((rank) =>
    findNodesByRank({
      nodes: props.taxons,
      rank
    })
  );

  const onClick = (taxonId: number) => {
    props.onTaxonClick(taxonId);
  };

  return (
    <div className={styles.container}>
      {standardTaxonRanks.map((rank, index) => (
        <div key={rank} className={styles.column}>
          <div>{rank}</div>
          <div className={styles.taxons}>
            {taxonGroups[index].map((taxon) => (
              <Taxon key={taxon.taxon_id} taxon={taxon} onClick={onClick} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const Taxon = ({
  taxon,
  onClick
}: {
  taxon: TaxonNode;
  onClick: (taxonId: number) => void;
}) => {
  return (
    <button
      key={taxon.taxon_id}
      onClick={() => onClick(taxon.taxon_id)}
      className={styles.taxon}
    >
      {taxon.name}
    </button>
  );
};

export default TaxonSelector;
