import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import type { MetadataOptions } from "sap/ui/base/ManagedObject";
import Button from "sap/m/Button";
import { ButtonType } from "sap/m/library";
import includeStylesheet from "sap/ui/dom/includeStylesheet";
import DOMPurify from "dompurify";

// The control brings its own stylesheet instead of relying on the host app to
// register it; the id dedupes if the module is loaded more than once.
includeStylesheet(
	sap.ui.require.toUrl("sapmarco/projectpages/control/Markdown.css"),
	"sapmarco-projectpages-control-Markdown",
);

/**
 * Renders a pre-converted markdown HTML string into the DOM using the
 * apiVersion 4 RenderManager. The HTML is produced by the markdown service and
 * injected via {@link sap.ui.core.RenderManager#unsafeHtml}. When
 * {@link #getSanitize sanitize} is set (the default), the HTML is run through
 * DOMPurify first. Each rendered `<pre>` code block gains a themed
 * {@link sap.m.Button} that copies the code via the browser-native Clipboard
 * API.
 *
 * @namespace sapmarco.projectpages.control
 */
export default class Markdown extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			content: { type: "string", defaultValue: "" },
			sanitize: { type: "boolean", defaultValue: true },
			copyCodeTooltip: { type: "string", defaultValue: "Copy to clipboard" },
			copyCodeCopiedText: { type: "string", defaultValue: "Copied!" },
		},
		aggregations: {
			// The per-code-block copy buttons. Hidden: they are an implementation
			// detail rendered into the code blocks in onAfterRendering, not part of
			// the control's public settings interface. Holding them here lets the
			// framework destroy them with the control.
			_copyButtons: {
				type: "sap.m.Button",
				multiple: true,
				visibility: "hidden",
			},
		},
	};

	declare getContent: () => string;
	declare setContent: (content: string) => this;
	declare getSanitize: () => boolean;
	declare setSanitize: (sanitize: boolean) => this;
	declare getCopyCodeTooltip: () => string;
	declare setCopyCodeTooltip: (copyCodeTooltip: string) => this;
	declare getCopyCodeCopiedText: () => string;
	declare setCopyCodeCopiedText: (copyCodeCopiedText: string) => this;

	// Each copy button keeps at most one pending "revert to the copy icon" timer;
	// track them so a re-render or a destroy can cancel timers still in flight.
	// The buttons themselves live in the hidden _copyButtons aggregation.
	private _revertTimers = new Map<Button, ReturnType<typeof setTimeout>>();

	static renderer = {
		apiVersion: 4,
		render(rm: RenderManager, control: Markdown): void {
			const content = control.getContent();
			rm.openStart("div", control);
			rm.class("wikiMarkdown");
			rm.openEnd();
			rm.unsafeHtml(
				control.getSanitize()
					? // keep the new-tab links emitted by the markdown service; their
						// rel="noopener noreferrer" already neutralises tab-nabbing
						DOMPurify.sanitize(content, { ADD_ATTR: ["target"] })
					: content,
			);
			rm.close("div");
		},
	};

	// Destroy the previous buttons (and cancel their timers) before the renderer
	// rewrites the code blocks, so no button outlives the DOM it was placed into.
	onBeforeRendering(): void {
		this._clearRevertTimers();
		this.destroyAggregation("_copyButtons", true);
	}

	onAfterRendering(): void {
		const dom = this.getDomRef();
		// Without the Clipboard API a copy button would be a dead affordance, so
		// only add it when the browser can service it (a secure context).
		if (!dom || !navigator.clipboard?.writeText) {
			return;
		}

		const copyLabel = this.getCopyCodeTooltip();
		const copiedLabel = this.getCopyCodeCopiedText();

		// Render the buttons into each code block through the control's own
		// RenderManager, so they belong to this control's DOM and aggregation
		// tree (destroyed with it) rather than each spawning a standalone UIArea
		// the way placeAt would — which leaks one detached UIArea per re-render.
		// @ts-expect-error RenderManager's constructor is typed protected; apps
		// historically obtained one via the now-deprecated Core#createRenderManager,
		// and direct instantiation is its supported replacement.
		const rm = new RenderManager();
		dom.querySelectorAll("pre").forEach((pre, index) => {
			const wrapper = document.createElement("div");
			wrapper.className = "wikiCodeBlock";
			pre.parentNode.insertBefore(wrapper, pre);
			wrapper.appendChild(pre);

			const button = new Button(`${this.getId()}-copy-${index}`, {
				icon: "sap-icon://copy",
				type: ButtonType.Transparent,
				tooltip: copyLabel,
			});
			button.addStyleClass("wikiCopyButton");
			button.attachPress(() => this._copyCode(pre, button, copyLabel, copiedLabel));
			this.addAggregation("_copyButtons", button, true);
			rm.render(button, wrapper);
		});
		rm.destroy();
	}

	exit(): void {
		// The framework destroys the hidden _copyButtons aggregation with the
		// control; only the pending revert timers need clearing here.
		this._clearRevertTimers();
	}

	private _copyCode(pre: HTMLElement, button: Button, copyLabel: string, copiedLabel: string): void {
		// Drop the single trailing newline marked appends to every code block, so
		// pasting does not add a spurious blank line.
		const code = (pre.querySelector("code")?.textContent ?? pre.textContent ?? "").replace(/\n$/, "");
		void navigator.clipboard.writeText(code).then(
			() => {
				// The write can resolve after a re-render destroyed this button;
				// mutating it then would re-arm a timer on a dead control.
				if (button.isDestroyed()) {
					return;
				}
				// Accept is the standard positive button styling; swapping to it
				// (with the accept icon) is the copied confirmation.
				button.setType(ButtonType.Accept);
				button.setIcon("sap-icon://accept");
				button.setTooltip(copiedLabel);
				const pending = this._revertTimers.get(button);
				if (pending) {
					clearTimeout(pending);
				}
				this._revertTimers.set(
					button,
					setTimeout(() => {
						button.setType(ButtonType.Transparent);
						button.setIcon("sap-icon://copy");
						button.setTooltip(copyLabel);
						this._revertTimers.delete(button);
					}, 1500),
				);
			},
			() => {
				/* clipboard write rejected (e.g. denied permission) — no-op */
			},
		);
	}

	private _clearRevertTimers(): void {
		this._revertTimers.forEach((timer) => clearTimeout(timer));
		this._revertTimers.clear();
	}
}
