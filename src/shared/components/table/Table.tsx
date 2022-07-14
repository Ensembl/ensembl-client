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

/*

    -- State management -- 
    - How can we restore the previous state everytime we come back?
        We need to store the state independently for all the tables. It can be optional.
        To identify a table, the parent component should be able to provide an UUID for each table so that 
        it can be used to restore the state.

    - Should there be an option to hide the first action column by default?
*/
