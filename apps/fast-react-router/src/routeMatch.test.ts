import { isRouteMatch, routeMatch } from "./index";

describe("Test route", () => {
  it("test route", () => {
    expect(isRouteMatch("/test/route/3", "/test/route/3")).toBeTruthy();
    expect(isRouteMatch("/test/route/*", "/test/route/3/5")).toBeTruthy();
    expect(isRouteMatch("/test/route/*", "/test/route/3")).toBeTruthy();
    expect(isRouteMatch("/test/route/*", "/test/route/")).toBeTruthy();
    expect(isRouteMatch("/test/route/*", "/test/route")).toBeTruthy();

    expect(isRouteMatch("/test/route/id", "/test/route/3")).toBeFalsy();
  });
});

describe("Test params", () => {
  it("test params", () => {
    expect(isRouteMatch("/test/route/:id", "/test/route/3")).toBeTruthy();
    const match = routeMatch("/test/route/:id", "/test/route/3");
    expect(match[0]).toBeTruthy();
    expect(match[1]!["id"]).toBe("3");

    expect(isRouteMatch("/test/route/:id", "/test/route")).toBeFalsy();
  });

  it("test optional params", () => {
    expect(isRouteMatch("/test/route/:id?", "/test/route")).toBeTruthy();
    let match = routeMatch("/test/route/:id?", "/test/route");
    expect(match[0]).toBeTruthy();
    expect(match[1]!["id"]).toBe(undefined);

    match = routeMatch("/test/route/:id?", "/test/route/3");
    expect(match[0]).toBeTruthy();
    expect(match[1]!["id"]).toBe("3");
  });

  it("test repeat params", () => {
    expect(isRouteMatch("/test/route/:id+", "/test/route/3/2/1")).toBeTruthy();
    const match = routeMatch("/test/route/:id+", "/test/route/3/2/1");
    expect(match[0]).toBeTruthy();
    expect(match[1]!["id"]).toBe("3/2/1");

    expect(isRouteMatch("/test/route/:id+", "/test/route")).toBeFalsy();
  });

  it("test repeat optional params", () => {
    expect(isRouteMatch("/test/route/:id*", "/test/route/3/2/1")).toBeTruthy();
    let match = routeMatch("/test/route/:id*", "/test/route/3/2/1");
    expect(match[0]).toBeTruthy();
    expect(match[1]!["id"]).toBe("3/2/1");

    match = routeMatch("/test/route/:id*", "/test/route");
    expect(match[0]).toBeTruthy();
    expect(match[1]!["id"]).toBe(undefined);
  });
});
