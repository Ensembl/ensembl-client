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

import type { ReactNode, HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLSpanElement> & {
  text: string | string[];
};

const TextLine = (props: Props) => {
  const { text, className, ...otherProps } = props;
  let textElement: ReactNode;
  if (Array.isArray(text)) {
    textElement = text.map((fragment, index) => (
      <span key={index}>{fragment}</span>
    ));
  } else {
    textElement = text;
  }

  return (
    <span className={className} {...otherProps}>
      {textElement}
    </span>
  );
};

export default TextLine;
