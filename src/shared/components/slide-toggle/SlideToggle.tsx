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

import { useState, useEffect } from 'react';
import classNames from 'classnames';

import styles from './SlideToggle.module.css';

type Props = {
  isOn: boolean;
  className?: string;
  onChange: (isOn: boolean) => void;
  disabled?: boolean;
};

const SlideToggle = (props: Props) => {
  const [isOn, setIsOn] = useState(props.isOn);

  useEffect(() => {
    if (isOn !== props.isOn) {
      setIsOn(props.isOn);
    }
  }, [props.isOn]);

  const onToggle = () => {
    props.onChange(!isOn);
    setIsOn(!isOn);
  };

  const className = classNames(styles.slideToggle, props.className, {
    [styles.slideToggleOn]: isOn,
    [styles.slideToggleOff]: !isOn,
    [styles.disabled]: props.disabled
  });

  return (
    <button onClick={onToggle} disabled={props.disabled}>
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 19 10"
      >
        <path
          className={styles.slideToggleTrack}
          d="M14.5,14.5h-9A4.48,4.48,0,0,1,1,10H1A4.48,4.48,0,0,1,5.5,5.5h9A4.48,4.48,0,0,1,19,10h0A4.48,4.48,0,0,1,14.5,14.5Z"
          transform="translate(-0.5 -5)"
        />
        <circle className={styles.slideToggleThumb} cx="5" cy="5" r="4" />
      </svg>
    </button>
  );
};

export default SlideToggle;
