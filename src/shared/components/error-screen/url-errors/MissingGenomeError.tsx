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
import { useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppDispatch, useAppSelector } from 'src/store';

import { deleteSpeciesAndSave } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import AlertButton from 'src/shared/components/alert-button/AlertButton';
import { PrimaryButton } from 'src/shared/components/button/Button';
import ButtonLink from 'src/shared/components/button-link/ButtonLink';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './UrlError.scss';

/**
 * Consider possible scenarios why a genome may be "missing":
 * - the genome existed, but has now been retired
 * - the genome never existed; the user entered a url with an invalid genome id
 */

type Props = {
  genomeId: string;
};

const MissingGenomeError = (props: Props) => {
  const { genomeId } = props;

  const allCommittedSpecies = useAppSelector(getCommittedSpecies);

  // TODO: In the future, we should be able to find all committed species with invalid genome ids,
  // not just the one matching this page; but it isn't yet clear how we are going to do it.
  const committedSpeciesWithInvalidGenomeId = allCommittedSpecies.find(
    (species) =>
      species.genome_id === genomeId || species.genome_tag === genomeId
  );

  return committedSpeciesWithInvalidGenomeId ? (
    <InvalidSpeciesError species={committedSpeciesWithInvalidGenomeId} />
  ) : (
    <GenomeNotFoundError genomeId={genomeId} />
  );
};

type InvalidSpeciesErrorProps = {
  species: CommittedItem;
};

const InvalidSpeciesError = (props: InvalidSpeciesErrorProps) => {
  const { species } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onContinue = () => {
    const speciesSelectorUrl = urlFor.speciesSelector();
    dispatch(deleteSpeciesAndSave(species.genome_id));
    navigate(speciesSelectorUrl);
  };

  return (
    <div>
      <div className={styles.topBar} />
      <main className={styles.main}>
        <AlertButton className={styles.alertButton} />
        <div className={styles.errorMessage}>
          This species is no longer available
        </div>
        <div className={styles.suggestion}>
          Any invalid genomes and their site configurations will be removed
        </div>
        <div className={styles.continueButtonWrapper}>
          <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
        </div>
      </main>
    </div>
  );
};

type GenomeNotFoundErrorProps = {
  genomeId: string;
};

const GenomeNotFoundError = (props: GenomeNotFoundErrorProps) => {
  const { genomeId } = props;

  const speciesSelectorUrl = urlFor.speciesSelector();

  return (
    <div>
      <div className={styles.topBar} />
      <main className={styles.main}>
        <AlertButton className={styles.alertButton} />
        <div className={styles.errorMessage}>
          We do not recognise the species identified as "{genomeId}"
        </div>
        <div className={styles.suggestion}>
          Find available species in the Species selector
        </div>
        <div className={styles.continueButtonWrapper}>
          <ButtonLink className={styles.continueButton} to={speciesSelectorUrl}>
            Continue
          </ButtonLink>
        </div>
      </main>
    </div>
  );
};

export default MissingGenomeError;
