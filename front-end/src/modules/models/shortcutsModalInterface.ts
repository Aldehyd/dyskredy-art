import ModalInterface from "./modalInterface.js";

export default interface ShortcutsModalInterface extends ModalInterface {
    elementToFocusOnClose: HTMLElement | null;
}