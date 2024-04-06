
export default interface SelectInterface {
    node: HTMLDivElement | null;
    isExpanded: boolean;
    listbox: HTMLUListElement| null | undefined;
    value: HTMLSpanElement | null | undefined;
    options: NodeListOf<HTMLLIElement> | null | undefined;
    activeDescendantElement: HTMLLIElement | null;
    activeDescendantId: string | null | undefined;

    handleChoice(): void;
    handleKeyDown(e: KeyboardEvent): void;
    handleClick(e: MouseEvent): void;
    expand(): void;
    reduce(): void;
    setActiveItem(): void;
    setAriaAttributes(): void;
}