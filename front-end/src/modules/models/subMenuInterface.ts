import { ShortcutsType } from "./shortcutsType";

export default interface SubMenuInterface {
    node: Element | null;
    controlLink: HTMLAnchorElement | null;
    links: NodeListOf<HTMLAnchorElement>;
    isExpanded: boolean;
    shortcuts: ShortcutsType;
}

