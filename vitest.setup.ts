import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Node 22+ ships its own experimental `localStorage` global (file-backed,
// unrelated to any DOM). Depending on the Node build, it can end up as
// window.localStorage in the jsdom environment instead of jsdom's own
// implementation — and its Storage methods are then silently no-ops rather
// than throwing, which is a much harder failure to place than an error would
// be. Which one wins is a Node-version artifact, not something a test suite
// should depend on either way, so it is replaced outright with a small,
// deterministic in-memory Storage that behaves the same on every Node
// version this suite might run under, locally or in CI.
function createMemoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    getItem: (key) => (data.has(key) ? data.get(key)! : null),
    setItem: (key, value) => {
      data.set(key, String(value));
    },
    removeItem: (key) => {
      data.delete(key);
    },
    clear: () => {
      data.clear();
    },
    key: (index) => Array.from(data.keys())[index] ?? null,
    get length() {
      return data.size;
    },
  };
}

vi.stubGlobal("localStorage", createMemoryStorage());

// Without this, a component left mounted by one test is still in the document
// for the next one, and queries start matching the wrong render. The failures
// that produces are order-dependent and cost hours to track down.
afterEach(cleanup);
