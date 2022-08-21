import { navigate } from "./index";

it("Test navigation", () => {
  expect(window.location.pathname).toBe("/");
  navigate("/test");
  expect(window.location.pathname).toBe("/test");
});
