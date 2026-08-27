import { describe, expect, it, vi } from "vitest";
import {
  CONTRIBUTOR_REPOSITORIES,
  extractDifficulty,
  getContributorIssues,
  normalizeGitHubIssues,
} from "../../lib/contributor-issues";

function response(body: unknown, ok = true): Response {
  return {
    ok,
    json: async () => body,
  } as Response;
}

describe("contributor issue normalization", () => {
  it("filters pull requests, normalizes labels, and extracts difficulty", () => {
    const issues = normalizeGitHubIssues([
      {
        id: 1,
        number: 57,
        title: "Build the contributors page",
        html_url: "https://github.com/FinesseStudioLab/modeltrace-frontend/issues/57",
        labels: [
          { name: "good first issue" },
          { name: " difficulty:Easy " },
          "GOOD FIRST ISSUE",
          { name: null },
        ],
      },
      {
        id: 2,
        number: 58,
        title: "A pull request",
        html_url: "https://github.com/FinesseStudioLab/modeltrace-frontend/pull/58",
        labels: [],
        pull_request: {},
      },
      { id: "invalid" },
    ], CONTRIBUTOR_REPOSITORIES[0]);

    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      id: 1,
      labels: ["good first issue", "difficulty:Easy"],
      difficulty: "easy",
      repository: "modeltrace-frontend",
    });
    expect(extractDifficulty(["help wanted"])).toBeUndefined();
  });

  it("rejects a malformed top-level API response", () => {
    expect(() => normalizeGitHubIssues({}, CONTRIBUTOR_REPOSITORIES[0])).toThrow();
  });
});

describe("contributor issue fetching", () => {
  it("combines both labels, removes duplicate issues, and configures caching", async () => {
    const issue = {
      id: 10,
      number: 10,
      title: "Shared issue",
      html_url: "https://github.com/FinesseStudioLab/modeltrace-frontend/issues/10",
      labels: [{ name: "good first issue" }, { name: "help wanted" }],
    };
    const fetcher = vi.fn(async (_url: string, _init: RequestInit) => response([issue]));

    const results = await getContributorIssues(fetcher);

    expect(results).toHaveLength(3);
    expect(results.every((result) => result.issues.length === 1)).toBe(true);
    expect(results.every((result) => result.status === "available")).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(6);
    expect(fetcher.mock.calls[0]?.[1]).toMatchObject({ next: { revalidate: 3600 } });
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("labels=good+first+issue"),
        expect.stringContaining("labels=help+wanted"),
      ]),
    );
  });

  it("keeps successful repositories when another repository fails", async () => {
    const fetcher = vi.fn(async (url: string) => {
      if (url.includes("modeltrace-backend")) {
        throw new Error("rate limited");
      }
      return response([]);
    });

    const results = await getContributorIssues(fetcher);

    expect(results.find(({ repository }) => repository.name === "modeltrace-backend")?.status)
      .toBe("unavailable");
    expect(results.filter(({ status }) => status === "available")).toHaveLength(2);
    expect(results.filter(({ status }) => status === "available").every(({ issues }) =>
      issues.length === 0)).toBe(true);
  });

  it("marks a repository partial when only one label request succeeds", async () => {
    const fetcher = vi.fn(async (url: string) => {
      if (url.includes("labels=help+wanted")) {
        return response({}, false);
      }
      return response([]);
    });

    const results = await getContributorIssues(fetcher);

    expect(results.every(({ status }) => status === "partial")).toBe(true);
  });

  it("degrades safely when all GitHub requests fail", async () => {
    const fetcher = vi.fn(async () => response({ message: "rate limit" }, false));

    const results = await getContributorIssues(fetcher);

    expect(results.every(({ status, issues }) => status === "unavailable" && issues.length === 0))
      .toBe(true);
  });
});
