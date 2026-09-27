import { test, expect } from "@playwright/test";
import hljs from "highlight.js/lib/core";
import { markdownService } from "../webapp/util/markdownService";

// Node-only test; hljs is the same singleton the service imports, so spying on
// it observes whether parse re-ran.
test.describe("markdownService parse cache", () => {
	test("does not re-run the highlighter for identical markdown", () => {
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
			expect(callsAfterFirst).toBeGreaterThan(0);

			const second = markdownService.parse(markdown);
			expect(second).toBe(first);
			expect(highlightCalls).toBe(callsAfterFirst);
		} finally {
			hljs.highlight = original;
		}
	});
});

test.describe("markdownService links", () => {
	test("opens links in a new tab with an escaped title and encoded href", () => {
		const html = markdownService.parse('[x](<https://a.b/c d> "say \\"hi\\"")');
		expect(html).toContain(
			'<a target="_blank" rel="noopener noreferrer" href="https://a.b/c%20d" title="say &quot;hi&quot;">x</a>',
		);
	});
});
