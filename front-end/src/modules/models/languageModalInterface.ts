import ModalInterface from "./modalInterface";

export default interface LanguageModalInterface extends ModalInterface {
    languageToConfirm: string | null | undefined;
    confirmButton: HTMLButtonElement | null | undefined;
    noButton: HTMLButtonElement | null;

    confirm(): void;
}
