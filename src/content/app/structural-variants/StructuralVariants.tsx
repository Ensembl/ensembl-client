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

import { useMemo } from 'react';

import { useAppSelector } from 'src/store';

import useStructuralVariantsRouting from 'src/content/app/structural-variants/hooks/useStructuralVariantsRouting';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import {
  getReferenceGenome,
  getAlternativeGenome,
  getReferenceGenomeLocation
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

import StructuralVariantsAppBar from './components/structural-variants-app-bar/StructuralVariantsAppBar';
import StructuralVariantsTopBar from './components/structural-variants-top-bar/StructuralVariantsTopBar';
import StructuralVariantsMain from './components/structural-variants-main/StructuralVariantsMain';
import StructuralVariantsSidebar from './components/structural-variants-sidebar/StructuralVariantsSidebar';
import StructuralVariantsInterstitial from './components/structural-variants-interstitial/StructuralVariantsInterstitial';
import SidebarNavigation from './components/structural-variants-sidebar/sidebar-navigation/SidebarNavigation';
import StructuralVariantsSidebarToolstrip from 'src/content/app/structural-variants/components/structural-variants-sidebar/structural-variants-sidebar-toolstrip/StructuralVariantsSidebarToolstrip';
import { StandardAppLayout } from 'src/shared/components/layout';

import styles from './StructuralVariants.module.css';

const StructuralVariants = () => {
  const {
    isValidating,
    referenceGenomeIdParam,
    referenceLocationParam,
    altGenomeIdParam,
    altLocationParam,
    referenceGenome,
    altGenome,
    referenceGenomeLocation,
    isReferenceGenomeIdValid,
    isAltGenomeIdValid,
    isReferenceGenomeLocationValid,
    isAltGenomeLocationValid,
    isMissingAltGenomeRegion
  } = useStructuralVariantsRouting();
  const referenceGenomeFromRedux = useAppSelector(getReferenceGenome);
  const referenceGenomeLocationFromRedux = useAppSelector(
    getReferenceGenomeLocation
  );
  const altGenomeFromRedux = useAppSelector(getAlternativeGenome);

  // To avoid showing the main screen while there isn't sufficient data to render it.
  const isInitialValidation =
    isValidating &&
    (!referenceGenomeFromRedux ||
      !altGenomeFromRedux ||
      !referenceGenomeLocationFromRedux);

  if (
    isInitialValidation ||
    !referenceGenomeIdParam ||
    !referenceLocationParam ||
    !altGenomeIdParam ||
    !isReferenceGenomeIdValid ||
    !isAltGenomeIdValid ||
    !isReferenceGenomeLocationValid ||
    !isAltGenomeLocationValid
  ) {
    return (
      <div className={styles.containerInterstitial}>
        <StructuralVariantsAppBar />
        <StructuralVariantsTopBar standalone={true} />
        <StructuralVariantsInterstitial
          isValidating={isValidating}
          referenceGenome={referenceGenome}
          altGenome={altGenome}
          referenceGenomeIdParam={referenceGenomeIdParam}
          referenceLocationParam={referenceLocationParam}
          altGenomeIdParam={altGenomeIdParam}
          altLocationParam={altLocationParam}
          referenceGenomeLocation={referenceGenomeLocation}
          isReferenceGenomeIdValid={isReferenceGenomeIdValid}
          isReferenceGenomeLocationValid={isReferenceGenomeLocationValid}
          isAltGenomeIdValid={isAltGenomeIdValid}
          isAltGenomeLocationValid={isAltGenomeLocationValid}
          isMissingAltGenomeRegion={isMissingAltGenomeRegion}
        />
      </div>
    );
  }

  return <MainView />;
};

const MainView = () => {
  const viewportWidth = useAppSelector(getBreakpointWidth);
  const mainContent = useMemo(() => {
    return <StructuralVariantsMain />;
  }, []);
  const sidebarContent = useMemo(() => {
    return <StructuralVariantsSidebar />;
  }, []);
  const sidebarToolstripContent = useMemo(() => {
    return <StructuralVariantsSidebarToolstrip />;
  }, []);
  const topbarContent = useMemo(() => {
    return <StructuralVariantsTopBar standalone={false} />;
  }, []);
  const sidebarNavigation = useMemo(() => {
    return <SidebarNavigation />;
  }, []);

  return (
    <div className={styles.container}>
      <StructuralVariantsAppBar />
      <StandardAppLayout
        mainContent={mainContent}
        sidebarContent={sidebarContent}
        sidebarToolstripContent={sidebarToolstripContent}
        sidebarNavigation={sidebarNavigation}
        topbarContent={topbarContent}
        isSidebarOpen={true}
        onSidebarToggle={() => {
          return true;
        }}
        viewportWidth={viewportWidth}
      />
    </div>
  );
};

export default StructuralVariants;
