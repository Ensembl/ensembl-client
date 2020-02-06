import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';

export const fetch = (url: string) =>
  ajax(url).pipe(
    map((ajaxResponse) => ajaxResponse.response),
    catchError((err) => {
      // Network or other error, handle appropriately
      return of({ error: true, message: err.message });
    })
  );
