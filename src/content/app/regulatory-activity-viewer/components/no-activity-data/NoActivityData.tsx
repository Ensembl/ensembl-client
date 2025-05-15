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

import ActivityViewerAppBar from '../activity-viewer-app-bar/ActivityViewerAppBar';
import { CircleLoader } from 'src/shared/components/loader';

import interstitialStyles from '../activity-viewer-interstitial/ActivityViewerInterstitial.module.css';

const NoActivityData = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <>
      <ActivityViewerAppBar />
      <div>
        <div className={interstitialStyles.topPanel} />
        <div className={interstitialStyles.main}>
          {isLoading ? (
            <CircleLoader />
          ) : (
            <div>This assembly does not have regulatory activity data</div>
          )}
        </div>
      </div>
    </>
  );
};

export default NoActivityData;
