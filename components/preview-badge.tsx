import { isPreview, resolveNetwork } from "@/lib/deploy-env";

/**
 * Marks a preview deployment as one, so a reviewer or a stakeholder handed a
 * link cannot mistake it for the live site. Renders nothing anywhere else.
 */
export function PreviewBadge() {
  if (!isPreview()) return null;

  return (
    <div className="preview-badge" role="status">
      <strong>Preview build</strong>
      <span>
        Not production — pointed at {resolveNetwork()} and staging services.
      </span>
    </div>
  );
}
