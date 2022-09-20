`fast-router` is a new routing library for react.
`fast-router` is designed to keep the number of renders as low as possible.
So if you want to navigate you can just use the navigate function without using a `useNaviate` hook which cause a rerender every time something changed in the url or in the state of the location.
Also no route gets rerenderd, if the state of the location changes as long as the path remains the same.
If you use the useLocationState function to select a value from the state and another value changes within the state no new render occurs.
Currently a lot of function from other frameworks like [react-router](https://github.com/remix-run/react-router) and [wouter](https://github.com/molefrog/wouter) are currently not supported.
If you are missing any features just create an issue.

Pros
- Fast (less renders then in other routing libaries)
- Small bundle size
- 100% Typescript

Cons
- A lot of missing functionalities
- New (not realy tested, maybe there are coming breaking changes)
- Only works with `react`. [wouter](https://github.com/molefrog/wouter) for example works with `preact` too.

Todos
- [x] navigate function
- [x] Route component
- [x] useParams hook
- [x] useState hook
- [x] usePathname hook
- [x] nested routes
- [x] Link component
- [x] Switch component
- [x] useSearch hook
- [ ] useSearchParams hook (just getting a single parameter of the search)
- [ ] Documentation
