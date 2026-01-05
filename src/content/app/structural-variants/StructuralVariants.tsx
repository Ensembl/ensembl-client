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

import useStructuralVariantsRouting from 'src/content/app/structural-variants/hooks/useStructuralVariantsRouting';

import { useAppSelector } from 'src/store';

import { getBreakpointWidth } from 'src/global/globalSelectors';

import StructuralVariantsAppBar from './components/structural-variants-app-bar/StructuralVariantsAppBar';
import StructuralVariantsTopBar from './components/structural-variants-top-bar/StructuralVariantsTopBar';
import StructuralVariantsMain from './components/structural-variants-main/StructuralVariantsMain';
import { StandardAppLayout } from 'src/shared/components/layout';

import styles from './StructuralVariants.module.css';

const StructuralVariants = () => {
  const {
    isValidating,
    areUrlParamsValid,
    referenceGenomeIdParam,
    referenceLocationParam,
    altGenomeIdParam
  } = useStructuralVariantsRouting();

  const viewportWidth = useAppSelector(getBreakpointWidth);

  let view = 'standard';

  if (!referenceGenomeIdParam || !altGenomeIdParam || !referenceLocationParam) {
    view = 'interstitial';
  }

  if (view === 'interstitial') {
    return (
      <div className={styles.containerInterstitial}>
        <StructuralVariantsAppBar />
        <StructuralVariantsTopBar standalone={true} />
        <div>Please make a selection</div>
      </div>
    );
  } else if (!isValidating && !areUrlParamsValid) {
    return (
      <div className={styles.containerInterstitial}>
        <StructuralVariantsAppBar />
        <StructuralVariantsTopBar standalone={true} />
        <div>The url parameters are invalid</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StructuralVariantsAppBar />
      <StandardAppLayout
        mainContent={<StructuralVariantsMain />}
        sidebarContent={<div>Sidebar content</div>}
        topbarContent={<StructuralVariantsTopBar standalone={false} />}
        isSidebarOpen={true}
        onSidebarToggle={() => {
          return true;
        }}
        sidebarNavigation={null}
        viewportWidth={viewportWidth}
      />
    </div>
  );
};

export default StructuralVariants;
