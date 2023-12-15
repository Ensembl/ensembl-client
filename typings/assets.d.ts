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

declare module '*.png' {
  const png: string;
  export = png;
}

declare module '*.ico' {
  const ico: string;
  export = ico;
}

declare module '*.jpg' {
  const jpg: string;
  export = jpg;
}

declare module '*.svg' {
  import React = require('react');
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.svg?url' {
  const src: string;
  export default src;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.module.css' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.md' {
  const content: string;
  export = content;
}
