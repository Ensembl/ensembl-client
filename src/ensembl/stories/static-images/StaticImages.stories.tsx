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

import storyStyles from '../common.scss';
import ImageHolder from './ImageHolder';

function importAllImages(fileType: string) {
  let allImages: any = [];

  if (fileType === 'svg') {
    allImages = require.context('static/img', true, /\.(svg)$/);
  } else if (fileType === 'png') {
    allImages = require.context('static/img', true, /\.(png)$/);
  } else if (fileType === 'jpeg') {
    allImages = require.context('static/img', true, /\.(jpe?g)$/);
  }

  const imagePaths = allImages.keys();

  const imageComponents = imagePaths.map(allImages);

  const images: any = [];

  imagePaths.forEach(({}: string, key: number) => {
    const filePath =
      'static/img' + imagePaths[key].substring(1, imagePaths[key].length);
    images.push([filePath, imageComponents[key]]);
  });

  return images;
}

export const SvgImages = () => (
  <div className={storyStyles.page}>
    {importAllImages('svg').map((image: any, key: number) => {
      return (
        <ImageHolder key={key} image={image[1].default} filePath={image[0]} />
      );
    })}
  </div>
);

SvgImages.storyName = 'SVGs';

export const PngImages = () => (
  <div className={storyStyles.page}>
    {importAllImages('png').map((image: any, key: number) => {
      return <ImageHolder key={key} image={image[1]} filePath={image[0]} />;
    })}
  </div>
);

PngImages.storyName = 'PNGs';

export const JpegImages = () => (
  <div className={storyStyles.page}>
    {importAllImages('jpeg').map((image: any, key: number) => {
      return <ImageHolder key={key} image={image[1]} filePath={image[0]} />;
    })}
  </div>
);

JpegImages.storyName = 'JPEGs';

export default {
  title: 'Other/Static Images'
};
