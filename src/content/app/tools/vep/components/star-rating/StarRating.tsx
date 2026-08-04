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

/**
 * A rating as a row of filled and empty stars.
 *
 * The whole row is one image with one label rather than `outOf` separately
 * announced stars: "2 out of 4" is the fact, and a screen reader reading
 * "star star star star" is not it. The stars scale with the surrounding text,
 * so the same component suits a results row and the smaller expanded detail
 * beneath it.
 *
 * Which term earns which rating is the backend's to say (see the spec's
 * `rating_scales`); this only draws the number it is given.
 */
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
