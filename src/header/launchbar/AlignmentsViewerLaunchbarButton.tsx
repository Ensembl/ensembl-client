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

import * as urlFor from 'src/shared/helpers/urlHelper';

import { isProductionEnvironment } from 'src/shared/helpers/environment';

import useLastVisitedPath from './useLastVisitedPath';

import LaunchbarButton from './LaunchbarButton';
import AlignmentsViewerIcon from 'src/shared/components/app-icon/AlignmentsViewerIcon';

/**
 * There is uncertainty regarding whether the "app" that this button opens
 * is a generic alignments viewer, or something dealing specifically
 * with structural variants.
 */

const rootPath = urlFor.structuralVariantsViewer();

const RegulatoryActivityViewerLaunchbarButton = () => {
  const lastVisitedPath = useLastVisitedPath({ rootPath });

  if (isProductionEnvironment()) {
    return null;
  }

  return (
    <LaunchbarButton
      path={lastVisitedPath}
      description="Alignments viewer"
      icon={AlignmentsViewerIcon}
      enabled={true}
    />
  );
};

export default RegulatoryActivityViewerLaunchbarButton;
