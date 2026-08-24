const GITHUB_API_URL = "https://api.github.com";
const GITHUB_ORGANIZATION = "FinesseStudioLab";
const ISSUE_LABELS = ["good first issue", "help wanted"] as const;
const REVALIDATE_SECONDS = 60 * 60;

export type ContributorRepository = {
  name: string;
  displayName: string;
  description: string;
  prerequisite: string;
  checks: string;
  url: string;
  contributingUrl: string;
};

export const CONTRIBUTOR_REPOSITORIES = [
  {
    name: "modeltrace-frontend",
    displayName: "Frontend",
    description: "Next.js application, public protocol story, dashboards, and audit exports.",
    prerequisite: "Node.js 20+",
    checks: "Lint, typecheck, unit tests, production build, and browser tests",
    url: `https://github.com/${GITHUB_ORGANIZATION}/modeltrace-frontend`,
    contributingUrl: `https://github.com/${GITHUB_ORGANIZATION}/modeltrace-frontend/blob/main/CONTRIBUTING.md`,
  },
  {
    name: "modeltrace-backend",
    displayName: "Backend",
    description: "Fastify API, Soroban RPC integration, and privileged gateway workflows.",
    prerequisite: "Node.js 20+",
    checks: "Typecheck and production build",
    url: `https://github.com/${GITHUB_ORGANIZATION}/modeltrace-backend`,
    contributingUrl: `https://github.com/${GITHUB_ORGANIZATION}/modeltrace-backend/blob/main/CONTRIBUTING.md`,
  },
  {
    name: "modeltrace-contract",
    displayName: "Smart contracts",
    description: "Soroban contracts for attestation, metering, and dispute-aware settlement.",
    prerequisite: "Rust 1.84+ and the wasm32v1-none target",
    checks: "Format, Clippy, workspace tests, and release WASM build",
    url: `https://github.com/${GITHUB_ORGANIZATION}/modeltrace-contract`,
    contributingUrl: `https://github.com/${GITHUB_ORGANIZATION}/modeltrace-contract/blob/main/CONTRIBUTING.md`,
  },
] as const satisfies readonly ContributorRepository[];

export const CODE_OF_CONDUCT_URL =
  `https://github.com/${GITHUB_ORGANIZATION}/modeltrace-frontend/blob/main/CODE_OF_CONDUCT.md`;

export type ContributorIssue = {
  id: number;
  number: number;
  title: string;
  htmlUrl: string;
  repository: string;
  labels: string[];
  difficulty?: string;
};

export type RepositoryIssueResult = {
  repository: ContributorRepository;
  issues: ContributorIssue[];
  status: "available" | "partial" | "unavailable";
};

type GitHubFetch = (
  input: string,
  init: RequestInit & { next: { revalidate: number } },
) => Promise<Response>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeLabels(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const labels = value.flatMap((label) => {
    if (typeof label === "string") {
      return [label.trim()];
    }

    if (isRecord(label) && typeof label.name === "string") {
      return [label.name.trim()];
    }

    return [];
  });

  const seen = new Set<string>();
  return labels.filter((label) => {
    const key = label.toLocaleLowerCase();
    if (!label || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function extractDifficulty(labels: readonly string[]): string | undefined {
  for (const label of labels) {
    const match = /^difficulty:\s*(.+)$/i.exec(label);
    if (match?.[1]) {
      return match[1].trim().toLocaleLowerCase();
    }
  }

  return undefined;
}

export function normalizeGitHubIssues(
  payload: unknown,
  repository: ContributorRepository,
): ContributorIssue[] {
  if (!Array.isArray(payload)) {
    throw new Error("Unexpected GitHub response");
  }

  return payload.flatMap((value) => {
    if (!isRecord(value) || "pull_request" in value) {
      return [];
    }

    const { id, number, title, html_url: htmlUrl } = value;
    if (
      typeof id !== "number" ||
      typeof number !== "number" ||
      typeof title !== "string" ||
      typeof htmlUrl !== "string"
    ) {
      return [];
    }

    const labels = normalizeLabels(value.labels);
    return [{
      id,
      number,
      title,
      htmlUrl,
      repository: repository.name,
      labels,
      difficulty: extractDifficulty(labels),
    }];
  });
}

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchIssuesForLabel(
  repository: ContributorRepository,
  label: string,
  fetcher: GitHubFetch,
): Promise<ContributorIssue[]> {
  const query = new URLSearchParams({
    state: "open",
    labels: label,
    per_page: "100",
  });
  const response = await fetcher(
    `${GITHUB_API_URL}/repos/${GITHUB_ORGANIZATION}/${repository.name}/issues?${query}`,
    {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    },
  );

  if (!response.ok) {
    throw new Error("GitHub request failed");
  }

  return normalizeGitHubIssues(await response.json(), repository);
}

async function fetchRepositoryIssues(
  repository: ContributorRepository,
  fetcher: GitHubFetch,
): Promise<RepositoryIssueResult> {
  const responses = await Promise.allSettled(
    ISSUE_LABELS.map((label) => fetchIssuesForLabel(repository, label, fetcher)),
  );
  const successful = responses.filter(
    (response): response is PromiseFulfilledResult<ContributorIssue[]> =>
      response.status === "fulfilled",
  );

  if (successful.length === 0) {
    return { repository, issues: [], status: "unavailable" };
  }

  const issuesById = new Map<number, ContributorIssue>();
  for (const response of successful) {
    for (const issue of response.value) {
      issuesById.set(issue.id, issue);
    }
  }

  return {
    repository,
    issues: [...issuesById.values()].sort((a, b) => b.number - a.number),
    status: successful.length === ISSUE_LABELS.length ? "available" : "partial",
  };
}

export async function getContributorIssues(
  fetcher: GitHubFetch = fetch,
): Promise<RepositoryIssueResult[]> {
  return Promise.all(
    CONTRIBUTOR_REPOSITORIES.map((repository) => fetchRepositoryIssues(repository, fetcher)),
  );
}
