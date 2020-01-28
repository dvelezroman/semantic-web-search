import cheerio from 'cheerio';
import sites from '../../resources/sites';
import useSentiment from '../../hooks/useSentiment';
import { removeStopWords } from './utilities';

const instances = [];
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

const initProcess = async (site, sprint) => {
	if (validateUrl(site.url) && isValidUrl(site.url)) {
		if (!urlDict[site.url]) {
			console.log(`[SUCCESS] - [${site.url}] is valid`);
			try {
				urlDict[site.url] = true;
				const { error, data } = await retrieveDOM(site.url);
				if (error) throw new Error('[ERROR] - Error retrieving this site: ' + site.url);
				doms += 1;
				site['content'] = getTextContent(data);
				const newsInstances = await getUrls(data, site, sprint + 1);
				instances.push(...newsInstances);
			} catch (e) {
				console.log(e.message);
			}
		} else {
			console.log('[ERROR] - Url repeated....');
		}
	} else {
		console.log('[ERROR] - Url not valid: ' + site.url);
	}
};

const retrieveDOM = url =>
	new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onload = function(e) {
			if (request.status >= 200 && request.status < 300)
				resolve({ error: false, data: request.response });
			else reject({ error: request.statusText, data: null });
		};

		request.open('GET', url, true);

		request.send();
	});

const getTextContent = DOM => {
	const $ = cheerio.load(DOM);
	// TODO: here we ust to make a selector text for every url
	const textSelector = 'p.element-paragraph';
	const textContent = [];
	$(textSelector)
		.get()
		.forEach(ptag => {
			textContent.push(
				$(ptag)
					.text()
					.trim()
			);
		});
	// END TODO: here we ust to make a selector text for every url
	return textContent.join(' ');
};

const getUrls = (DOM, site, sprint) => {
	// new Promise((resolve, reject) => {
	const $ = cheerio.load(DOM);
	const config = {
		selector: 'div > a'
	};
	const aTags = $(config.selector).get();
	const jsonUrls = [];
	aTags.forEach(tag => {
		const $tag = $(tag);
		const href = $tag.attr('href');
		let url = '';
		if (href && href.length) {
			if (validateUrl(href)) {
				url = href;
			} else if (href[0] === '/' || site.url[-1] === '/') {
				url = `${site.url}${href}`;
			} else {
				url = `${site.url}/${href}`;
			}
		}
		const title = $tag.text().trim();
		const urlInstance = { name: site.name, from: site.url, url, title, sprint };
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
	for (const site of instances) {
		if (site.sprint <= 1) {
			await initProcess(site, 1);
		}
		//sprint two
		else break;
	}
	console.log('Finished all..');
	console.log({ doms });
	console.log('Saving....');
	const { msg, error } = await saveToStorage(instances, 'newsInstances');
	console.log({ msg });
	console.log('Retrieving from localStorage...');
	const instancesFromLocalStorage = await getFromStorage('newsInstances');
	//console.log({ instancesFromLocalStorage });

	// now we process the retrieved data
	const { getScore } = useSentiment();
	const instancesProcessed = instancesFromLocalStorage.newsInstances.filter(instance => {
		if (instance.content) {
			const contentRemovedStopWords = removeStopWords(instance.content);
			instance['score'] = getScore(contentRemovedStopWords);
			instance['nonStopWord'] = contentRemovedStopWords;
			return instance;
		}
	});
	console.log({ instancesProcessed });
};

main();
