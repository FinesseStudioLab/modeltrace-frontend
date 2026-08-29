import { Address, Hash } from "@/components/address-hash";

// Synthetic but realistic-length values for the demo.
const CONTRACT_ID =
  "CBIELTK6YBZJU5UP2WWQEQDYCBV6ARSGXWC7KXFWOVMQNQIYUQHFZN3";
const TREASURY_ID =
  "GDQJUTQYK2MQX2ZJARTDFEFYMBPI7KXFVGATXHEWWGIMR3MG76BCBKD";
const TX_HASH =
  "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";

export default function ContractsPage() {
  return (
    <section className="section">
      <span className="tag">Contracts</span>
      <h2>Soroban contracts</h2>
      <p style={{ color: "var(--muted)", maxWidth: 640, marginTop: 0 }}>
        On-chain modules that power ModelTrace settlement, attestation, and
        escrow. Production addresses and interaction flows ship with the
        Soroban milestone.
      </p>

      {/* ── Component preview ── */}
      <div
        style={{
          marginTop: 32,
          padding: "22px 24px",
          borderRadius: 14,
          border: "1px solid color-mix(in srgb, var(--accent) 22%, transparent)",
          background:
            "linear-gradient(165deg, color-mix(in srgb, var(--surface) 92%, var(--bg)) 0%, var(--surface) 100%)",
        }}
      >
        <p
          className="tag"
          style={{ display: "inline-block", marginBottom: 16 }}
        >
          Address &amp; Hash primitives
        </p>
        <p style={{ color: "var(--muted)", fontSize: "var(--text-sm)", marginTop: 0, marginBottom: 20 }}>
          Every address and hash on this platform uses the shared{" "}
          <code style={{ fontSize: "inherit" }}>&lt;Address&gt;</code> /{" "}
          <code style={{ fontSize: "inherit" }}>&lt;Hash&gt;</code> component:
          truncated with both head and tail visible, copyable, and
          screen-reader-annotated with the full value.
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "var(--text-sm)",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  color: "var(--muted)",
                  fontWeight: 600,
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 25%, transparent)",
                  whiteSpace: "nowrap",
                }}
              >
                Label
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  color: "var(--muted)",
                  fontWeight: 600,
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 25%, transparent)",
                }}
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Address — no explorer link */}
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  color: "var(--muted)",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                  whiteSpace: "nowrap",
                }}
              >
                Attestation contract
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                }}
              >
                <Address value={CONTRACT_ID} />
              </td>
            </tr>

            {/* Address — with explorer link */}
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  color: "var(--muted)",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                  whiteSpace: "nowrap",
                }}
              >
                Treasury (testnet)
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                }}
              >
                <Address
                  value={TREASURY_ID}
                  explorerHref={`https://stellar.expert/explorer/testnet/account/${TREASURY_ID}`}
                />
              </td>
            </tr>

            {/* Transaction hash */}
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  color: "var(--muted)",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                  whiteSpace: "nowrap",
                }}
              >
                Last settlement tx
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                }}
              >
                <Hash
                  value={TX_HASH}
                  explorerHref={`https://stellar.expert/explorer/testnet/tx/${TX_HASH}`}
                />
              </td>
            </tr>

            {/* Missing-value fallback */}
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  color: "var(--muted)",
                  whiteSpace: "nowrap",
                }}
              >
                Escrow contract
              </td>
              <td style={{ padding: "10px 12px" }}>
                {/* Intentionally null — component renders the safe fallback */}
                <Address value={null} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
