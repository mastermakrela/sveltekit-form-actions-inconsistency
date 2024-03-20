# Form Actions inconsistency

Depending on whether SSR is enabled or not, the Form Actions behave differently,
and I don't mean the difference in response (rendered HTML vs. SPA shell).

After an action is invoked it can have three outcomes: success, error, or redirect.
(in this scenraio [`fail`](https://kit.svelte.dev/docs/form-actions#anatomy-of-an-action-validation-errors) is analogous to success — data is also missing)

With SSR the returned the responses make sense, i.e.
success re-renders the page with the new data,
error renders the error page,
and the redirect redirects to a new page.

The problems start when SSR is disabled.
Only the redirect works as expected.
In both other cases it looks like a page reload, without any indication of change.

Because I found it hard to explain in prose,
I wrote down what happens in order for each case,
and I point out the inconsistencies in conclusion bellow.

### With SSR

initial load:

1. server load
2. universal load on server
3. universal load in browser ([uses deserialized data from 2.](https://kit.svelte.dev/docs/load#universal-vs-server-when-does-which-load-function-run))
4. page:
   - `data: PageData` contains data returned from 3.
   - `form: ActionData` is `null`

after form submission:

1. submission successful

   1. action
   2. server load
      - [values from action (**locals**, cookies) are available](https://kit.svelte.dev/docs/form-actions#loading-data)
   3. universal load on server
   4. universal load in browser
   5. page: `+page.svelte`
      - `data: PageData` contains data returned from 4.
      - `form: ActionData` contains data returned from 1.

2. action calls [`error`](https://kit.svelte.dev/docs/load#errors)

   1. action
   2. page: nearest `+error.svelte`
      - `data: PageData` is empty (`{}`)
      - `form: ActionData` is `null`

3. action calls [`redirect`](https://kit.svelte.dev/docs/load#redirects)

   1. action
   2. page: `+page.svelte` for the redirected page
      - `data: PageData` is empty (`{}`)
      - `form: ActionData` is `null`

### Without SSR

initial load:

1. server load
2. universal load in browser
3. page:
   - `data: PageData` contains data returned from 2.
   - `form: ActionData` is `null`

after form submission:

1. submission successful

   1. action
      - response with 2XX status code
      - body is SPA shell
   2. server load (subsequent request from CSR/SPA)
      - **SOME** values from action are available: `locals` are empty; cookies are available [^1]
   3. universal load in browser
   4. page: `+page.svelte`
      - `data: PageData` contains data returned from 3.
      - `form: ActionData` is `null`

[^1]: makes sense, because the server load is a new request, and the cookies are sent with the request - `locals` are not

2. action calls [`error`](https://kit.svelte.dev/docs/load#errors)

   1. action
      - response actually has the 4XX error code (visible in devtools)
      - but because the body is CSR/SPA, and not the `+error.svelte` page, the **error is not displayed**, and the page proceeds to load as on initial load
   2. server load (subsequent request from CSR/SPA)
      - **SOME** values from action are available: `locals` are empty; cookies are available [^1]
   3. universal load in browser
   4. page: `+page.svelte`
      - `data: PageData` contains data returned from 3.
      - `form: ActionData` is `null`

3. action calls [`redirect`](https://kit.svelte.dev/docs/load#redirects)

   1. action
      - response with 3XX status code and location
   2. page: `+page.svelte` for the location
      - `data: PageData` is empty (`{}`)
      - `form: ActionData` is `null`
      - (assuming this route has no loads, otherwise they would be called as well)

## Conclusion

I think there are two problems here:

1. _Missing error page_

   already described [here](https://github.com/sveltejs/kit/issues/11757)

2. _Missing `ActionData`_

   ~~I think the source of this inconsistency is that without SSR the actions respond immediately, without populating the `data`, `form`, etc.~~
   This of course can't happen because without SSR the same **static** HTML is always served.
   The solution is to use `use:enhance`

   I still think it would be nice if the `ActionData`
   (and then probably also data from server load)
   was available for the CSR.
