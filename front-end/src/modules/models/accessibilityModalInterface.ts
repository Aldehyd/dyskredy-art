import AccessibilityInterface from "./accessibilityInterface";
import ModalInterface from "./modalInterface";

export default interface AccessibilityModalInterface extends ModalInterface {
    accessibility: AccessibilityInterface;
    accessibilityList: HTMLUListElement | null | undefined;
    switchLines: NodeListOf<HTMLButtonElement> | undefined;
    switches: NodeListOf<HTMLButtonElement> | undefined;
    policeOptions: NodeListOf<HTMLInputElement> | undefined;
    slider: {
        container: HTMLDivElement | null;
        rail: HTMLDivElement | null| undefined;
        thumb: HTMLDivElement | null;
    };

    onModalOpen(): void;
    handleMouseMove(e: MouseEvent): void;
    handleClick(e: MouseEvent): void;
}