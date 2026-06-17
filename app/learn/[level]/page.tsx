import { readdirSync, statSync } from "fs";
import { join, basename } from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

const MDX_ROOT = join(process.cwd(), "mdx");

function getMdxFiles(level: string): { name: string; path: string; category: string }[] {
  const dir = join(MDX_ROOT, level);
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return [];

  const results: { name: string; path: string; category: string }[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isFile() && (entry.endsWith(".mdx") || entry.endsWith(".md"))) {
      results.push({ name: basename(entry, /\.(mdx|md)$/), path: entry, category: "" });
    } else if (statSync(full).isDirectory()) {
      const subFiles = readdirSync(full).filter(f => f.endsWith(".mdx") || f.endsWith(".md"));
      for (const sf of subFiles) {
        results.push({ name: basename(sf, /\.(mdx|md)$/), path: join(entry, sf), category: entry });
      }
    }
  }
  return results;
}

export function generateStaticParams() {
  const levels = readdirSync(MDX_ROOT).filter(d => statSync(join(MDX_ROOT, d)).isDirectory());
  return levels.map(level => ({ level }));
}

export default function LevelPage({ params }: { params: { level: string } }) {
  const files = getMdxFiles(params.level);
  if (files.length === 0) notFound();

  const levelNames: Record<string, string> = { beginner: "入门", intermediate: "中级" };
  const categories = [...new Set(files.map(f => f.category))];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <Link href="/" style={{ color: "#667eea", textDecoration: "none", fontSize: ".9rem" }}>← 返回首页</Link>
      <h1 style={{ fontSize: "2rem", margin: "1rem 0 .5rem" }}>
        韩语{levelNames[params.level] || params.level}
      </h1>

      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: "2rem" }}>
          {cat ? <h2 style={{ fontSize: "1.1rem", color: "#444", margin: "1.5rem 0 .75rem" }}>{cat}</h2> : null}
          <div style={{ display: "grid", gap: ".5rem" }}>
            {files.filter(f => f.category === cat).map(f => (
              <Link
                key={f.path}
                href={`/learn/${params.level}/${f.path.replace(/\.(mdx|md)$/, "")}`}
                style={{
                  display: "block", padding: ".75rem 1rem", borderRadius: "8px",
                  background: "white", boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                  textDecoration: "none", color: "inherit"
                }}
              >
                <span style={{ color: "#333" }}>{f.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
