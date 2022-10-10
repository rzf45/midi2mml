import { HTMLObject } from "./types";

export function spawnModal() {
  const modalContainer = document.querySelector<HTMLDivElement>('#modal-container');

  const modalBackdrop = document.createElement('div');
  modalBackdrop.classList.add('modal-backdrop');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const htmlObj: HTMLObject = {
    tag: "div",
    onAttr(element: HTMLDivElement) {
      
    },
    child: ""
  };
}
