import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError } from 'rxjs/operators';

export const fetch = (url: string) =>
  fromFetch(url).pipe(
    switchMap((response) => {
      if (response.ok) {
        // OK return data
        return response.json();
      } else {
        // Server is returning a status requiring the client to try something else.
        return of({ error: true, message: `Error ${response.status}` });
      }
    }),
    catchError((err) => {
      // Network or other error, handle appropriately
      return of({ error: true, message: err.message });
    })
  );
