import SelectInterface from "./selectInterface";
import LanguageModalInterface from "./languageModalInterface";

export default interface LanguageSelectInterface extends SelectInterface {
    languageModal: LanguageModalInterface;

    handleChoice(): void;
}