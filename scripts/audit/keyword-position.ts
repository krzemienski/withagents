#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";

interface Result {
  file: string;
  keyword: string | null;
  wordPosition: number | null;
  pass: boolean;
}

function arg(name: string, fallback: string): string {
  const flag = `--${name}`;
  const i = process.argv.indexOf(flag);
  if (i === -1) return fallback;
  return process.argv[i + 1] ?? fallback;
}

function expandGlob(pattern: string): string[] {
  if (!pattern.includes("*")) {
    return fs.existsSync(pattern) ? [pattern] : [];
  }
  const dir = path.dirname(pattern);
  const base = path.basename(pattern);
  const re = new RegExp("^" + base.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => re.test(f))
    .map((f) => path.join(dir, f));
}

function extractFrontmatter(src: string): { fm: Record<string, unknown>; body: string } {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: src };
  const fm: Record<string, unknown> = {};
  let currentList: string | null = null;
  const items: string[] = [];
  for (const line of m[1].split("\n")) {
    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (currentList && listItem) {
      items.push(listItem[1].replace(/^["']|["']$/g, "").trim());
      continue;
    }
    if (currentList) {
      fm[currentList] = [...items];
      currentList = null;
      items.length = 0;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      const val = kv[2].trim();
      if (val === "") {
        currentList = key;
      } else {
        fm[key] = val.replace(/^["']|["']$/g, "");
      }
    }
  }
  if (currentList) fm[currentList] = [...items];
  return { fm, body: m[2] };
}

function primaryKeyword(fm: Record<string, unknown>): string | null {
  const candidates: unknown[] = [];
  if (Array.isArray(fm.keywords)) candidates.push(...fm.keywords);
  if (Array.isArray(fm.tags)) candidates.push(...fm.tags);
  const first = candidates.find((c) => typeof c === "string" && c.trim().length > 0);
  return typeof first === "string" ? first.trim() : null;
}

function stripCodeFences(body: string): string {
  return body.replace(/```[\s\S]*?```/g, "");
}

function findFirstWordPosition(body: string, keyword: string): number {
  const clean = stripCodeFences(body);
  const lc = clean.toLowerCase();
  const idx = lc.indexOf(keyword.toLowerCase());
  if (idx === -1) return -1;
  return clean.slice(0, idx).split(/\s+/).filter(Boolean).length + 1;
}

function main(): void {
  const globArg = process.argv.find((a) => !a.startsWith("--") && a !== process.argv[0] && a !== process.argv[1]);
  const glob = globArg ?? "withagents-site/src/content/posts/day-*-*.mdx";
  const maxPos = Number(arg("max-position", "100"));
  const files = expandGlob(glob);

  if (files.length === 0) {
    console.error(`[keyword-position] no files matched: ${glob}`);
    process.exit(2);
  }

  const results: Result[] = [];
  for (const file of files) {
    const src = fs.readFileSync(file, "utf-8");
    const { fm, body } = extractFrontmatter(src);
    const keyword = primaryKeyword(fm);
    if (!keyword) {
      results.push({ file, keyword: null, wordPosition: null, pass: false });
      continue;
    }
    const pos = findFirstWordPosition(body, keyword);
    results.push({
      file,
      keyword,
      wordPosition: pos === -1 ? null : pos,
      pass: pos !== -1 && pos <= maxPos,
    });
  }

  let fails = 0;
  for (const r of results) {
    const status = r.pass ? "PASS" : "FAIL";
    const posLabel = r.wordPosition === null ? "missing" : `word ${r.wordPosition}`;
    console.log(`${status} ${path.basename(r.file)} keyword="${r.keyword ?? "(none)"}" ${posLabel}`);
    if (!r.pass) fails++;
  }

  console.log(`\n${results.length - fails}/${results.length} PASS (max-position=${maxPos})`);
  process.exit(fails > 0 ? 1 : 0);
}

main();
