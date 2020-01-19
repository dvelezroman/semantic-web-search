import cheerio from 'cheerio';
class BackgroundExtension {
	constructor() {}

	saveToStorage(newsInstancesArray, key) {
		chrome.storage.local.set(
			{
				[key]: newsInstancesArray
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

	retrievePageDOM(source) {
		return new Promise(function(resolve, reject) {
			const request = new XMLHttpRequest();
			request.onload = function(e) {
				const parser = new DOMParser();
				const doc = parser.parseFromString(request.response, 'text/html');
				resolve(request.response);
			};
			request.open('GET', source, true);
			request.send();
		});
	}

	getInstancesFromElClarin(response, source) {
		const $ = cheerio.load(response);
		// TODO: get config properties
		// XPATH properties
		const config = {
			apiXpath: '.content-nota'
		};
		const news = $(config.apiXpath).get();
		const jsonNews = [];
		news.forEach(elem => {
			const $elem = $(elem);
			const $header = $elem.find('a');
			const url = `${source}${$header.attr('href')}`;
			const head = $header.find('p').text();
			const subHead = $header.find('h1').text();
			const summary = $header.find('.summary').text();
			const $section = $elem.find('.data-txt');
			const sectionUrl = `${source}${$section.find('a').attr('href')}`;
			const section = $section
				.find('a')
				.find('p')
				.text();
			jsonNews.push({ new: { url, sectionUrl, head, subHead, summary }, source, section });
		});
		return jsonNews;
	}
}

const startBackground = async function(config) {
	const extension = new BackgroundExtension();
	const response = await extension.retrievePageDOM(config.apiUrl);
	const news = extension.getInstancesFromElClarin(response, config.apiUrl);
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

startBackground({ apiUrl: 'https://www.clarin.com' });

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
