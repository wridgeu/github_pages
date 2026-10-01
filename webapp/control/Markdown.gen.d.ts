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

        /**
         * Gets current value of property "content".
         *
         * Default value is: ""
         * @returns Value of property "content"
         */
        getContent(): string;

        /**
         * Sets a new value for property "content".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [content=""] New value for property "content"
         * @returns Reference to "this" in order to allow method chaining
         */
        setContent(content: string): this;

        // property: copyCodeTooltip

        /**
         * Gets current value of property "copyCodeTooltip".
         *
         * Default value is: "Copy to clipboard"
         * @returns Value of property "copyCodeTooltip"
         */
        getCopyCodeTooltip(): string;

        /**
         * Sets a new value for property "copyCodeTooltip".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: "Copy to clipboard"
         * @param [copyCodeTooltip="Copy to clipboard"] New value for property "copyCodeTooltip"
         * @returns Reference to "this" in order to allow method chaining
         */
        setCopyCodeTooltip(copyCodeTooltip: string): this;

        // property: copyCodeCopiedText

        /**
         * Gets current value of property "copyCodeCopiedText".
         *
         * Default value is: "Copied!"
         * @returns Value of property "copyCodeCopiedText"
         */
        getCopyCodeCopiedText(): string;

        /**
         * Sets a new value for property "copyCodeCopiedText".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: "Copied!"
         * @param [copyCodeCopiedText="Copied!"] New value for property "copyCodeCopiedText"
         * @returns Reference to "this" in order to allow method chaining
         */
        setCopyCodeCopiedText(copyCodeCopiedText: string): this;
    }
}
