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

/**
 * Whether a sub-option ran for a submission. Sub-option defaults aren't written
 * into the submitted parameters unless the user toggles them, so an absent value
 * means "left at its default": a default-on sub-option (e.g. ProtVar's) counts
 * as run, a default-off one (e.g. mutfunc's) does not. An explicit boolean in
 * the parameters overrides the default.
 */
export const subOptionRan = (
  parameters: Record<string, unknown> | undefined,
  optionId: string,
  defaultValue: boolean
): boolean => {
  const value = parameters?.[optionId];
  return value === undefined ? defaultValue : Boolean(value);
};
