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

import { useRegionOverviewQuery } from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

import styles from './ActivityViewerSidebar.module.css';

const ActivityViewerSidebar = () => {
  const { currentData } = useRegionOverviewQuery();

  if (!currentData) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Genes genes={currentData.genes} />
      <RegulatoryFeatures features={currentData.regulatory_features} />
    </div>
  );
};

const Genes = (props: { genes: OverviewRegion['genes'] }) => {
  const genes = props.genes.map((gene) => (
    <div key={gene.stable_id}>
      {gene.symbol}
      {'  '}
      {gene.stable_id}
    </div>
  ));

  // TODO: change this into an accordion
  return (
    <div>
      <div style={{ fontWeight: 'bold' }}>Genes</div>
      {genes}
    </div>
  );
};

const RegulatoryFeatures = (props: {
  features: OverviewRegion['regulatory_features'];
}) => {
  const genes = props.features.map((feature) => (
    <div key={feature.id}>
      {feature.feature_type}
      {'  '}
      {feature.id}
    </div>
  ));

  // TODO: change this into an accordion
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ fontWeight: 'bold' }}>Regulatory features</div>
      {genes}
    </div>
  );
};

export default ActivityViewerSidebar;
