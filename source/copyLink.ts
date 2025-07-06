// https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/
import * as browser from 'webextension-polyfill';

browser.action.onClicked.addListener(async function (tab) {
	await browser.scripting.executeScript({
		target: { tabId: tab.id },
		args: [tab.url, tab.title],
		func: function callback(url: string, title: string) {
			let a = document.createElement('a');
			a.href = url;
			a.textContent = title;

			// work around apple-notes weird formatting
			const zeroWidthSpace = `&#xfeff;​`;

			const noUnderlineAfter = document.createElement('span');
			noUnderlineAfter.innerHTML = zeroWidthSpace;
			noUnderlineAfter.style.textDecoration = 'none';

			const noUnderlineBefore = document.createElement('span');
			noUnderlineAfter.innerHTML = ' ';
			noUnderlineAfter.style.textDecoration = 'none';

			const markdown = `[${a.textContent}](${a.href})`;
			const html = noUnderlineBefore.outerHTML + a.outerHTML + noUnderlineAfter.outerHTML;

			// from https://stackoverflow.com/a/50067769/548304
			function copyToClipboard({ text, html }: CopyArgs) {
				function listener(e) {
					e.clipboardData.setData('text/html', html);
					e.clipboardData.setData('text/plain', text);
					e.preventDefault();
				}

				document.addEventListener('copy', listener);
				document.execCommand('copy');
				document.removeEventListener('copy', listener);
			}

			copyToClipboard({
				text: markdown,
				html: html,
			});
		},
	});
});

// TODO https://w3c.github.io/clipboard-apis/#writing-to-clipboard

interface CopyArgs {
	text: string;
	html: string;
}
