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
import type { ReactNode } from 'react';

type Props = {
  common_name: string | null;
  fallback?: ReactNode;
  className?: string;
};

const SpeciesCommonName = (props: Props) => {
  const { common_name, fallback } = props;

  if (!common_name && !fallback) {
    return null;
  }

  const componentClasses = classNames(props.className);

  const content = common_name ?? fallback;

  return <span className={componentClasses}>{content}</span>;
};

export default SpeciesCommonName;
