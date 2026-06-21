/* TEMPORARY BIRTHDAY PAGE: remove after Kemmerlee's birthday.
   The adventure pass is a single designed artwork. A real, tappable Mission
   Coordinates link rides just beneath it so the destination is actionable. */

const COORDS_URL =
  "https://tickets.clarkplanetarium.org/WebStore/Shop/ViewItems.aspx?CG=11&C=438";

export default function Pass() {
  return (
    <div className="bk-pass">
      <img
        className="bk-pass__art"
        src="/images/kemmerlee-pass.png"
        alt="Kemmerlee's Birthday Planetarium Adventure pass. Happy 8th Birthday, Kemmerlee Bea Parkinson. Admit one birthday explorer. Destination: Clark Planetarium. Mission: DOME Encounters in the Milky Way, narrated by Pedro Pascal. Birthday mission note: no food or drink is allowed in the DOME theatre."
        width={1024}
        height={1536}
      />
      <a
        className="bk-pass__coords"
        href={COORDS_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Mission Coordinates
      </a>
    </div>
  );
}
