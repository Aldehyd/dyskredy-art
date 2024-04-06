export default interface AccessibilityInterface {
    initialize: boolean;
    accessibilityList: HTMLUListElement | null;
    accessibilityListScrollTop: number | undefined;
    style: string;
    styleSwitch: HTMLButtonElement | null;
    styleSwitchMobile: HTMLButtonElement | null;
    isAnimations: boolean;
    siteAnimations: string;
    systemAnimations: boolean;
    animationsSwitch: HTMLButtonElement | null;
    initialFontSize: number;
    fontSize: number;
    fontSizeMax: number;
    slider: { 
                container: HTMLDivElement | null;
                rail: HTMLDivElement | null | undefined;
                thumb: HTMLDivElement | null;
            };
    sliderOffsetTop: number | undefined;
    isMouseDown: boolean;
    police: string;
    policeOptions: NodeListOf<HTMLInputElement>;
    policeRoboto: HTMLElement | null | undefined;
    policeOpenDyslexic: HTMLElement | null | undefined;
    pMarginBottom: string;
    pMarginBottomSwitch: HTMLButtonElement | null;
    styledElements: NodeList;
    lineHeight: string;
    lineHeightSwitch: HTMLButtonElement | null;
    wordSpacing: string;
    wordSpacingSwitch: HTMLButtonElement | null;
    letterSpacing: string;
    letterSpacingSwitch: HTMLButtonElement | null;
    
    switchStyle(): void;
    switchAnimations(): void;
    computeFontSizeFromMouse(e: MouseEvent): void;
    computeFontSizeFromKeyboard(e: KeyboardEvent): void;
    setFontSize(): void;
    handleSliderThumbPosition(): void;
    keepSliderPositionFixed(): void;
    setPolice(e?: MouseEvent): void;
    switchPMarginBottom(): void;
    switchLineHeight(): void;
    switchWordSpacing(): void;
    switchLetterSpacing(): void;
    handleFooter(): void;
    handleCharacters(): void;
    
}