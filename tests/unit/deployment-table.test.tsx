import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DeploymentTable } from "../../components/deployment-table";
import { DEPLOYMENTS } from "../../app/contracts/deployments";

describe("DeploymentTable", () => {
  it("renders every network from the registry with the three contracts", () => {
    render(<DeploymentTable />);

    for (const network of DEPLOYMENTS) {
      const heading = screen.getByRole("heading", { name: network.label });
      const table = heading.closest("section") as HTMLElement;
      expect(within(table).getByText("Audit Registry")).toBeInTheDocument();
      expect(within(table).getByText("Usage Meter")).toBeInTheDocument();
      expect(within(table).getByText("Payment Router")).toBeInTheDocument();
    }
  });

  it("shows the honest pending state while nothing is deployed", () => {
    render(<DeploymentTable />);

    // Until the deployment registry lands, every address cell must say so
    // instead of showing a value that cannot be verified.
    const pending = screen.getAllByText("Not yet deployed");
    expect(pending.length).toBe(DEPLOYMENTS.length * 3);
  });

  it("turns a real address into an explorer link", () => {
    const address = "CB7XBJUIZVL3KIT2HUYQATIKOJCNXYPBTDQZ3MZQBZ6WCTUVDPVTTU7U";
    render(
      <DeploymentTable
        networks={[
          {
            network: "testnet",
            label: "Testnet",
            explorerUrl: "https://stellar.expert/explorer/testnet/contract/",
            contracts: [
              { slug: "audit-registry", address, wasmHash: null, commit: null, deployedAt: null },
              { slug: "usage-meter", address: null, wasmHash: null, commit: null, deployedAt: null },
              { slug: "payment-router", address: null, wasmHash: null, commit: null, deployedAt: null },
            ],
          },
        ]}
      />
    );

    const link = screen.getByRole("link", { name: address });
    expect(link).toHaveAttribute(
      "href",
      `https://stellar.expert/explorer/testnet/contract/${address}`
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("publishes the WASM hash next to the address", () => {
    const wasmHash = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";
    render(
      <DeploymentTable
        networks={[
          {
            network: "mainnet",
            label: "Mainnet",
            explorerUrl: "https://stellar.expert/explorer/public/contract/",
            contracts: [
              { slug: "audit-registry", address: null, wasmHash, commit: "abc1234", deployedAt: "2026-08-24T00:00:00Z" },
              { slug: "usage-meter", address: null, wasmHash: null, commit: null, deployedAt: null },
              { slug: "payment-router", address: null, wasmHash: null, commit: null, deployedAt: null },
            ],
          },
        ]}
      />
    );

    const table = screen.getByRole("table");
    expect(within(table).getByText(wasmHash)).toBeInTheDocument();
    expect(within(table).getByText("abc1234")).toBeInTheDocument();
  });
});
