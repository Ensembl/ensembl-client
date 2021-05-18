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

import React, { useState, useRef, ReactNode, useEffect } from 'react';
import { of, from, merge, timer, combineLatest, Subscription } from 'rxjs';
import { tap, mergeMap, delay, map, take, catchError } from 'rxjs/operators';

import ControlledLoadingButton from './ControlledLoadingButton';

import { LoadingState } from 'src/shared/types/loading-state';

type LoadingButtonProps = {
  onClick: () => Promise<unknown>;
  onSuccess?: (x?: unknown) => void;
  onError?: (x?: unknown) => void;
  isDisabled?: boolean;
  className?: string;
  children: ReactNode;
};

type RequestHandlerParams = {
  loader: () => Promise<unknown>;
  onSuccess?: (x?: unknown) => void;
  onError?: (x?: unknown) => void;
};

const MINIMUM_SPINNER_TIME = 1000; // 1 second
const COMPLETION_INDICATOR_TIME = 2000; // 2 seconds

const getLoadingState$ = (params: RequestHandlerParams) => {
  const loadingStart$ = of(LoadingState.LOADING);
  const request$ = combineLatest([
    timer(MINIMUM_SPINNER_TIME).pipe(take(1)),
    from(params.loader()).pipe(
      map((result) => ({
        status: LoadingState.SUCCESS as const,
        result
      })),
      catchError((error) =>
        of({
          status: LoadingState.ERROR as const,
          error
        })
      )
    )
  ]).pipe(
    tap(([, response]) => {
      if (response.status === LoadingState.SUCCESS) {
        params?.onSuccess?.(response.result);
      } else {
        params?.onError?.(response.error);
      }
    }),
    mergeMap(([, result]) => {
      return merge(of(result.status), returnToInitial$);
    })
  );
  const returnToInitial$ = of(LoadingState.NOT_REQUESTED).pipe(
    delay(COMPLETION_INDICATOR_TIME)
  );
  return merge(loadingStart$, request$);
};

const LoadingButton = (props: LoadingButtonProps) => {
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.NOT_REQUESTED
  );
  const subscriptionRef = useRef<Subscription | null>(null);

  const onClick = () => {
    const loadingState$ = getLoadingState$({
      loader: props.onClick,
      onSuccess: props.onSuccess,
      onError: props.onError
    });
    const subscription = loadingState$.subscribe(setLoadingState);
    subscriptionRef.current = subscription;
  };

  useEffect(() => {
    return () => subscriptionRef.current?.unsubscribe();
  }, []);

  return (
    <ControlledLoadingButton
      status={loadingState}
      onClick={onClick}
      className={props.className}
      isDisabled={props.isDisabled}
    >
      {props.children}
    </ControlledLoadingButton>
  );
};

export default LoadingButton;
