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

import path from 'path';
import { createHash } from 'node:crypto';

/**
 * The function below is intended to be used with css-loader
 * to generate class name strings for CSS modules according to the following pattern:
 *
 * <class_name>__<file_name>__<five_digits_of_hash>
 *
 * The reason for writing this function was because css-loader includes the word "module"
 * in the file name, e.g. class foo in a file Foo.module.css will become .foo__Foo-module__blah1,
 * although this is just useless noise.
 *
 * The function below follows roughly the same steps as css-loader
 * (although with a different hashing algorithm)
 *
 */
export const buildClassName = (
  context: { resourcePath: string },
  _: string, // template to use for generating CSS classes; we ignore it
  cssClassName: string,
  options: { context: string } // the context string is the absolute path to processed file
) => {
  const moduleName = path.basename(context.resourcePath).split('.')[0]; // this will throw away `.module.css`
  const relativeResourcePath = path.relative(
    options.context,
    context.resourcePath
  );
  const hash = createHash('sha1');
  hash.update(relativeResourcePath);
  const hashDigest = hash.digest('base64').slice(0, 5);
  return `${cssClassName}__${moduleName}__${hashDigest}`;
};
