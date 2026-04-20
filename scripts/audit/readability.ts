#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";

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

function stripFrontmatter(src: string): string {
  const m = src.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
  return m ? m[1] : src;
}

function stripCodeAndMdx(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]+`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_>~|]/g, " ");
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length === 0) return 0;
  if (w.length <= 3) return 1;
  const trimmed = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const clusters = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, clusters ? clusters.length : 1);
}

function flesch(text: string): { score: number; words: number; sentences: number; syllables: number } {
  const sentences = (text.match(/[.!?]+(?:\s|$)/g) || []).length || 1;
  const words = text.trim().split(/\s+/).filter((w) => /[A-Za-z]/.test(w));
  const wordCount = words.length || 1;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const score = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount);
  return { score, words: wordCount, sentences, syllables };
}

function main(): void {
  const glob = process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "withagents-site/src/content/posts/day-*-*.mdx";
  const minScore = Number(arg("min-score", "50"));
  const files = expandGlob(glob);

  if (files.length === 0) {
    console.error(`[readability] no files matched: ${glob}`);
    process.exit(2);
  }

  let fails = 0;
  for (const file of files) {
    const body = stripCodeAndMdx(stripFrontmatter(fs.readFileSync(file, "utf-8")));
    const { score, words, sentences } = flesch(body);
    const pass = score >= minScore;
    const status = pass ? "PASS" : "FAIL";
    console.log(
      `${status} ${path.basename(file)} Flesch=${score.toFixed(1)} words=${words} sentences=${sentences}`
    );
    if (!pass) fails++;
  }

  console.log(`\n${files.length - fails}/${files.length} PASS (min-score=${minScore})`);
  process.exit(fails > 0 ? 1 : 0);
}

main();
