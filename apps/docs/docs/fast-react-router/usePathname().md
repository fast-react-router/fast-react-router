# usePathname()

The `usePathname` hook is there for getting the current pathname.
It only listen to the `window.location.pathname` and cause only a new render, if the pathname changes.
If you are navigating through the app without changing the pathname but only changing e. g. the state, search or hash no render will happen.

```
function usePathname() : string
```
