# Route

The `Route` component displays a route within your app.
It only listen to the `window.location.pathname` and cause only a new render, if the pathname changes.
If you are navigating through the app without changing the pathname but only changing e. g. the state, search or hash no render will happen.
It takes children and will display them only if the given route matches the current location route.
Nested routes are also supported.

Example:
```
function MyApp() {
    return (
    <Route path="page.com/items">
        <Header />
        
        <Route path="/">
            <!-- Only renders, if we are at page.com/items -->
            <ItemsList />
        </Route>

        <Route path=":id">
        <!-- Only renders if there is a item id is provided -->
            <Item />
        </Route>

        <Route path=":id?">
        <!-- Renders with an optional parameter -->
            <Item />
        </Route>

        <Route path="/+">
        <!-- Renders if there is any other path behind  -->
            <Item />
        </Route>

        <Route path="/*">
        <!-- Renders always  -->
            <Item />
        </Route>
    </Route>
    );
}
```

```
function Route(props: RouteProps);
```
