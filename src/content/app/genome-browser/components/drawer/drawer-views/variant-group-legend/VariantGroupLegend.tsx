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

import variantGroups from './variantGroups';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import { Table } from 'src/shared/components/table';

import type { VariantLegendView } from 'src/content/app/genome-browser/state/drawer/types';

import styles from './VariantGroupLegend.scss';
import classNames from 'classnames';

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
          {currentVariantGroup.label}
        </span>
      </div>

      <div className={styles.legendTable}>
        <Table stickyHeader={true}>
          <thead className={styles.tableHead}>
            <tr>
              <th>SO term</th>
              <th>SO accession</th>
            </tr>
          </thead>
          <tbody>
            {currentVariantGroup.variant_types.map((variantType) => (
              <tr key={variantType.label} className={styles.variantTypeRow}>
                <td className={styles.variantTypeLabel}>{variantType.label}</td>
                <td className={styles.value}>
                  {variantType.url ? (
                    <ExternalLink
                      to={variantType.url}
                      linkText={variantType.so_accession_id}
                    />
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