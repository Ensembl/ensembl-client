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

import {
  useState,
  useCallback,
  type DetailedHTMLProps,
  type ButtonHTMLAttributes
} from 'react';
import classNames from 'classnames';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

import SpeciesName from 'src/shared/components/species-name/SpeciesName';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { Release } from 'src/shared/types/release';

import styles from './SpeciesLozenge.module.css';

type SpeciesLozengeTheme = 'blue' | 'black' | 'grey' | 'red';

export type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  species: CommittedItem;
  theme: SpeciesLozengeTheme;
  withReleaseInfo?: boolean;
  onRemove?: () => void;
};

const SpeciesLozenge = (props: Props) => {
  const {
    species,
    theme,
    withReleaseInfo = false,
    onRemove,
    className: classNameFromProps,
    ...otherProps
  } = props;

  const componentClasses = classNames(
    styles.species,
    styles[`theme${upperFirst(camelCase(theme))}`],
    classNameFromProps
  );

  return (
    <div className={componentClasses}>
      <button className={styles.speciesButton} {...otherProps}>
        <div className={styles.inner}>
          <SpeciesName species={species} />
        </div>
        {withReleaseInfo && <ReleasePill release={species.release} />}
      </button>
      {onRemove && <RemoveButton onRemove={onRemove} />}
    </div>
  );
};

const RemoveButton = ({ onRemove }: { onRemove: Props['onRemove'] }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(
    null
  );

  const buttonRef = useCallback((element: HTMLButtonElement) => {
    setButtonElement(element);
    return () => setButtonElement(null);
  }, []);

  return (
    <>
      <CloseButton
        ref={buttonRef}
        className={styles.deleteButton}
        onClick={onRemove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label={`Remove this genome from selected genomes`}
      />
      {isHovering && (
        <Tooltip anchor={buttonElement} autoAdjust={true}>
          Delete this genome
        </Tooltip>
      )}
    </>
  );
};

const ReleasePill = ({ release }: { release: Release }) => {
  return <div className={styles.releasePill}>{release.name}</div>;
};

export default SpeciesLozenge;
