/**
 * The attest → meter → settle flow, drawn with the app's own tokens so it
 * follows whatever theme is active (the site is dark today; if a light theme
 * is added, every colour here is a `var()` or a `color-mix` of one, so the
 * diagram stays legible without edits).
 *
 * The canvas is decorative to screen readers (`role="img"` + aria-label); the
 * ordered list below it is the real content and carries the flow in words.
 */
export function FlowDiagram() {
  return (
    <figure className="flow">
      <div
        className="flow-canvas"
        role="img"
        aria-label="Three stages: attestation writes a signed inference event to the Audit Registry, metering prices it into billable units in the Usage Meter, and settlement releases escrowed payout through the Payment Router. A dispute window loops settlement back to re-open the attestation."
      >
        <div className="flow-node flow-node-attest">
          <strong className="flow-stage">Attest</strong>
          <span className="flow-name">Audit Registry</span>
          <span className="flow-note">cheap · frequent</span>
        </div>
        <span className="flow-arrow" aria-hidden="true">→</span>
        <div className="flow-node flow-node-meter">
          <strong className="flow-stage">Meter</strong>
          <span className="flow-name">Usage Meter</span>
          <span className="flow-note">priced · quota-gated</span>
        </div>
        <span className="flow-arrow" aria-hidden="true">→</span>
        <div className="flow-node flow-node-settle">
          <strong className="flow-stage">Settle</strong>
          <span className="flow-name">Payment Router</span>
          <span className="flow-note">conservative · rare</span>
        </div>
        <div className="flow-loop" aria-hidden="true">
          <span>dispute window reopens the attestation</span>
        </div>
      </div>
      <figcaption className="flow-caption">
        One inference, three contracts: the event is attested, priced, and only
        then settled — with a dispute window between money moving and the case
        closing.
      </figcaption>
      <ol className="flow-steps">
        <li>
          The gateway signs an inference event — model version, policy ref,
          timestamp, submitter — and the <strong>Audit Registry</strong> stores
          it. Append-only, cheap, safe to call on every request.
        </li>
        <li>
          The <strong>Usage Meter</strong> reads attestations and prices them
          against the customer&apos;s tier and quota, producing billable units.
          No funds move here.
        </li>
        <li>
          The <strong>Payment Router</strong> escrows the settlement and opens a
          dispute window. When the window closes uncontested, it releases the
          payout; a dispute reopens the attestation for review.
        </li>
      </ol>
    </figure>
  );
}
