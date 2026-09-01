import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const CONTENT_DIR = path.join(process.cwd(), "content", "changelog");

export type EntryType = "post" | "changelog" | "postmortem";

export interface ChangelogEntry {
  slug: string;
  title: string;
  date: string;
  type: EntryType;
  milestone?: string;
  summary: string;
  tags: string[];
  /** HTML body — only populated by getEntryBySlug */
  body?: string;
}

function parseEntry(filename: string): ChangelogEntry {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? String(data.date) : "",
    type: (data.type as EntryType) ?? "post",
    milestone: data.milestone ?? undefined,
    summary: data.summary ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
}

/** All entries sorted newest-first. */
export function getAllEntries(): ChangelogEntry[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse(); // lexicographic desc → newest slug first
  return files.map(parseEntry);
}

/** Single entry with rendered HTML body. */
export async function getEntryBySlug(
  slug: string
): Promise<(ChangelogEntry & { body: string }) | null> {
  const filepath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  const body = await marked(content, { async: true });
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? String(data.date) : "",
    type: (data.type as EntryType) ?? "post",
    milestone: data.milestone ?? undefined,
    summary: data.summary ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    body,
  };
}

/** Unique milestone labels found across all entries, sorted. */
export function getMilestones(): string[] {
  const entries = getAllEntries();
  const set = new Set<string>();
  for (const e of entries) {
    if (e.milestone) set.add(e.milestone);
  }
  return Array.from(set).sort();
}

/** Human-readable date string, e.g. "14 Nov 2025". */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
