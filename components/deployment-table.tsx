import { CONTRACT_META, DEPLOYMENTS, type NetworkDeployments } from "../app/contracts/deployments";

/**
 * The deployed-address table for the contracts page.
 *
 * Every value is read from the deployment registry (`DEPLOYMENTS`), never
 * hardcoded in JSX. Until the contracts repo publishes its registry the
 * address and WASM-hash cells render an honest "not yet deployed" state; the
 * moment a real address exists it becomes an explorer link, so the page goes
 * live by editing data, not markup.
 */
export function DeploymentTable({
  networks = DEPLOYMENTS,
}: {
  networks?: NetworkDeployments[];
}) {
  return (
    <div className="deploy-table">
      {networks.map((network) => (
        <section key={network.network} className="deploy-network">
          <h3 className="deploy-network-title">{network.label}</h3>
          <div style={{ overflowX: "auto", minWidth: 0 }}>
            <table className="deploy-grid">
              <thead>
                <tr>
                  <th scope="col">Contract</th>
                  <th scope="col">Address</th>
                  <th scope="col">WASM hash</th>
                  <th scope="col">Built from</th>
                  <th scope="col">Deployed</th>
                </tr>
              </thead>
              <tbody>
                {network.contracts.map((contract) => {
                  const meta = CONTRACT_META[contract.slug];
                  const explorerLink = contract.address
                    ? `${network.explorerUrl}${contract.address}`
                    : null;

                  return (
                    <tr key={contract.slug}>
                      <td>
                        <span className="deploy-contract">{meta.name}</span>
                        <span className="deploy-role">{meta.role}</span>
                      </td>
                      <td>
                        {explorerLink ? (
                          <a
                            className="deploy-address"
                            href={explorerLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {contract.address}
                          </a>
                        ) : (
                          <span className="deploy-pending">Not yet deployed</span>
                        )}
                      </td>
                      <td>
                        {contract.wasmHash ? (
                          <code className="deploy-hash">{contract.wasmHash}</code>
                        ) : (
                          <span className="deploy-pending">Pending</span>
                        )}
                      </td>
                      <td>
                        {contract.commit ? (
                          <code className="deploy-hash">{contract.commit.slice(0, 7)}</code>
                        ) : (
                          <span className="deploy-pending">—</span>
                        )}
                      </td>
                      <td>
                        {contract.deployedAt ? (
                          <span>{new Date(contract.deployedAt).toISOString().slice(0, 10)}</span>
                        ) : (
                          <span className="deploy-pending">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
