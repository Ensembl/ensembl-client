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

import { useLocation, Location, useNavigationType } from 'react-router-dom';

/**
 * A utility component that passes the current location received from react-router
 * to the parent via a callback. The location can then be inspected in a test.
 */

const RouteChecker = ({
  setLocation,
  setNavigationType
}: {
  setLocation: (location: Location) => void;
  setNavigationType?: (navigationType: string) => void;
}) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  setLocation(location);
  setNavigationType?.(navigationType);

  return null;
};

export default RouteChecker;
