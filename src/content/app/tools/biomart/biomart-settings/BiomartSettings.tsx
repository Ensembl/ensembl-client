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

// import AddButton from 'src/shared/components/add-button/AddButton';
import styles from './BiomartSettings.module.css';
// import { useNavigate } from 'react-router';
// import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

// import * as urlFor from 'src/shared/helpers/urlHelper';
// import { useAppSelector } from 'src/store';

const BiomartSettings = () => {
  /*const navigate = useNavigate();
    const { trackInterstitialPageNavigation } = useGenomeBrowserAnalytics();
    const selectedSpecies = useAppSelector((state) => state.biomart.general.selectedSpecies);

    const goToSpeciesSelector = () => {
        trackInterstitialPageNavigation();
        const url = urlFor.speciesSelector();
        navigate(url);
    };*/

  return (
    <div className={styles.topLevelContainer}>
      <div className={styles.topLevel}>
        <h1 className={styles.title}>Biomart</h1>
        {/* {
                    !selectedSpecies && <AddButton className={styles.addButton}
                        onClick={goToSpeciesSelector}>
                        Add a species
                    </AddButton>
                } */}
      </div>
    </div>
  );
};

export default BiomartSettings;
