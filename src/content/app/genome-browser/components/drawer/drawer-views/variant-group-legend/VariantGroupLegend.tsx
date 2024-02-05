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
import classNames from 'classnames';

import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
import variantGroups from 'src/content/app/genome-browser/constants/variantGroups';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import { Table, ColumnHead } from 'src/shared/components/table';

import type { VariantLegendView } from 'src/content/app/genome-browser/state/drawer/types';

import styles from './VariantGroupLegend.module.css';

type Props = {
  drawerView: VariantLegendView;
};

const VariantGroupLegend = (props: Props) => {
  const currentVariantGroup = variantGroups.find(
    ({ label }) => label === props.drawerView.group
  );

  const groupColorMarkerClass = classNames(
    styles.colourMarker,
    styles[`variantColour${currentVariantGroup?.id}`]
  );

  if (!currentVariantGroup) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div>
        <span className={groupColorMarkerClass} />
        <span className={styles.labelTextStrong}>
          {` ${pluralise(
            currentVariantGroup.label,
            currentVariantGroup.variant_types.length
          )}`}
        </span>
      </div>

      <div className={styles.legendTable}>
        <Table stickyHeader={true}>
          <thead className={styles.tableHead}>
            <tr>
              <ColumnHead>SO term</ColumnHead>
              <ColumnHead>SO accession</ColumnHead>
            </tr>
          </thead>
          <tbody>
            {currentVariantGroup.variant_types.map((variantType) => (
              <tr key={variantType.label} className={styles.variantTypeRow}>
                <td className={styles.variantTypeLabel}>{variantType.label}</td>
                <td className={styles.value}>
                  {variantType.url ? (
                    <ExternalLink to={variantType.url}>
                      {variantType.so_accession_id}
                    </ExternalLink>
                  ) : (
                    <span>{variantType.so_accession_id}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default VariantGroupLegend;
