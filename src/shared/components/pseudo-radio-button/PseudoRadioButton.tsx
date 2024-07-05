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

import classNames from 'classnames';

import radioStyles from 'src/shared/components/radio-group/RadioGroup.module.css';
import styles from './PseudoRadioButton.module.css';

type Props = {
  label: string;
  disabled?: boolean;
};

/**
 * This component looks like a radio button; but is purely decorative.
 * Its purpose is to show to user what the UI will look like when the radio buttons
 * will actually do something useful.
 */
const PseudoRadioButton = (props: Props) => {
  const componentClasses = classNames(
    radioStyles.radioGroupItem,
    styles.pseudoRadioButton,
    {
      [styles.pseudoRadioDisabled]: props.disabled
    }
  );
  const radioClasses = classNames(radioStyles.radio, {
    [radioStyles.radioChecked]: !props.disabled
  });

  return (
    <div className={componentClasses}>
      <span className={classNames(radioClasses)} />
      <span className={radioStyles.label}>{props.label}</span>
    </div>
  );
};

export default PseudoRadioButton;
