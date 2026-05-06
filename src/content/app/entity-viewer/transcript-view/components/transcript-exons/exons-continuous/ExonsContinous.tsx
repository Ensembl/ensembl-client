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
import classNames from 'classnames';

import RadioGroup, {
  type RadioOption,
  type OptionValue
} from 'src/shared/components/radio-group/RadioGroup';

import type {
  EnrichedExon as Exon,
  EnrichedIntron as Intron
} from 'src/content/app/entity-viewer/transcript-view/components/transcript-exons/useExonsData';

import styles from './ExonsContinuous.module.css';

type Props = {
  exons: Exon[];
  introns: Intron[];
  exonsAndIntrons: Array<Exon | Intron>;
};

const ExonsContinuous = (props: Props) => {
  const [view, setView] = useState('unspliced');

  const onViewChange = (view: OptionValue) => {
    setView(view as string);
  };

  return (
    <>
      <div>
        <ViewOptions selectedOption={view} onChange={onViewChange} />
      </div>
      <div>
        <Features {...props} view={view} />
      </div>
    </>
  );
};

const viewOptions: RadioOption[] = [
  { value: 'unspliced', label: 'Unspliced' },
  { value: 'spliced', label: 'Spliced' }
];

const ViewOptions = ({
  selectedOption,
  onChange
}: {
  selectedOption: string;
  onChange: (view: OptionValue) => void;
}) => {
  return (
    <RadioGroup
      options={viewOptions}
      selectedOption={selectedOption}
      onChange={onChange}
      direction="row"
    />
  );
};

const Features = (props: Props & { view: string }) => {
  return (
    <div className={styles.featuresWrapper}>
      <span className={styles.fivePrime}>5'</span>
      {props.view === 'unspliced' &&
        props.exonsAndIntrons.map((feature) => (
          <span key={getFeatureKey(feature)}>
            <FeatureSequence feature={feature} />
          </span>
        ))}
      {props.view === 'spliced' &&
        props.exonsAndIntrons
          .filter((feature) => feature.type === 'exon')
          .map((feature) => (
            <span key={getFeatureKey(feature)}>
              <FeatureSequence feature={feature} />
            </span>
          ))}
      <span className={styles.threePrime}>3'</span>
    </div>
  );
};

const FeatureSequence = ({ feature }: { feature: Exon | Intron }) => {
  if (feature.type === 'exon') {
    return <span className={styles.sequence}>{feature.sequence}</span>;
  } else {
    return (
      <span className={classNames(styles.sequence, styles.intronicSequence)}>
        {feature.sequence}
      </span>
    );
  }
};

const getFeatureKey = (feature: Exon | Intron) => {
  if (feature.type === 'exon') {
    return feature.stable_id;
  } else {
    return feature.index;
  }
};

export default ExonsContinuous;
