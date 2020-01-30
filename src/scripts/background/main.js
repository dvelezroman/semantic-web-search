import cheerio from 'cheerio';
import sites from '../../resources/sites';
import useSentiment from '../../hooks/useSentiment';
import { removeStopWords } from './utilities';

const instances = [];
const news = [];
let doms = 0;
const urlDict = {};

const getSentimentScore = text => new Promise((resolve, reject) => {});

const saveToStorage = (newsInstancesArray, key) =>
	new Promise((resolve, reject) => {
		chrome.storage.local.set(
			{
				[key]: newsInstancesArray
			},
			() => {
				resolve({ msg: 'News were added to list in local storage...', error: false });
			}
		);
	});

const getFromStorage = key => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get({ [key]: [] }, data => {
			resolve(data);
		});
	});
};

const validateUrl = url => /^(http(s?)):\/\/.+/gi.test(url);

const regexs = {
	youtube: /(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/,
	tweeter: /.+(twitt(er)?).+/,
	instagram: /.+(instagram).+/,
	facebook: /.+(facebook).+/,
	whatsapp: /.+(whatsapp).+/,
	telegram: /.+(telegram).+/,
	pinterest: /.+(pinterest).+/,
	plus: /.+(plus.google.com).+/,
	mailto: /.+(mailto).+/
};

const isValidUrl = url => {
	let isValid = false;
	Object.keys(regexs).forEach(key => {
		if (!regexs[key].test(url)) {
			isValid = true;
		}
	});
	return isValid;
};

// {
// 	siteURL: 'https://wwww.infobae.com',
// 	name: 'Infobae',
// 	type: 'home',
// 	homeNewsSelectors: ['div > div > div.headline.xx-large.normal-style > a'],
// 	objectDefinition: {
// 		content: '#article-content > div > div > p',
// 		author: 'a.author-name',
// 		date: 'span.byline-date',
// 		title: 'div > div > header > h1',
// 		urls: 'div > p > a'
// 	}
// }

const initProcess = async (site, sprint) => {
	if (validateUrl(site.siteURL) && isValidUrl(site.siteURL)) {
		if (!urlDict[site.siteURL]) {
			console.log(`[SUCCESS] - [${site.siteURL}] is valid`);
			try {
				urlDict[site.siteURL] = true;
				const { error, dom } = await retrieveDOM(site.siteURL);
				if (error) throw new Error('[ERROR] - Error retrieving this site: ' + site.siteURL);
				doms += 1;
				if (site.type === 'news') {
					site.content = getContent(dom, site);
					site.fetched = true;
					if (site.content !== '') {
						news.push({ ...site });
						site.status = 'No content.';
					}
				}
				const newInstances = await getUrls(dom, site, sprint + 1);
				instances.push(...newInstances);
			} catch (e) {
				console.log(e.message);
			}
		} else {
			console.log('[ERROR] - Url repeated: ' + site.siteURL);
		}
	} else {
		console.log('[ERROR] - Url not valid: ' + site.siteURL);
	}
};

const retrieveDOM = url =>
	new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onload = function(e) {
			if (request.status >= 200 && request.status < 300)
				resolve({ error: false, dom: request.response });
			else reject({ error: request.statusText, dom: null });
		};

		request.open('GET', url, true);

		request.send();
	});

const getContent = (DOM, site) => {
	const $ = cheerio.load(DOM);
	const content = [];
	$(site.objectDefinition.content)
		.get()
		.forEach(ptag => {
			content.push(
				$(ptag)
					.text()
					.trim()
			);
		});
	return content.join(' ');
};

const getUrls = (DOM, site, sprint) => {
	// new Promise((resolve, reject) => {
	const $ = cheerio.load(DOM);
	let aTags = [];
	if (site.type === 'home') {
		aTags = $(site.homeNewsSelector[0]).get();
		// aTags = [...aTags, $(site.homeNewsSelector[1]).get()];
	} else {
		aTags = $(site.objectDefinition.urls).get();
	}
	const jsonUrls = [];
	aTags.forEach(tag => {
		const $tag = $(tag);
		const href = $tag.attr('href');
		let url = '';
		if (href && href.length) {
			if (validateUrl(href)) {
				url = href;
			} else if (href[0] === '/' || site.siteURL[-1] === '/') {
				url = `${site.siteURL}${href}`;
			} else {
				url = `${site.siteURL}/${href}`;
			}
		}
		const title = $tag.text() && $tag.text().trim();
		const urlInstance = {
			name: site.name,
			from: site.siteURL,
			siteURL: url.trim(),
			title,
			sprint,
			type: 'news',
			objectDefinition: site.objectDefinition,
			fetched: false
		};
		if (title !== '') jsonUrls.push(urlInstance);
		// TODO: this creates another instance from an URL and control by loop increased in one every time
	});
	return jsonUrls;
};

const main = async () => {
	console.log('Working');
	for (const site of sites) {
		// this gives the number of sprints
		await initProcess(site, 0); // sprint one
	}
	console.log('Finish...');

	console.log('Working');
	for (const instance of instances) {
		if (instance.sprint <= 1) {
			await initProcess(instance, 1);
		}
		//sprint two
		else break;
	}

	console.log('Finished all..');
	console.log({ doms });
	console.log('Saving in Local Storage....');
	const { msg, error } = await saveToStorage(news, 'newsInstances');
	console.log({ msg });
	console.log('Retrieving from localStorage...');
	const instancesFromLocalStorage = await getFromStorage('newsInstances');
	// console.log({ instancesFromLocalStorage });
	console.log({ news });
	// now we process the retrieved data
	console.log('Proccessing...');
	const { getScore, extractTopics } = useSentiment();
	const instancesProcessed = instancesFromLocalStorage.newsInstances.filter(instance => {
		if (instance.content) {
			const contentRemovedStopWords = removeStopWords(instance.content);
			const topicsExtracted = extractTopics(instance.content);

			instance['score'] = getScore(contentRemovedStopWords);
			instance['nonStopWord'] = contentRemovedStopWords;
			instance['topic'];
			return instance;
		}
	});
	console.log({ instancesProcessed });
};

main();
