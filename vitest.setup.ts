import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Without this, a component left mounted by one test is still in the document
// for the next one, and queries start matching the wrong render. The failures
// that produces are order-dependent and cost hours to track down.
afterEach(cleanup);
