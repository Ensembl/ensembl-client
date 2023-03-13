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

import initializeGenomeBrowser, {
  GenomeBrowser
} from '@ensembl/ensembl-genome-browser';

import type { GenomeBrowserConfig } from './types/genomeBrowserCongig';
import type { GenomeBrowserMessageMap } from './types/genomeBrowserMessages';

export class GenomeBrowserLoader {
  private static initializationPromise: Promise<void> | null = null;

  private static initializeGenomeBrowser = async (): Promise<void> => {
    return new Promise(async (resolve) => {
      await initializeGenomeBrowser();
      resolve();
    });
  };

  static activateGenomeBrowser = async (config: GenomeBrowserConfig) => {
    if (!this.initializationPromise) {
      this.initializationPromise = this.initializeGenomeBrowser();
    }

    await this.initializationPromise;
    const genomeBrowser = new GenomeBrowser();
    genomeBrowser.go(config); // "go" is an unfortunate name of the genome browser method, which means "start"

    GenomeBrowserService.setGenomeBrowser(genomeBrowser);

    return GenomeBrowserService;
  };
}

export class GenomeBrowserService {
  static genomeBrowser: GenomeBrowser | null = null;

  private static subscriptions = new Map<
    string,
    Set<(action: any) => void> // since it's an internal implementation, we aren't really bothered by the any
  >();

  static getGenomeBrowser(): GenomeBrowser {
    if (!this.genomeBrowser) {
      this.genomeBrowser = new GenomeBrowser();
    }
    return this.genomeBrowser;
  }

  static setGenomeBrowser = (genomeBrowser: GenomeBrowser) => {
    this.genomeBrowser = genomeBrowser;
    genomeBrowser.set_message_reporter(this.handleIncoming);

    // subscribe to messages
  };

  private static handleIncoming = (
    messageType: string,
    messagePayload: any
  ) => {
    const subscriptions = this.subscriptions.get(messageType);
    if (!subscriptions) {
      return;
    }

    subscriptions.forEach((subscription) =>
      subscription({ type: messageType, payload: messagePayload })
    );
  };

  private static getSubscriptionsForEvent = (eventName: string) => {
    let subscriptions = this.subscriptions.get(eventName);
    if (!subscriptions) {
      subscriptions = new Set();
      this.subscriptions.set(eventName, subscriptions);
    }
    return subscriptions;
  };

  static subscribe<K extends string & keyof GenomeBrowserMessageMap>(
    eventName: K,
    subscriber: (payload: {
      type: K;
      payload: GenomeBrowserMessageMap[K];
    }) => void
  ) {
    const subscriptions = this.getSubscriptionsForEvent(eventName);
    subscriptions.add(subscriber);

    return {
      unsubscribe() {
        subscriptions.delete(subscriber);
      }
    };
  }

  static reset() {
    this.genomeBrowser = null;
    this.subscriptions = new Map();

    // FIXME: if an observable of messages is added, then complete it and reinitialize it
  }
}
