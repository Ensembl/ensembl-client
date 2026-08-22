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

import StarIcon from 'static/icons/icon_star.svg';

import styles from './StarRating.module.css';

const StarRating = (props: {
  rating: number;
  outOf: number;
  className?: string;
}) => (
  <span
    className={classNames(styles.rating, props.className)}
    role="img"
    aria-label={`${props.rating} out of ${props.outOf}`}
  >
    {Array.from({ length: props.outOf }, (_, index) => (
      <StarIcon
        key={index}
        className={index < props.rating ? styles.filled : styles.empty}
      />
    ))}
  </span>
);

export default StarRating;
