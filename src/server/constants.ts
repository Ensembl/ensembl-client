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
 * TODO:
 * - Ideally, these constants should be used by the scripts/start.ts file
 * - It's worth considering whether the start script should be able to assign the port dynamically if the specified port is busy
 *   However, in this case:
 *    - some communication should exist between the start script, the server bootsrtap code, and the config
 */

export const hostname = 'localhost';
export const port = 8080;
export const host = `${hostname}:${port}`;
export const hostWithProtocol = `http://${host}`;
