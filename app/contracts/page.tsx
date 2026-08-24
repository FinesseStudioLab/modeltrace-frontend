import { Badge, EmptyState } from "@/components/ui";

export default function Page() {
  return (
    <section className="section">
      <Badge>Contracts</Badge>
      <h2>Contracts surface — product definition TBD.</h2>
      <EmptyState 
        title="Under Construction" 
        description="Scaffold page — replace with production content, data loaders, and analytics." 
      />
    </section>
  );
}

