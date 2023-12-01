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

// import exampleContent from './exampleContent';
import headingsAndBodyExample from './example-content/headings-and-body';
import imagesExample from './example-content/images';
import listsExample from './example-content/lists';
import codeExample from './example-content/code-block';

import storyStyles from './TextArticle.stories.scss';
import styles from 'src/shared/components/help-article/HelpArticle.scss';

export const HeadingsAndBodyStory = {
  name: 'Headings and body',
  render: () => (
    <div className={storyStyles.container}>
      <div
        className={styles.textArticle}
        dangerouslySetInnerHTML={{ __html: headingsAndBodyExample }}
      />
    </div>
  )
};

export const ImagesStory = {
  name: 'Images',
  render: () => (
    <div className={storyStyles.container}>
      <div
        className={styles.textArticle}
        dangerouslySetInnerHTML={{ __html: imagesExample }}
      />
    </div>
  )
};

export const ListsStory = {
  name: 'Lists',
  render: () => (
    <div className={storyStyles.container}>
      <div
        className={styles.textArticle}
        dangerouslySetInnerHTML={{ __html: listsExample }}
      />
    </div>
  )
};

export const CodeBlockStory = {
  name: 'Code block',
  render: () => (
    <div className={storyStyles.container}>
      <div
        className={styles.textArticle}
        dangerouslySetInnerHTML={{ __html: codeExample }}
      />
    </div>
  )
};

export default {
  title: 'Components/Help & Docs/TextArticle'
};
