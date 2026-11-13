import "@testing-library/jest-dom/vitest"; // adds the matcher types
import * as matchers from "@testing-library/jest-dom/matchers";

// The tests call the global `expect`. Register the jest-dom matchers on it explicitly:
// the import above can end up extending a different `expect` instance.
expect.extend(matchers);
