import cheerio from 'cheerio';
import sites from '../../resources/sites';

class BackgroundExtension {
	constructor(source, loop) {
		this.name = source.name;
		this.from = source.from;
		this.loop = loop;
		this.url = source.url;
		this.urls = [];
		this.instances = [];
		this.DOM = null;
		if (loop < 2) {
			this.init();
		}
	}

	async init() {
		try {
			this.DOM = await this.retrievePageDOM(this.url);
			this.getUrls();
			this.saveToStorage(this.instances, this.name);
		} catch (e) {
			console.log(e.response);
		}
	}

	saveToStorage(newsInstancesArray, key) {
		chrome.storage.local.set(
			{
				newsInstances: { [key]: newsInstancesArray }
			},
			function() {
				console.log('News were added to list in local storage...');
			}
		);
	}

	getFromStorage(key) {
		chrome.storage.local.get({ [key]: [] }, function(data) {
			console.log({ data });
		});
	}

	retrievePageDOM(url) {
		return new Promise(function(resolve, reject) {
			const request = new XMLHttpRequest();
			request.onload = function(e) {
				const parser = new DOMParser();
				const doc = parser.parseFromString(request.response, 'text/html');
				resolve(request.response);
			};
			request.open('GET', url, true);
			request.send();
		});
	}

	getUrls() {
		return new Promise();

		const $ = cheerio.load(this.DOM);
		const config = {
			selector: 'div > a'
		};
		const aTags = $(config.selector).get();
		const jsonUrls = [];
		aTags.forEach(tag => {
			const $tag = $(tag);
			const href = $tag.attr('href');
			const url = href.includes('https://') ? href : `${this.url}${href}`;
			const title = $tag.text().trim();
			jsonUrls.push({ name: this.name, from: this.from, url, title });
			// TODO: this creates another instance from an URL and control by loop increased in one every time
			const childExtension = new BackgroundExtension(
				{ name: title, url, from: this.name },
				this.loop + 1
			);
		});
		this.instances = jsonUrls;
	}
}

sites.forEach(site => {
	const extension = new BackgroundExtension(site, 0);
});

// chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
// 	if (changeInfo.status !== 'loading') {
// 		return;
// 	}

// 	const result = await isInjected(tabId);
// 	if (chrome.runtime.lastError || result[0]) return;

// 	loadScript('inject', tabId, () => console.log('load inject bundle success!'));
// });

// function getInstancesFromElClarin(response, source) {
// 	const $ = cheerio.load(response);
// 	// TODO: get config properties
// 	// XPATH properties
// 	const config = {
// 		apiXpath: '.content-nota'
// 	};
// 	const news = $(config.apiXpath).get();
// 	const jsonNews = [];
// 	news.forEach(elem => {
// 		const $elem = $(elem);
// 		const $header = $elem.find('a');
// 		const url = `${source}${$header.attr('href')}`;
// 		const head = $header.find('p').text();
// 		const subHead = $header.find('h1').text();
// 		const summary = $header.find('.summary').text();
// 		const $section = $elem.find('.data-txt');
// 		const sectionUrl = `${source}${$section.find('a').attr('href')}`;
// 		const section = $section
// 			.find('a')
// 			.find('p')
// 			.text();
// 		jsonNews.push({ new: { url, sectionUrl, head, subHead, summary }, source, section });
// 	});
// 	return jsonNews;
// }

const startBackground = async function(config) {
	const extension = new BackgroundExtension();
	const response = await extension.retrievePageDOM(config.apiUrl);
	const news = getInstancesFromElClarin(response, config.apiUrl);
	extension.saveToStorage(news, 'elClarin');
	extension.getFromStorage('elClarin');

	// chrome.browserAction.onClicked.addListener(function() {
	// 	extension.enableTopicsExtraction();
	// });

	chrome.runtime.onMessage.addListener((request, sender) => {
		console.log('[Background-side] calling the message: ' + request.call);
		// if (extension[request.call]) {
		// 	return extension[request.call](request.args);
		// }
	});
};

// chrome.runtime.onInstalled.addListener(() => {
//   console.log('onInstalled...');
//   // create alarm after extension is installed / upgraded
//   chrome.alarms.create('refresh', { periodInMinutes: 3 });
// });

// chrome.alarms.onAlarm.addListener((alarm) => {
//   console.log(alarm.name); // refresh
//   helloWorld();
// });

// function helloWorld() {
//   console.log("Hello, world!");
// }
