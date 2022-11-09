# navigate()

The `navigate` function is there for navigating and changing the location state.
It takes the new path to navigate to, optional data that can be accesss through `useLocationState` and `getLocationState` and a boo indicating if the new history entry should be added to the history or replacing the current one.

```
function navigate(
  path: string,
  data?: {} | null,
  replace: boolean = false
)
```

The `navigate` function can be used without causing any renders when the location changes.
It is safe to be used within effects without adding it to the dependency array.
