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

import { Step } from 'src/shared/components/step/Step';

import styles from './Step.stories.module.css';

const steps = [
  'Go to BurgerKing',
  'Order a burger of your choice',
  'Eat happily'
];

export const StepStory = () => {
  return (
    <div>
      {steps.map((step, index) => {
        return (
          <div key={index} className={styles.stepWrapper}>
            <Step count={index} label={step} />
          </div>
        );
      })}
    </div>
  );
};

StepStory.storyName = 'default';

export const MultilineStepStory = () => {
  const label = `
    This is going to be a long label that should wrap over several lines.
  `;

  return (
    <div className={styles.multilineStepWrapper}>
      <Step count={1} label={label} />
    </div>
  );
};

MultilineStepStory.storyName = 'multiline';

export const StepWithChildrenStory = () => {
  const label = 'There’s more to see below me';
  const longChildText = `
    Hey, look at me! I have been passed to the Step component,
    and this is where I am getting rendered. Ain't I pretty?
  `;

  const childElement = <div>{longChildText}</div>;

  return (
    <div className={styles.multilineStepWrapper}>
      <Step count={1} label={label}>
        {childElement}
      </Step>
    </div>
  );
};

StepWithChildrenStory.storyName = 'with children';

export default {
  title: 'Components/Shared Components/Step'
};
