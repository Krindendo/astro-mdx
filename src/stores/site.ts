import { atom } from "nanostores";

export interface Item {
  title: string;
  url: string;
  items?: Item[];
}

export interface Items {
  items?: Item[];
}

interface SidebarState {
  sections: Items;
  visibleSections: string[];
  sectionIds: string[];
}

export const $sections = atom<Items>({});
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
  if (newSections.items === undefined) {
    $sectionIds.set([]);
    return;
  }
  const sectionIds = newSections.items
    .flatMap((content) => [content.url, content.items?.map((item) => item.url)])
    .flat()
    .filter(Boolean)
    .map((id) => id?.split("#")[1]);

  $sectionIds.set(["_top", ...sectionIds] as string[]);
}
