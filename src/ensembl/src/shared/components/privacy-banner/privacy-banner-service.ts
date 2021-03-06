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

import privacyConfig from './privacyConfig';
import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';

export class PrivacyBannerService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getPolicyVersion(): string {
    return this.storageService.get(privacyConfig.name);
  }

  public setPolicyVersion() {
    this.storageService.save(privacyConfig.name, privacyConfig.version);
  }

  public shouldShowBanner(): boolean {
    return this.getPolicyVersion() !== privacyConfig.version;
  }
}

export default new PrivacyBannerService(storageService);
