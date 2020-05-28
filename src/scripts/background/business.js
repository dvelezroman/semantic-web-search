import cheerio from 'cheerio';
import { parseDate, isValidUrl, getNowTime } from './helpers';
import { validateUrl } from './consts';
import sites from '../../resources/sites';
import useSentiment from '../../hooks/useSentiment';
import { removeStopWords } from './utilities';
import LocalStorage from '../../business/LocalStorage';

// set the global vars
let doms = 0;
const instances = [];
const news = [];
const urlDict = {};

export const retrieveDOM = url =>
	new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onload = function (e) {
			if (request.status >= 200 && request.status < 300)
				resolve({ error: false, dom: request.response });
			else reject({ error: request.statusText, dom: null });
		};

		request.open('GET', url, true);

		request.send();
	});

export const getContent = (DOM, site) => {
	const $ = cheerio.load(DOM);
	const content = [];
	$(site.objectDefinition.content)
		.get()
		.forEach(ptag => {
			content.push($(ptag).text().trim());
		});
	return content.join(' ');
};

export const getDate = (DOM, site) => {
	const $ = cheerio.load(DOM);
	const date = [];
	const format = 'Do MMMM YYYY';
	//Parse in spanish and convert it in english
	$(site.objectDefinition.date)
		.get()
		.forEach(dtag => {
			date.push($(dtag).text());
		});
	const parsedDate = parseDate(date[0], format);
	return parsedDate;
};

export const getUrls = (DOM, site, sprint) => {
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
			fetched: false,
		};
		if (title !== '') jsonUrls.push(urlInstance);
	});
	return jsonUrls;
};

export const localScrapping = async numJobs => {
	console.log('[INFO] - The process selected is local.');
	const dataProcessed = await scrapping({ info: 'All' }, numJobs);
	console.log('=========================================');
	console.log(`[INFO] - The scrapping was done locally.`);
	console.log({ dataProcessed });
};

export const scrapping = async (data, numJobs = sites.length) => {
	// LocalStorage.clearStorage();
	console.log({ numJobs });
	const siteName = data.info;
	const group = data.group ? data.group : null;

	const startScrap = performance.now();
	console.log('Working =============================');
	const sitesToScrap = sites.slice(0, numJobs);

	for (const site of sitesToScrap) {
		// this gives the number of sprints
		if (siteName === 'All' || siteName === site.name) {
			await initProcess(site, 0); // sprint one
		}
	}
	console.log('=======================================================');
	console.log(`[INFO] - Finished the first scrap over the homes`);
	console.log('=======================================================');
	console.log(
		`[INFO] - Working on the scrapping over the Url retrieved from home pages`
	);
	for (const instance of instances) {
		if (instance.sprint <= 1) {
			await initProcess(instance, 1);
		} else break;
	}
	console.log('=======================================================');
	console.log('[INFO] - Finished the scrapping..');
	console.log(`[INFO] - ${doms} DOMS were processed.`);
	console.log('Saving in Local Storage....');
	await LocalStorage.setItem(news); // await saveToStorage(news, 'newsInstances');
	// console.log({ msg });
	console.log('Retrieving from localStorage...');
	const instancesFromLocalStorage = await LocalStorage.getItem('newsInstances');
	const endScrap = performance.now();
	// console.log({ news });
	// now we process the retrieved data
	const startProcess = performance.now();
	console.log('=======================================================');
	console.log('[INFO] - Proccessing the extracted data...');
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { getScore, extractTopics } = useSentiment();
	const instancesProcessed = instancesFromLocalStorage.data.newsInstances.filter(
		instance => {
			if (instance.content) {
				const contentRemovedStopWords = removeStopWords(instance.content);
				const topicsExtracted = extractTopics(contentRemovedStopWords);

				instance['score'] = getScore(contentRemovedStopWords);
				instance['nonStopWord'] = contentRemovedStopWords;
				instance['topic'] = topicsExtracted;
				return instance;
			}
			return null;
		}
	);
	console.log('=======================================================');
	console.log(
		'[INFO] - Finished the process to extracted data, now I send the data through a  response.'
	);
	const endProcess = performance.now();
	const scrapTime = endScrap - startScrap;
	const processTime = endProcess - startProcess;
	const totalTime = scrapTime + processTime;
	return {
		instancesProcessed,
		scrapTime,
		processTime,
		totalTime,
		group,
	};
};

// Init Process
export const initProcess = async (site, sprint) => {
	if (validateUrl(site.siteURL) && isValidUrl(site.siteURL)) {
		const instancesRetrieved = await LocalStorage.getItem('newsInstances');
		const exists = await LocalStorage.findItem(
			instancesRetrieved,
			site.siteURL
		);
		if (!exists) {
			try {
				urlDict[site.siteURL] = true;
				const { error, dom } = await retrieveDOM(site.siteURL);
				if (error)
					throw new Error(
						'[ERROR] - Error retrieving this site: ' + site.siteURL
					);
				doms += 1;
				if (site.type === 'news') {
					site.home = sprint === 1;
					if (sprint === 1) {
						// is in HOME
						site.inHomeFrom = getNowTime();
						site.inHomeUntil = getNowTime();
					}
					site.content = getContent(dom, site);
					site.fetched = true;
					site.date = getDate(dom, site);
					if (site.content !== '') {
						news.push({ ...site });
						site.status = 'No content.';
					}
				}
				const newInstances = getUrls(dom, site, sprint + 1);
				instances.push(...newInstances);
			} catch (e) {
				console.log(e.message);
			}
		} else {
			if (sprint === 1) {
				site.inHomeUntil = getNowTime();
			}
			console.log(
				'[INFO] - This news is already stored in LocalStorage: ' + site.siteURL
			);
		}
	} else {
		console.log('[ERROR] - Url not valid: ' + site.siteURL);
	}
};
