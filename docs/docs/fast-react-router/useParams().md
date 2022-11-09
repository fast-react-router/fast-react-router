# useParams()

The `useParams` hook is there for getting the params from the pathname.
It only listen to the `window.location.pathname` and cause only a new render, if the pathname changes.
If you are navigating through the app without changing the pathname but only changing e. g. the state, search or hash no render will happen.

Example:
```
function MyApp() {
    return (
    <Route path="page.com/items/:id">
        <MyComponent />
    </Route>
    );
}

function MyComponent() {
    const selectedItemId = useParams()["id"];
}
```

```
function useParams() : {
    [paramName: string]: string;
}
```
