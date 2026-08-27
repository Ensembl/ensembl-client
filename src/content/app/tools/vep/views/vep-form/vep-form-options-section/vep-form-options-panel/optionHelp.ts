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

import type {
  FormPanelOption,
  OptionHelp
} from 'src/content/app/tools/vep/types/vepFormConfig';

const VERSION_PLACEHOLDER = /\s?\{version\}/g;
const VERSION_IN_LABEL = /\bv\d+(?:\.\d+)*/;

const resolveVersionedHelp = (
  help: OptionHelp,
  option: FormPanelOption
): OptionHelp => {
  const version = option.label.match(VERSION_IN_LABEL)?.[0];
  // 'v4.1' -> '4'. Matching on the major alone means a point release does not
  // silently drop a link that still describes the right callset.
  const majorVersion = version?.slice(1).split('.')[0];

  // No version in the label leaves the sentence reading cleanly rather than
  // with a gap or a stray space before the full stop.
  const description = help.description.includes('{version}')
    ? help.description.replace(
        VERSION_PLACEHOLDER,
        version ? ` ${version}` : ''
      )
    : help.description;

  // A version-specific link is dropped rather than guessed at when the label
  // carries no version: citing the wrong release is worse than citing none.
  const links = help.links?.filter(
    (link) => !link.majorVersion || link.majorVersion === majorVersion
  );

  return { ...help, description, links };
};

/**
 * Resolve the help text for an option.
 *
 * The text comes from the API, which serves it from the annotation spec. What
 * is resolved here is what only the rendered option can answer: `{version}` and
 * a link's `majorVersion` are matched against the label this genome shows, so
 * one authored sentence serves an option offered at different versions per
 * assembly.
 */
export const getOptionHelp = (
  option: FormPanelOption
): OptionHelp | undefined =>
  option.help && resolveVersionedHelp(option.help, option);
