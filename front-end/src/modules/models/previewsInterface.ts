import AccessibilityInterface from "./accessibilityInterface";

export default interface PreviewsInterface {
    accessibility: AccessibilityInterface;
    previews: NodeListOf<HTMLAnchorElement> | undefined;
    previewHeadings: NodeListOf<HTMLElement> | undefined;
    previewPictures: NodeListOf<HTMLElement> | undefined;
    offsets: {[key: string]: number;};

    handleAppear(): void;
    handleFocus(preview: HTMLAnchorElement): void;
}