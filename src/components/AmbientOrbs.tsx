/**
 * Site-wide ambient backdrop: large blurred brand-color orbs drifting slowly
 * behind every section. Fixed + pointer-events-none; the global reduced-motion
 * media query freezes them for users who prefer it.
 */
export default function AmbientOrbs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
    </div>
  );
}
