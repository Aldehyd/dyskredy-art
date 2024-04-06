
export default interface SlideInterface {
    language: string | null;
    topFocusTrapping: HTMLDivElement | null;
    bottomFocusTrapping: HTMLDivElement | null;
    node: HTMLElement | null;
    section: HTMLElement;
    pictures: NodeListOf<HTMLElement>;
    closeButton: HTMLElement | null | undefined;
    rightButton: HTMLElement | null | undefined;
    leftButton: HTMLElement | null | undefined;
    individualButtons: HTMLElement[] | undefined;
    slideContainer: HTMLElement | null | undefined;
    individualButtonsContainer: HTMLElement | null | undefined;
    picturesViews: HTMLElement[];
    currentPicture: HTMLElement | undefined;
    indexCurrentPicture: number | undefined;

    initialize(): void;
    handleLeftButton(): void;
    handleRightButton(): void;
    handleIndividualButtons(button: HTMLElement): void;
    handleKeyDown(e: KeyboardEvent): void;
    setCurrentPicture(): void;
    setAriaLabel(): void;
    setCurrentIndividualButton(): void;
    open(picture: HTMLElement): void;
    close(): void;
    handleTopFocusTrapping(): void;
    handleBottomFocusTrapping(): void;
}