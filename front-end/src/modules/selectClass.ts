
export default class Select {
    node: HTMLDivElement | null;
    isExpanded: boolean;
    listbox: HTMLUListElement| null | undefined;
    value: HTMLSpanElement | null | undefined;
    options: NodeListOf<HTMLLIElement> | null | undefined;
    activeDescendantElement: HTMLLIElement | null;
    activeDescendantId: string | null | undefined;

    constructor(select: string) {
        this.node = document.querySelector(`.${select}`);
        this.isExpanded = false;
        this.listbox = this.node?.querySelector('ul');
        this.value = this.node?.querySelector('span:first-child');
        this.options = this.listbox?.querySelectorAll('li');
        this.activeDescendantElement = this.options ? this.options[0] : null;
        this.activeDescendantId = this.activeDescendantElement?.getAttribute('Id');

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.expand = this.expand.bind(this);
        this.reduce = this.reduce.bind(this);
        this.setActiveItem = this.setActiveItem.bind(this);
        this.setAriaAttributes = this.setAriaAttributes.bind(this);

        this.node?.addEventListener('keydown',(e)=>this.handleKeyDown(e));
        this.node?.addEventListener('click',(e)=>this.handleClick(e));
        this.node?.addEventListener('blur',(e)=>{setTimeout(()=>{this.reduce()},200)});
    }

    handleChoice() {
    }

    handleKeyDown(e: KeyboardEvent) {
        let index: number = 0;
        if(this.options)
            if(this.activeDescendantElement)
                index = Array.from(this.options).indexOf(this.activeDescendantElement);
        if(this.options)
            switch(e.key) {
                case 'Enter':
                    e.preventDefault();
                    if(!this.isExpanded) {
                        this.expand();
                    } else {
                        if(this.options[index].getAttribute('aria-selected') === 'false') {
                            this.handleChoice();
                        };
                        this.reduce();
                    };
                    break;
                case ' ':
                    e.preventDefault();
                    if(!this.isExpanded) {
                        this.expand();
                    } else {
                        if(this.options[index].getAttribute('aria-selected') === 'false') {
                            this.handleChoice();
                        };
                        this.reduce();
                    };
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if(!this.isExpanded) {
                        this.expand();
                    } else {
                        if(index !== this.options.length-1) {
                            index++;
                        };
                    };
                    this.activeDescendantElement = this.options[index];
                    this.activeDescendantId = this.activeDescendantElement.getAttribute('id');
                    this.setActiveItem();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if(!this.isExpanded) {
                        this.expand();
                    } else {
                        if(index !== 0) {
                            index--;
                        };
                    };
                    this.activeDescendantElement = this.options[index];
                    this.activeDescendantId = this.activeDescendantElement.getAttribute('id');
                    this.setActiveItem();
                    break;
                case 'Escape':
                    this.reduce();
                    break;
                default:
                    break;
            };
    }

    handleClick(e: MouseEvent) {
        if(this.isExpanded) {
            if(this.activeDescendantElement) {
                this.reduce();
                if(this.listbox?.contains(e.target as Node)) {
                    this.activeDescendantElement = e.target as HTMLLIElement;
                    this.activeDescendantId = this.activeDescendantElement.getAttribute('id');
                    this.setActiveItem();

                    const element = e.target as HTMLElement;
                    if(element.getAttribute('aria-selected') === 'false') {
                        this.handleChoice();
                    };
                };
            };
        } else {
            this.expand();
        };
    }

    expand() {
        this.isExpanded = true;
        this.listbox?.classList.add('display');
        this.setActiveItem();
        this.setAriaAttributes();
    }

    reduce() {
        this.isExpanded = false;
        this.listbox?.classList.remove('display');
        this.setAriaAttributes();
    }

    setActiveItem() {
        this.activeDescendantElement?.classList.add('active-item');
        this.options?.forEach(option => {
            if(option !== this.activeDescendantElement) {
                option.classList.remove('active-item');
            };
        });
        this.setAriaAttributes();
    }

    setAriaAttributes() {
        if(this.isExpanded) {
            this.node?.setAttribute('aria-expanded','true');
        } else {
            this.node?.setAttribute('aria-expanded','false');
        };
        if(this.activeDescendantId)
            this.node?.setAttribute('aria-activedescendant',this.activeDescendantId);
    }
}