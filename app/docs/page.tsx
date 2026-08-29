import type { Metadata } from "next";
import Link from "next/link";
import { DocsEntryBeacon } from "@/components/analytics/docs-entry-beacon";
import { DocsSidebar } from "./docs-sidebar";
import { docsSections } from "./nav";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Technical reference for ModelTrace: architecture, Soroban contracts, the REST API, integration, and signing key custody.",
};

export default function DocsPage() {
  return (
    <>
      <DocsSidebar />
      <article className="docs-content">
        <DocsEntryBeacon />
        <span className="tag">Documentation</span>
        <h1>Technical reference</h1>
        <p className="docs-lead">
          How ModelTrace is put together: which component holds which rules, what the
          API exposes today, and the decisions behind the parts that move money.
        </p>

        <div className="docs-note">
          <span className="docs-note-label">Reading this reference</span>
          <p>
            Sections marked <strong>Implemented</strong> describe code that exists in
            the repository today. Sections marked <strong>Specified</strong> describe
            a design that is agreed but not yet built — they are written in the
            present tense of the specification, not of the deployed system. The
            distinction is stated on every page it applies to.
          </p>
        </div>

        <h2>Sections</h2>
        <ul className="docs-index">
          {docsSections.map((section) => (
            <li key={section.href}>
              <Link href={section.href}>
                <span className="docs-index-title">{section.title}</span>
                <span className="docs-index-summary">{section.summary}</span>
                <span
                  className={
                    section.status === "Implemented"
                      ? "docs-status docs-status-implemented"
                      : "docs-status docs-status-specified"
                  }
                >
                  {section.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <h2>Where the rules live</h2>
        <p>
          ModelTrace splits enforcement across three places, and the split is the
          thing worth understanding before anything else:
        </p>
        <ul>
          <li>
            <strong>Soroban contracts</strong> hold rules that must survive a
            compromise of any single operator — what an attestation means, how
            metered units accrue, when escrow releases.
          </li>
          <li>
            <strong>modeltrace-api</strong> holds the things a contract cannot
            safely hold: vendor credentials, scheduling, bulk export generation,
            and the policy of who may invoke what.
          </li>
          <li>
            <strong>This web app</strong> holds no authority at all. It renders
            public narrative today and will render operator views once auth lands,
            always through the API.
          </li>
        </ul>
        <p>
          The practical consequence is that no privileged value ever reaches the
          browser bundle. See <Link href="/docs/security">Key custody</Link> for why
          that extends even to the API server.
        </p>
      </article>
    </>
  );
}
