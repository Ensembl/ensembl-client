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

// import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';

/**
 * This component looks similar to the 'actions' selector at the top of some of the tables.
 *
 * NOTE:
 * The panel with options displayed at the bottom of the select element
 * should probably be implemented as a `dialog` (better for focus management,
 * enables focus trapping); but then, it would probably require
 * css anchor positioning, which is not yet supported by all browsers.
 * Such a panel will be a good candidate to be extracted into a dedicated FloatingDialog component.
 */

const ActivityViewerActionSelector = () => {
  // const { epigenomeMetadataDimensionsResponse } = useEpigenomes();

  const options = [
    {
      label: 'One',
      value: 'one'
    },
    {
      label: 'Two',
      value: 'two'
    }
  ];

  return <SimpleSelect options={options} />;
};

export default ActivityViewerActionSelector;
