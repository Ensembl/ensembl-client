import React, { useState, useRef, ReactNode, useEffect } from 'react';
import { of, from, merge, timer, combineLatest, Subscription } from 'rxjs';
import { tap, mergeMap, delay, take } from 'rxjs/operators'

import { PrimaryButton } from 'src/shared/components/button/Button';

import { LoadingState } from 'src/shared/types/loading-state.ts';

import styles from './LoadingButton.scss';

type LoadingButtonProps = {
  onClick: () => Promise<unknown>;
  onSuccess?: (x: unknown) => void;
  onError?: () => void;
  isDisabled?: boolean;
  className?: string;
  children: ReactNode;
};

type RequestHandlerParams = {
  loader: () => Promise<unknown>;
  onSuccess?: (x: unknown) => void;
};

const MINIMUM_SPINNER_TIME = 2000; // 2 seconds
const SUCCESS_INDICATOR_TIME = 2000; // 2 seconds

const getLoadingState$ = (params: RequestHandlerParams) => {
  const loadingStart$ = of(LoadingState.LOADING);
  const request$ = combineLatest([
    timer(MINIMUM_SPINNER_TIME).pipe(take(1)),
    from(params.loader())
  ]).pipe(
    tap(([, result]) => params?.onSuccess?.(result)),
    mergeMap(() => merge(of(LoadingState.SUCCESS), returnToIniital$)),
  );
  const returnToIniital$ = of(LoadingState.NOT_REQUESTED).pipe(
    delay(SUCCESS_INDICATOR_TIME)
  )
  const action$ = merge(loadingStart$, request$);

  return action$;
}


const LoadingButton = (props: LoadingButtonProps) => {
  const [ loadingState, setLoadingState ] = useState<LoadingState>(LoadingState.NOT_REQUESTED);
  const subscriptionRef = useRef<Subscription | null>(null);

  const onClick = () => {
    const loadingState$ = getLoadingState$({ loader: props.onClick, onSuccess: props.onSuccess });
    const subscription = loadingState$.subscribe(setLoadingState);
    subscriptionRef.current = subscription;
  }

  useEffect(() => {
    return () => subscriptionRef.current?.unsubscribe();
  }, []);

  const buttonClass = loadingState !== LoadingState.NOT_REQUESTED ? styles.invisible : undefined;

  return (
    <div className={styles.buttonWrapper}>
      { loadingState === LoadingState.LOADING && <Loading /> }
      { loadingState === LoadingState.SUCCESS && <Success /> }
      <PrimaryButton onClick={onClick} className={buttonClass}>
        { props.children }
      </PrimaryButton>
    </div>
  );
};

const Loading = () => <div className={styles.loadingIndicator}>Loading...</div>

const Success = () => <div className={styles.successIndicator}>Success!</div>

export default LoadingButton;
