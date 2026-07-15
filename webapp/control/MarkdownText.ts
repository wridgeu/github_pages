import Control from "sap/ui/core/Control";
import type RenderManager from "sap/ui/core/RenderManager";
import type { MetadataOptions } from "sap/ui/base/ManagedObject";
import DOMPurify from "dompurify";

/**
 * Renders a pre-converted markdown HTML string into the DOM using the
 * apiVersion 4 RenderManager. The HTML is produced by the markdown service and
 * injected via {@link sap.ui.core.RenderManager#unsafeHtml}. When
 * {@link #getSanitize sanitize} is set (the default), the HTML is run through
 * DOMPurify first.
 *
 * @namespace sapmarco.projectpages.control
 */
export default class MarkdownText extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			content: { type: "string", defaultValue: "" },
			sanitize: { type: "boolean", defaultValue: true }
		}
	};

	declare getContent: () => string;
	declare setContent: (content: string) => this;
	declare getSanitize: () => boolean;
	declare setSanitize: (sanitize: boolean) => this;

	static renderer = {
		apiVersion: 4,
		render(rm: RenderManager, control: MarkdownText): void {
			const content = control.getContent();
			rm.openStart("div", control);
			rm.class("wikiMarkdown");
			rm.openEnd();
			rm.unsafeHtml(
				control.getSanitize()
					// keep the new-tab links emitted by the markdown service; their
					// rel="noopener noreferrer" already neutralises tab-nabbing
					? DOMPurify.sanitize(content, { ADD_ATTR: ["target"] })
					: content
			);
			rm.close("div");
		}
	};
}
