
export default interface ModalInterface {
    node: HTMLDivElement | null;
    display: boolean;
    controlButton: HTMLElement | null;
    topFocusTrapping: HTMLDivElement | null;
    bottomFocusTrapping: HTMLDivElement | null;
    focusableElements: NodeListOf<HTMLElement> | undefined;
    firstFocusableElement: HTMLElement | null;
    lastFocusableElement: HTMLElement | null;
    focusOnDisplay: string | HTMLElement | null;

    setDisplay(): void;
    handleTopFocusTrapping(): void;
    handleBottomFocusTrapping(): void;
    handleKeyDown(e: KeyboardEvent): void;
}