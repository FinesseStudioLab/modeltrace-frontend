import type { Metadata } from "next";
import {
  CODE_OF_CONDUCT_URL,
  CONTRIBUTOR_REPOSITORIES,
  getContributorIssues,
  type ContributorIssue,
  type RepositoryIssueResult,
} from "@/lib/contributor-issues";

export const metadata: Metadata = {
  title: "Contributors",
  description: "Find open ModelTrace issues and learn how to contribute across the project.",
};

function displayDifficulty(difficulty: string): string {
  return difficulty.charAt(0).toLocaleUpperCase() + difficulty.slice(1);
}

function IssueCard({ issue }: { issue: ContributorIssue }) {
  return (
    <li className="contributor-issue">
      <div className="contributor-issue-meta">
        <span>{issue.repository}</span>
        <span>Issue #{issue.number}</span>
        {issue.difficulty ? (
          <span className="difficulty">Difficulty: {displayDifficulty(issue.difficulty)}</span>
        ) : null}
      </div>
      <h3>
        <a href={issue.htmlUrl} target="_blank" rel="noreferrer">
          {issue.title}
        </a>
      </h3>
      {issue.labels.length > 0 ? (
        <ul className="issue-labels" aria-label={`Labels for issue ${issue.number}`}>
          {issue.labels.map((label) => <li key={label}>{label}</li>)}
        </ul>
      ) : null}
    </li>
  );
}

function RepositoryIssues({ result }: { result: RepositoryIssueResult }) {
  const { repository, issues, status } = result;

  return (
    <article className="repository-group">
      <div className="repository-heading">
        <div>
          <p className="repository-kicker">{repository.displayName}</p>
          <h2>{repository.name}</h2>
        </div>
        <a href={repository.url} target="_blank" rel="noreferrer">
          View repository
        </a>
      </div>
      <p className="repository-description">{repository.description}</p>

      {status === "unavailable" ? (
        <p className="issues-message" role="status">
          Live issues for this repository are temporarily unavailable.
        </p>
      ) : issues.length === 0 ? (
        <p className="issues-message">No matching open issues right now.</p>
      ) : (
        <>
          {status === "partial" ? (
            <p className="issues-message" role="status">
              Some live issues may be temporarily unavailable.
            </p>
          ) : null}
          <ul className="contributor-issues">
            {issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)}
          </ul>
        </>
      )}
    </article>
  );
}

export default async function Page() {
  const repositoryIssues = await getContributorIssues();
  const allUnavailable = repositoryIssues.every((result) => result.status === "unavailable");

  return (
    <div className="contributors-page">
      <section className="section contributors-hero">
        <span className="tag">Contributors</span>
        <h1>Help build verifiable AI infrastructure.</h1>
        <p>
          Pick a scoped issue across the ModelTrace frontend, backend, or smart contracts. Live
          openings are grouped below so you can start where your experience fits best.
        </p>
      </section>

      <section className="section live-issues" aria-labelledby="live-issues-heading">
        <div className="section-heading">
          <div>
            <span className="tag">Live from GitHub</span>
            <h2 id="live-issues-heading">Good first issues and help wanted</h2>
          </div>
          <p>Open issues refresh hourly.</p>
        </div>
        {allUnavailable ? (
          <p className="issues-message issues-message-wide" role="status">
            Live issues are temporarily unavailable. You can still visit each repository and use
            the contribution guides below.
          </p>
        ) : null}
        <div className="repository-groups">
          {repositoryIssues.map((result) => (
            <RepositoryIssues key={result.repository.name} result={result} />
          ))}
        </div>
      </section>

      <section className="section contribution-workflow" aria-labelledby="workflow-heading">
        <span className="tag">Contribution workflow</span>
        <h2 id="workflow-heading">From issue to review</h2>
        <ol className="workflow-steps">
          <li>
            <strong>Choose an issue.</strong> Read its scope and the target repository&apos;s guide
            before creating a focused branch.
          </li>
          <li>
            <strong>Build and verify.</strong> Follow that repository&apos;s prerequisites and run its
            complete local quality checks.
          </li>
          <li>
            <strong>Prepare a scoped review.</strong> Use a Conventional Commit and explain any
            architectural or interface impact in the pull request.
          </li>
        </ol>

        <div className="contribution-guides">
          {CONTRIBUTOR_REPOSITORIES.map((repository) => (
            <article className="contribution-guide" key={repository.name}>
              <h3>{repository.name}</h3>
              <dl>
                <div>
                  <dt>Prerequisite</dt>
                  <dd>{repository.prerequisite}</dd>
                </div>
                <div>
                  <dt>Required checks</dt>
                  <dd>{repository.checks}</dd>
                </div>
              </dl>
              <a href={repository.contributingUrl} target="_blank" rel="noreferrer">
                Read the {repository.displayName.toLocaleLowerCase()} contribution guide
              </a>
            </article>
          ))}
        </div>

        <p className="conduct-note">
          Every contribution must follow the{" "}
          <a href={CODE_OF_CONDUCT_URL} target="_blank" rel="noreferrer">
            ModelTrace Code of Conduct
          </a>.
        </p>
      </section>
    </div>
  );
}
