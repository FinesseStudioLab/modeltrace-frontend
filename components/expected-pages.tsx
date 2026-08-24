import { Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui";

export function ExpectedPages() {
  return (
    <section className="section site-map" id="site-map">
      <Badge>Site map</Badge>
      <h2 className="mt-12">Expected pages (delivery backlog)</h2>
      <p className="text-muted-max-62">
        This table is the contract between product and engineering. Routes marked scaffold ship as
        placeholders; planned routes are tracked for sprint planning.
      </p>
      <div className="mt-16">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow key="/">
              <TableCell><code>/</code></TableCell>
              <TableCell>Marketing hub + site map</TableCell>
              <TableCell><Badge variant="neutral">Scaffold</Badge></TableCell>
            </TableRow>
            <TableRow key="/product">
              <TableCell><code>/product</code></TableCell>
              <TableCell>Personas, pricing hooks, integration story</TableCell>
              <TableCell><Badge variant="success">Planned</Badge></TableCell>
            </TableRow>
            <TableRow key="/contracts">
              <TableCell><code>/contracts</code></TableCell>
              <TableCell>Soroban modules and interaction flows</TableCell>
              <TableCell><Badge variant="success">Planned</Badge></TableCell>
            </TableRow>
            <TableRow key="/operators">
              <TableCell><code>/operators</code></TableCell>
              <TableCell>Dashboard preview for AI gateways</TableCell>
              <TableCell><Badge variant="success">Planned</Badge></TableCell>
            </TableRow>
            <TableRow key="/compliance">
              <TableCell><code>/compliance</code></TableCell>
              <TableCell>Audit exports and policy packs</TableCell>
              <TableCell><Badge variant="success">Planned</Badge></TableCell>
            </TableRow>
            <TableRow key="/roadmap">
              <TableCell><code>/roadmap</code></TableCell>
              <TableCell>Milestones vs grants</TableCell>
              <TableCell><Badge variant="neutral">Scaffold</Badge></TableCell>
            </TableRow>
            <TableRow key="/contributors">
              <TableCell><code>/contributors</code></TableCell>
              <TableCell>Good first issues and guild roles</TableCell>
              <TableCell><Badge variant="success">Planned</Badge></TableCell>
            </TableRow>
            <TableRow key="/docs">
              <TableCell><code>/docs</code></TableCell>
              <TableCell>Technical reference hub</TableCell>
              <TableCell><Badge variant="neutral">Scaffold</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

