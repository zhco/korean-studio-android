import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkFlexibleToc from "remark-flexible-toc";
import rehypeSlug from "rehype-slug";


import { notFound } from "next/navigation";
import Link from "next/link";

const MDX_ROOT = path.join(process.cwd(), "mdx");

function getAllDocPaths(): { level: string; doc_path: string[] }[] {
  const results: { level: string; doc_path: string[] }[] = [];
  const levels = fs.readdirSync(MDX_ROOT).filter(d => fs.statSync(path.join(MDX_ROOT, d)).isDirectory());
  for (const level of levels) {
    const levelDir = path.join(MDX_ROOT, level);
    for (const entry of fs.readdirSync(levelDir)) {
      const full = path.join(levelDir, entry);
      if (fs.statSync(full).isFile() && /\.(mdx|md)$/.test(entry)) {
        results.push({ level, doc_path: [entry.replace(/\.(mdx|md)$/, "")] });
      } else if (fs.statSync(full).isDirectory()) {
        for (const sf of fs.readdirSync(full)) {
          if (/\.(mdx|md)$/.test(sf)) {
            results.push({ level, doc_path: [entry, sf.replace(/\.(mdx|md)$/, "")] });
          }
        }
      }
    }
  }
  return results;
}

export async function generateStaticParams() {
  return getAllDocPaths();
}

async function loadMDXFile(level: string, docPath: string): Promise<any> {
  const mdxPath = path.join(MDX_ROOT, level, `${docPath}.mdx`);
  const mdPath = path.join(MDX_ROOT, level, `${docPath}.md`);
  let fp = "";
  if (fs.existsSync(mdxPath)) fp = mdxPath;
  else if (fs.existsSync(mdPath)) fp = mdPath;
  else return null;

  const source = await readFile(fp, "utf-8");
  return compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkFlexibleToc],
        rehypePlugins: [rehypeSlug],
      },
    },
  });
}

export default async function DocPage({ params }: { params: { level: string; doc_path: string[] } }) {
  const docPath = params.doc_path.map(decodeURIComponent).join("/");
  const result = await loadMDXFile(params.level, docPath);
  if (!result) notFound();

  const title = (result.frontmatter.title as string) || params.doc_path[params.doc_path.length - 1];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <Link
        href={`/learn/${params.level}`}
        style={{ color: "#667eea", textDecoration: "none", fontSize: ".9rem" }}
      >
        ← 返回课程列表
      </Link>
      <article style={{ marginTop: "1rem", lineHeight: 1.8 }}>
        {result.content}
      </article>
    </div>
  );
}
