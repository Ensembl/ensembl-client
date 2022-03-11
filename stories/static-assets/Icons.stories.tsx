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

import IconCard from './IconCard';

import storyStyles from '../common.scss';

function importAllIcons() {
  const iconsContextModule: any = require.context(
    'static/icons?url',
    true,
    /\.(svg)$/
  );
  const iconFileNames: string[] = iconsContextModule.keys();
  const iconPaths = iconFileNames.map(iconsContextModule) as string[]; //svg modules are imported as file paths

  return iconPaths.map((iconPath, index) => {
    const fileName = iconFileNames[index].split('/').pop() as string;
    return {
      iconPath,
      fileName
    };
  });
}

export const Icons = () => (
  <div className={storyStyles.page}>
    {importAllIcons().map(({ iconPath, fileName }) => {
      return (
        <IconCard key={iconPath} iconPath={iconPath} fileName={fileName} />
      );
    })}
  </div>
);

Icons.storyName = 'Icons';

export default {
  title: 'Other/Static assets'
};
