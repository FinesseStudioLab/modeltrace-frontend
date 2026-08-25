import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("raw HTML rendering guard", () => {
  it("keeps the landing page free of dangerouslySetInnerHTML", () => {
    const page = readFileSync("app/page.tsx", "utf8");
    expect(page).not.toContain("dangerouslySetInnerHTML");
  });

  it("enables the React no-danger lint rule", () => {
    const eslintConfig = JSON.parse(readFileSync(".eslintrc.json", "utf8"));
    expect(eslintConfig.rules["react/no-danger"]).toBe("error");
  });
});
