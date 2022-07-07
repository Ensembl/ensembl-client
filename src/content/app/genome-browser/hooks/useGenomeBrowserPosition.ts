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

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  IncomingActionType,
  type BrowserCurrentLocationUpdateAction,
  type BrowserTargetLocationUpdateAction
} from '@ensembl/ensembl-genome-browser';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getChrLocationStr } from 'src/content/app/genome-browser/helpers/browserHelper';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import {
  getBrowserActiveFocusObjectId,
  getBrowserActiveGenomeId
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import {
  updateActualChrLocation,
  updateChrLocation,
  type ChrLocation
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

/**
 * The purpose of this hook is to listen and react to genome browser position change messages.
 *
 * NOTE: We should only have a single instance of this hook running at any given time.
 * Therefore, only import it in a single unique component within genome browser page component tree.
 */

const useGenomeBrowserPosition = () => {
  const { genomeIdForUrl, focusObjectIdForUrl } = useGenomeBrowserIds();
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const activeFocusId = useSelector(getBrowserActiveFocusObjectId);

  // keep ids in the ref to avoid them turning into stale closures
  // by the time to use them inside onBrowserLocationChange
  const idRef = useRef({
    activeGenomeId,
    activeFocusId,
    genomeIdForUrl,
    focusObjectIdForUrl
  });

  const { genomeBrowser } = useGenomeBrowser();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    idRef.current = {
      activeGenomeId,
      activeFocusId,
      genomeIdForUrl,
      focusObjectIdForUrl
    };
  }, [activeGenomeId, activeFocusId, genomeIdForUrl, focusObjectIdForUrl]);

  useEffect(() => {
    const subscriptionToActualPotitionMessages = genomeBrowser?.subscribe(
      IncomingActionType.CURRENT_POSITION,
      onBrowserLocationChange
    );
    const subscriptionToTargetPotitionMessages = genomeBrowser?.subscribe(
      IncomingActionType.TARGET_POSITION,
      onBrowserLocationChange
    );

    return () => {
      subscriptionToActualPotitionMessages?.unsubscribe();
      subscriptionToTargetPotitionMessages?.unsubscribe();
    };
  }, [genomeBrowser]);

  const onBrowserLocationChange = (
    action:
      | BrowserCurrentLocationUpdateAction
      | BrowserTargetLocationUpdateAction
  ) => {
    const { activeGenomeId, genomeIdForUrl, focusObjectIdForUrl } =
      idRef.current;
    const { stick, start, end } = action.payload;
    const chromosome = stick.split(':')[1];

    if (action.type === IncomingActionType.CURRENT_POSITION) {
      dispatch(updateActualChrLocation([chromosome, start, end]));
    } else {
      const chrLocation = [chromosome, start, end] as ChrLocation;

      dispatch(
        updateChrLocation({
          [activeGenomeId as string]: [chromosome, start, end]
        })
      );
      navigate(
        urlFor.browser({
          genomeId: genomeIdForUrl,
          focus: focusObjectIdForUrl,
          location: getChrLocationStr(chrLocation)
        }),
        {
          replace: true
        }
      );
    }
  };
};

export default useGenomeBrowserPosition;
