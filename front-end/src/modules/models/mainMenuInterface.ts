import { ShortcutsType } from "./shortcutsType";
import SubMenuInterface from "./subMenuInterface";

export default interface MainMenuInterface {
    node: HTMLElement | null;
    mainLinks: NodeListOf<HTMLAnchorElement> | undefined;
    mainLinksShortcuts: ShortcutsType;
    subMenus: SubMenuInterface[];
    autoDisplaySubMenus: boolean;

    handleFocusOnMainLink(link: HTMLAnchorElement | null): void;
    handleMouseOverMainLink(line: HTMLElement | null): void;
    handleMouseOutMainLink(line: HTMLElement | null): void;
    closeSubMenu(submenu: SubMenuInterface): void;
    openSubMenu(submenu: SubMenuInterface): void;
    handleKeyDown(e: KeyboardEvent): void;
}