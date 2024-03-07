import { atom } from "nanostores";

export interface Item {
  text: string;
  slug: string;
  depth: number;
}

interface SidebarState {
  sections: Item[];
  visibleSections: string[];
  sectionIds: string[];
}

export const $sections = atom<Item[]>([]);
export const $visibleSections = atom<string[]>([]);
export const $sectionIds = atom<string[]>([]);

export function setSections(sections: SidebarState["sections"]) {
  $sections.set(sections);
}

export function setVisibleSections(
  visibleSections: SidebarState["visibleSections"]
) {
  $visibleSections.set(visibleSections);
}

export function updateVisibleSection(id: string) {
  const visibleSections = $visibleSections.get();
  const sectionIds = $sectionIds.get();

  const sectionIndex = visibleSections.findIndex((section) => section === id);

  if (sectionIndex !== -1) {
    return;
  }

  const index = sectionIds.findIndex((item) => item === id);

  const firstIndex = sectionIds.findIndex(
    (item) => item === visibleSections[0]
  );

  if (index === -1) {
    return;
  }

  if (index < firstIndex) {
    $visibleSections.set([id, ...visibleSections]);
    return;
  }

  $visibleSections.set([...visibleSections, id]);
}

export function removeVisibleSection(id: string) {
  $visibleSections.set($visibleSections.get().filter((s) => s !== id));
}

export function setSectionIds(newSections: SidebarState["sections"]) {
  if (newSections === undefined) {
    $sectionIds.set([]);
    return;
  }
  const sectionIds = newSections
    .filter((content) => content.depth < 3)
    .map((content) => content.slug);

  $sectionIds.set(["_top", ...sectionIds] as string[]);
}

export function injectToc(items: Item[]) {
  setSections(items);
  setSectionIds(items);
  setVisibleSections([]);
}
