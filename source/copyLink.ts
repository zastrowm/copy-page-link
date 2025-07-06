// https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/
import * as browser from 'webextension-polyfill';

browser.action.onClicked.addListener(async function (tab) {
	await browser.scripting.executeScript({
		target: { tabId: tab.id },
		args: [tab.url, tab.title],
		func: copyPageTitle,
	});
});

// TODO https://w3c.github.io/clipboard-apis/#writing-to-clipboard

function copyPageTitle(url: string, title: string) {
	let a = document.createElement('a');
	a.href = url;
	a.textContent = title;

	const ZWSP = `​`;

	// Work around apple-notes odd-formatting issue that without it it tries to continue formatting
	const zeroWidthSpace = `&#xfeff;${ZWSP}`;

	const noUnderlineAfter = document.createElement('span');
	noUnderlineAfter.innerHTML = zeroWidthSpace;
	noUnderlineAfter.style.textDecoration = 'none';

	const noUnderlineBefore = document.createElement('span');
	noUnderlineAfter.innerHTML = ' ';
	noUnderlineAfter.style.textDecoration = 'none';

	// Workaround for GitHub/markdown pasting where they try to reconstruct the markdown. By inserting a ZWSP in the text
	// content, the plain text isn't found directly in the markdown and thus they don't try to wrap it in extra markdown
	// ref: https://github.com/avo-hq/marksmith/blob/main/app/assets/javascripts/marksmith_controller-no-stimulus.esm.js#L1992
	let mdTitle = a.textContent;
	if (mdTitle.length >= 1) {
		mdTitle = mdTitle.substring(0, 1) + ZWSP + mdTitle.substring(1);
	}

	const markdown = `[${mdTitle}](${a.href})`;
	const html = noUnderlineBefore.outerHTML + a.outerHTML + noUnderlineAfter.outerHTML;

	// from https://stackoverflow.com/a/50067769/548304
	function copyToClipboard() {
		function listener(e) {
			e.clipboardData.setData('text/uri-list', a.href);
			e.clipboardData.setData('text/html', html);
			e.clipboardData.setData('text/plain', markdown);
			e.clipboardData.setData('text/x-markdown', markdown);
			e.preventDefault();
		}

		document.addEventListener('copy', listener);
		document.execCommand('copy');
		document.removeEventListener('copy', listener);
	}

	copyToClipboard();
}
