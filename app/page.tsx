import { readdirSync, statSync } from "fs";
import { join } from "path";
import Link from "next/link";

const MDX_ROOT = join(process.cwd(), "mdx");

function getLevels(): string[] {
  return readdirSync(MDX_ROOT).filter(d => statSync(join(MDX_ROOT, d)).isDirectory());
}

export default function HomePage() {
  const levels = getLevels();
  const levelNames: Record<string, string> = { beginner: "入门", intermediate: "中级" };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: ".5rem" }}>Korean Studio</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>零基础学习韩语的互动平台</p>

      <div style={{ display: "grid", gap: "1rem" }}>
        {levels.map(level => (
          <Link
            key={level}
            href={`/learn/${level}`}
            style={{
              display: "block", padding: "1.5rem", borderRadius: "12px",
              background: "white", boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              textDecoration: "none", color: "inherit"
            }}
          >
            <h2 style={{ margin: "0 0 .25rem", fontSize: "1.3rem" }}>
              韩语{levelNames[level] || level}
            </h2>
            <p style={{ margin: 0, color: "#888", fontSize: ".9rem" }}>点击进入课程 →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
