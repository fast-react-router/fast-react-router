# Switch

The `Switch` component holds a list of routes.
It renders only the first matchiing route

Example:
```
function MyApp() {
    return (
        <Switch>
            <Route path="/items">
                <ItemList />
            </Route>
            <Route path="/:items/:id">
                <Item />
            </Route>
            <Page404 />
        </Switch>
    );
}
```

```
function Switch(props: SwitchProps);
```
