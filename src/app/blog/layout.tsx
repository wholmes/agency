import BlogThemeProvider from "@/components/blog/BlogThemeProvider";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <BlogThemeProvider>
      {children}
    </BlogThemeProvider>
  );
}
