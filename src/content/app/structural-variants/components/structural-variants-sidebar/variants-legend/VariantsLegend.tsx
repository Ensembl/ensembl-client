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

import { Legend, LegendItem, LegendMarker } from 'src/shared/components/legend';

import { ALIGNMENT_COLORS } from '@ensembl/ensembl-structural-variants';

import commonStyles from '../StructuralVariantsSidebar.module.css';
import styles from './VariantsLegend.module.css';

const VariantsLegend = () => {
  return (
    <div className={commonStyles.legendSection}>
      <div className={commonStyles.legendSectionHead}>
        Haplotype variant type
      </div>
      <Legend className={styles.legend}>
        <LegendItem>
          <LegendMarker
            style={{ backgroundColor: ALIGNMENT_COLORS.deletion }}
          />
          <span>Deletion or loss</span>
        </LegendItem>
        <LegendItem>
          <LegendMarker
            style={{ backgroundColor: ALIGNMENT_COLORS.insertion }}
          />
          <span>Gain or insertion</span>
        </LegendItem>
        <LegendItem>
          <LegendMarker className={styles.other} />
          <span>Other</span>
        </LegendItem>
      </Legend>
    </div>
  );
};

export default VariantsLegend;
