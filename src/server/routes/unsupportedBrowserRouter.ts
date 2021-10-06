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
import { Request, Response } from 'express';

const pathToHtml = path.resolve(__dirname, 'views/unsupported-browser.html'); // <-- notice that this will be the path in the dist directory

const unsupportedBrowserRouter = (_: Request, res: Response) => {
  res.sendFile(pathToHtml);
};

export default unsupportedBrowserRouter;
