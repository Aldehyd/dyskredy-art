
export default interface FormInterface {
    node: HTMLElement | null;
    language: string | null;
    fields: NodeListOf<HTMLElement> | undefined;
    requiredFields: NodeListOf<HTMLElement> | undefined;
    invalidFieldsAlerts: NodeListOf<HTMLElement> | undefined;
    submitButton: HTMLElement | null | undefined;
    pageTitleElement: HTMLElement | null;
    pageTitleText: string | undefined;
    isReadyToSubmit: boolean;
    successMessage: HTMLElement | null | undefined;
    submitErrorMessage: HTMLElement | null | undefined;
    invalidFieldsMainAlert: HTMLElement | null | undefined;
    invalidCaptchaMainAlert: HTMLElement | null | undefined;

    checkRequiredFields():void;
    applyEffect(): void;
    setSuccessForm(): void;
    setFailForm(): void;
    cleanMainErrorMessages(): void;
    cleanInvalidFields(): void;
    resetForm(): void;
}