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

// React Router doesn't handle absolute urls, requiring users
// to write their own components to address this use case.
// We may want to move this component to the shared folder,
// if we discover a need to reuse it.

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

const HelpMenuLink = (props: Props) => {
  const { to, ...otherProps } = props;

  if (to.match(/^https?:\/\//)) {
    // absolute link
    return <a href={to} {...otherProps} />;
  } else {
    return <Link {...props} />;
  }
};

export default HelpMenuLink;
