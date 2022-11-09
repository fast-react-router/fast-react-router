# useLocationState()

The `useLocationState` hook is there for getting the current location state.
It can be used like:

```
type Props = {
    myBoolValue: boolean;
}

function MyComponent() {
    const myBoolValueFromState = useLocationState<Props, boolean>(x => x.myBoolvalue);

    ...
}
```

It only listen to the `window.history.state.[yourSelectedProp]` and cause only a new render, if the selected prop changes.
If is a type safe function that first checks, if the `window.history.state` is filled. If it is not filled it returns null, else it returns the result of the given select function.
If you are navigating through the app without changing the selected prop but only changing e. g. the path, search, hash or any other property withinh the state no render will happen.

```
function useLocationState<State, Select>(
  selectFunction: (state: State) => Select
) : Select | null
```
