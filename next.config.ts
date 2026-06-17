import withMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./app/i18n.ts");

const nextConfig = {
  output: "export" as const,
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

export default withNextIntl(withMDX()(nextConfig));
