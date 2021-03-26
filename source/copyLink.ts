// https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/
import browser from "webextension-polyfill";

browser.browserAction.onClicked.addListener(function (tab) {
	let a = document.createElement("a");
	a.href = tab.url;
	a.textContent = tab.title;

	const zeroWidthSpace = `​`;
	const markdown = `[${a.textContent}](${a.href})`;
	const html = zeroWidthSpace + a.outerHTML + zeroWidthSpace;

	copyToClipboard({
		text: markdown,
		html: html,
	});
});

// TODO https://w3c.github.io/clipboard-apis/#writing-to-clipboard

interface CopyArgs {
	text: string;
	html: string;
}

// from https://stackoverflow.com/a/50067769/548304
function copyToClipboard({ text, html }: CopyArgs) {
	function listener(e) {
		e.clipboardData.setData("text/html", html);
		e.clipboardData.setData("text/plain", text);
		e.preventDefault();
	}

	document.addEventListener("copy", listener);
	document.execCommand("copy");
	document.removeEventListener("copy", listener);
}
