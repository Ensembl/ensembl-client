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

import { useState } from 'react';

import TextButton from 'src/shared/components/text-button/TextButton';
import EpigenomeFilters from './epigenome-filters/EpigenomeFilters';
import CombinableMetadataDimensions from './combinable-metadata-dimensions/CombinableMetadataDimensions';
import EpigenomesOrderConfigurator from './epigenomes-order-configurator/EpigenomesOrderConfigurator';

import styles from './ConfigurationsView.module.css';

type Props = {
  genomeId: string | null;
};

type View = 'filters' | 'combine-epigenomes' | 'sort-epigenomes';

const ConfigurationsView = (props: Props) => {
  const [view, setView] = useState<View>('filters');
  const { genomeId } = props;

  if (!genomeId) {
    return null;
  }

  return (
    <div>
      <Navigation activeView={view} onViewChange={setView} />
      <Main activeView={view} genomeId={genomeId} />
    </div>
  );
};

const Navigation = ({
  activeView,
  onViewChange
}: {
  activeView: View;
  onViewChange: (view: View) => void;
}) => {
  return (
    <div className={styles.navigation}>
      <TextButton
        disabled={activeView === 'filters'}
        onClick={() => onViewChange('filters')}
      >
        Filter
      </TextButton>
      <TextButton
        disabled={activeView === 'combine-epigenomes'}
        onClick={() => onViewChange('combine-epigenomes')}
      >
        Combine
      </TextButton>
      <TextButton
        disabled={activeView === 'sort-epigenomes'}
        onClick={() => onViewChange('sort-epigenomes')}
      >
        Sort
      </TextButton>
    </div>
  );
};

const Main = ({
  activeView,
  genomeId
}: {
  activeView: View;
  genomeId: string;
}) => {
  if (activeView === 'filters') {
    return <EpigenomeFilters genomeId={genomeId} />;
  } else if (activeView === 'combine-epigenomes') {
    return <CombinableMetadataDimensions genomeId={genomeId} />;
  } else if (activeView === 'sort-epigenomes') {
    return <EpigenomesOrderConfigurator genomeId={genomeId} />;
  }

  return null;
};

export default ConfigurationsView;
