// C-7 measuring state: unlit lamp + the literal word + the condition it waits on.
// Never a placeholder digit (D-P2-1).
export function Measuring({
  condition = "awaiting re-measure on the test device",
}: {
  condition?: string;
}) {
  return (
    <p className="stat__cond" aria-busy="true">
      <span className="lamp" aria-hidden="true" />
      measuring — {condition}
    </p>
  );
}
