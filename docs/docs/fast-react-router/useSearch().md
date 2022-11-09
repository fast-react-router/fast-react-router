# useSearch()

The `useSearch` hook is there for getting the current search.
It only listen to the `window.location.search` and cause only a new render, if the search changes.
If you are navigating through the app without changing the search but only changing e. g. the path, state or hash no render will happen.

```
function useSearch() : string
```
