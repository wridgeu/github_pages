import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Markdown" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MarkdownSettings extends $ControlSettings {
        content?: string | PropertyBindingInfo;
        copyCodeTooltip?: string | PropertyBindingInfo;
        copyCodeCopiedText?: string | PropertyBindingInfo;
    }

    export default interface Markdown {

        // property: content
        getContent(): string;
        setContent(content: string): this;

        // property: copyCodeTooltip
        getCopyCodeTooltip(): string;
        setCopyCodeTooltip(copyCodeTooltip: string): this;

        // property: copyCodeCopiedText
        getCopyCodeCopiedText(): string;
        setCopyCodeCopiedText(copyCodeCopiedText: string): this;
    }
}
