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

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LaunchbarButtonWithNotification from './LaunchbarButtonWithNotification';
import BiomartIcon from 'src/shared/components/app-icon/BiomartIcon';

const BIOMART_APP_ROOT_PATH = '/biomart';

const BiomartLaunchbarButton = () => {
  const location = useLocation();
  const [biomartAppPath, setBiomartAppPath] = useState(BIOMART_APP_ROOT_PATH);

  useEffect(() => {
    if (location.pathname.startsWith(BIOMART_APP_ROOT_PATH)) {
      setBiomartAppPath(location.pathname);
    }
  }, [[location.pathname]]);

  return (
    <LaunchbarButtonWithNotification
      path={biomartAppPath}
      description="BIOMART"
      icon={BiomartIcon}
      notification={null}
    />
  );
};

export default BiomartLaunchbarButton;
