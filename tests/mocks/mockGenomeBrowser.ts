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

class MockGenomeBrowser {
  private subscriptions = new Map<string, Set<any>>();

  public send() {
    return vi.fn();
  }

  public subscribe = (actionType: string, callback: any) => {
    const subscriptionsToAction = this.subscriptions.get(actionType);
    if (subscriptionsToAction) {
      subscriptionsToAction.add(callback);
    } else {
      this.subscriptions.set(actionType, new Set([callback]));
    }
  };

  public simulateBrowserMessage(message: { type: string; payload: any }) {
    const subscriptionsToAction = this.subscriptions.get(message.type);

    if (subscriptionsToAction) {
      [...subscriptionsToAction.values()].forEach((subscription) => {
        subscription(message);
      });
    }
  }

  public clear() {
    this.subscriptions.clear();
  }
}

export default MockGenomeBrowser;
