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

import { useLocation } from 'react-router';

import * as urlHelper from 'src/shared/helpers/urlHelper';

import LaunchbarButton from './LaunchbarButton';
import { SpeciesSelectorIcon } from 'src/shared/components/app-icon';

/**
 * Intended behaviour of SpeciesSelectorLaunchbarButton is
 * - to be marked as active (black) both for the Species Selector page and for the Species page
 *  - i.e. the button pretends that Species Selector and Species page are one and the same 'app'
 *  - (which means that both on Species Selector page and on Species page, clicks on this button don't do anything)
 * - when not active, this button should take the user to the Species Selector page
 */

const SpeciesSelectorLaunchbarButton = () => {
  const location = useLocation();
  const urlPathnameParts = location.pathname.split('/').filter(Boolean);
  const firstPathnamePart = urlPathnameParts[0];

  return (
    <LaunchbarButton
      path={urlHelper.speciesSelector()}
      description="Species selector"
      icon={SpeciesSelectorIcon}
      enabled={true}
      isActive={['species', 'species-selector'].includes(firstPathnamePart)}
    />
  );
};

export default SpeciesSelectorLaunchbarButton;
