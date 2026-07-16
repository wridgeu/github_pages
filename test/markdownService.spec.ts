import { test, expect } from "@playwright/test";
import hljs from "highlight.js/lib/core";
import { markdownService } from "../webapp/util/markdownService";

// Pure Node unit test (no `page` fixture): exercises the markdownService memo
// directly. Re-parsing identical markdown must return the cached HTML without
// re-running marked + highlight.js. Spy on the highlighter at the module
// boundary rather than exposing a test-only cache accessor (CLAUDE.md §4);
// hljs is the same singleton the service imports.
test.describe("markdownService parse cache", () => {
	test("does not re-run the highlighter for identical markdown", () => {
		// A fenced code block forces the marked-highlight callback to invoke
		// hljs.highlight, giving the spy something to count.
		const markdown = "```js\nconst answer = 42;\n```\n";

		const original = hljs.highlight.bind(hljs);
		let highlightCalls = 0;
		hljs.highlight = ((...args: Parameters<typeof original>) => {
			highlightCalls++;
			return original(...args);
		}) as typeof hljs.highlight;

		try {
			const first = markdownService.parse(markdown);
			const callsAfterFirst = highlightCalls;
			// The first parse actually highlighted the code block.
			expect(callsAfterFirst).toBeGreaterThan(0);

			const second = markdownService.parse(markdown);
			// Same HTML, produced without touching the highlighter again.
			expect(second).toBe(first);
			expect(highlightCalls).toBe(callsAfterFirst);
		} finally {
			hljs.highlight = original;
		}
	});
});
