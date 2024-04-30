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

import { MemoryRouter } from 'react-router';

import ButtonLink from 'src/shared/components/button-link/ButtonLink';

import styles from './ButtonLink.stories.module.css';

export default {
  title: 'Components/Shared Components/ButtonLink'
};

export const ButtonLinkStory = () => (
  <MemoryRouter initialEntries={['/foo']}>
    <div className={styles.wrapper}>
      <ButtonLink to="/foo">I am a link</ButtonLink>
      <ButtonLink to="/">I am a link</ButtonLink>
      <ButtonLink to="/bar" isDisabled={true}>
        I am disabled
      </ButtonLink>
    </div>
  </MemoryRouter>
);

ButtonLinkStory.storyName = 'default';
