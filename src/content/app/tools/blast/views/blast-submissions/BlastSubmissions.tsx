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

import BlastAppBar from 'src/content/app/tools/blast/components/blast-app-bar/BlastAppBar';
import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import BlastViewsNavigation from 'src/content/app/tools/blast/components/blast-views-navigation/BlastViewsNavigation';

const BlastSubmissions = () => {
  return (
    <div>
      <BlastAppBar view="submissions-list" />
      <ToolsTopBar>
        <BlastViewsNavigation />
      </ToolsTopBar>
      <div>This is Blast results view</div>
    </div>
  );
};

export default BlastSubmissions;