import { atom } from "nanostores";

export const $isOpen = atom<boolean>(false);

export function open() {
  $isOpen.set(true);
}

export function close() {
  $isOpen.set(false);
}

export function toggle() {
  const isOpen = $isOpen.get();
  $isOpen.set(!isOpen);
}
