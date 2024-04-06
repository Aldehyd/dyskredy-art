import LanguageModalInterface from './models/languageModalInterface';
import LanguageSelectInterface from './models/languageSelectInterface';
import Select from './selectClass';

export default class LanguageSelect extends Select implements LanguageSelectInterface {
    languageModal: LanguageModalInterface;

    constructor(select: string,languageModal: LanguageModalInterface) {
        super(select);
        this.languageModal = languageModal;

        this.handleChoice = this.handleChoice.bind(this);
    }
    handleChoice() {
        this.languageModal.languageToConfirm = this.activeDescendantId;
        this.languageModal.setDisplay();
    }
}