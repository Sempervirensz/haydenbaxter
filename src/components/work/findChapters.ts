/* The live Work chapter elements, in order.
 *
 * Desktop (WorkSectionCinematic, >=1024px) tags each chapter with
 * `data-cstack-id`; mobile (WorkSectionMobile) renders the same four
 * `.work__chapter--detail` tracks untagged. Empty means Work has not mounted
 * yet — WorkSectionResponsive renders a bare `<section id="work">` until it has
 * measured the viewport and its dynamic import has landed.
 *
 * Extracted from StoryProgressSpine so the mobile scroll lab's landing
 * affordances scroll to exactly the same elements the spine does. Two copies of
 * this selector pair would drift the moment either branch changed its markup,
 * and the failure would be silent — a control that scrolls somewhere almost
 * right.
 */
export function findChapters(): HTMLElement[] {
  const tagged = Array.from(
    document.querySelectorAll<HTMLElement>("[data-cstack-id]")
  ).sort((a, b) => Number(a.dataset.cstackId) - Number(b.dataset.cstackId));
  if (tagged.length) return tagged;
  return Array.from(
    document.querySelectorAll<HTMLElement>("#work .work__chapter--detail")
  );
}
