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

import IconHolder from './IconHolder';

import storyStyles from '../common.scss';

function importAllIcons() {
  const allIcons: any = require.context('static/icons', true, /\.(svg)$/);
  const iconPaths = allIcons.keys();
  const iconComponents = iconPaths.map(allIcons);
  const icons: any = [];

  iconPaths.forEach(({}: string, key: number) => {
    const filePath =
      'static/icons' + iconPaths[key].substring(1, iconPaths[key].length);
    icons.push([filePath, iconComponents[key]]);
  });

  return icons;
}

export const Icons = () => (
  <div className={storyStyles.page}>
    {importAllIcons().map((icon: any, key: number) => {
      return <IconHolder key={key} icon={icon[1].default} filePath={icon[0]} />;
    })}
  </div>
);

Icons.storyName = 'Icons';

export default {
  title: 'Other/Static Icons'
};
