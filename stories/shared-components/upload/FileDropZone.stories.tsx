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

import { action } from '@storybook/addon-actions';

import useDisabledDocumentDragover from 'src/root/useDisabledDocumentDragover';

import FiledropZone from 'src/shared/components/upload/FileDropZone';

import styles from './FileDropZone.stories.module.css';

type DefaultArgs = {
  onChange: (...args: any) => void;
};

const FileDropZoneContainer = (props: DefaultArgs) => {
  useDisabledDocumentDragover();

  return (
    <div className={styles.container}>
      <FiledropZone onUpload={props.onChange}>
        Click me or drop a file on me
      </FiledropZone>
    </div>
  );
};

export const FileDropZoneStory = {
  name: 'default',
  render: (args: DefaultArgs) => <FileDropZoneContainer {...args} />,
  args: {
    onChange: action('uploaded')
  }
};

export default {
  title: 'Components/Shared Components/FileDropZone'
};
