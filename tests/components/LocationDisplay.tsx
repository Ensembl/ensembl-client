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
import { useLocation } from 'react-router-dom';

export const LOCATION_DISPLAY_TEST_ID = 'location-display';

/**
 * The purpose of this test component is to assist with the testing of route changes
 * when using React Router.
 *
 * It renders the pathname of the route.
 */

const LocationDisplay = () => {
  const location = useLocation();

  return <div data-test-id={LOCATION_DISPLAY_TEST_ID}>{location.pathname}</div>;
};

export default LocationDisplay;
