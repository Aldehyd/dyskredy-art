import Modal from "./modalClass";

export default class MobileMenuModal extends Modal {
    constructor(modal: string,controlButton: HTMLButtonElement | null,focusOnDisplay: string | HTMLElement) {
        super(modal,controlButton,focusOnDisplay);

        if(this.focusableElements) {
            this.lastFocusableElement = this.focusableElements[1];
        };
        
    }
}