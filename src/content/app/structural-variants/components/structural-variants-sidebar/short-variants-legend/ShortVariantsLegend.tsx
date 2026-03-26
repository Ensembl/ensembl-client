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

import commonStyles from '../StructuralVariantsSidebar.module.css';
import shortVariantsStyles from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-group-legend/VariantGroupLegend.module.css';
import styles from './ShortVariantsLegend.module.css';

const ShortVariantsLegend = () => {
  return (
    <div className={commonStyles.legendSection}>
      <div className={commonStyles.legendSectionHead}>Short variant groups</div>
      <Legend className={styles.legend}>
        <LegendItem>
          <LegendMarker className={shortVariantsStyles.variantColour1} />
          <span>Protein altering variants</span>
        </LegendItem>
        <LegendItem>
          <LegendMarker className={shortVariantsStyles.variantColour2} />
          <span>Splicing variants</span>
        </LegendItem>
        <LegendItem>
          <LegendMarker className={shortVariantsStyles.variantColour3} />
          <span>Transcript variants</span>
        </LegendItem>
        <LegendItem>
          <LegendMarker className={shortVariantsStyles.variantColour3} />
          <span>Regulatory region variants</span>
        </LegendItem>
        <LegendItem>
          <LegendMarker className={shortVariantsStyles.variantColour3} />
          <span>Intergenic variants</span>
        </LegendItem>
      </Legend>
    </div>
  );
};

export default ShortVariantsLegend;
