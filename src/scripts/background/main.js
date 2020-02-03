import cheerio from 'cheerio';
import browser from 'webextension-polyfill';
import { NewsP2P } from '../background/webp2p';
import sites from '../../resources/sites';
import useSentiment from '../../hooks/useSentiment';
import { removeStopWords } from './utilities';

const regexs = {
	youtube: /(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/,
	tweeter: /.+(twitt(er)?).+/,
	instagram: /.+(instagram).+/,
	facebook: /.+(facebook).+/,
	whatsapp: /.+(whatsapp).+/,
	telegram: /.+(telegram).+/,
	pinterest: /.+(pinterest).+/,
	plus: /.+(plus.google.com).+/,
	mailto: /.+(mailto).+/,
	spotify: /.+(spotify).+/,
	linkedin: /.+(linkedin).+/
};

const loadUsersCustom = async event => {
	try {
		let listaUsuarios = p2pExtension.getDataCallBack();
		// TODO: guardar al LOCAL STORAGE
		chrome.storage.local.set({
			peers: listaUsuarios
		});
	} catch (e) {
		console.log('Error al cargar lista de usuarios');
		console.log(e);
	}
};

// load a new instance of NewsP2P class
var p2pExtension = new NewsP2P();
p2pExtension.connect();
p2pExtension.getPeers(loadUsersCustom);
// set the global vars
const instances = [];
const news = [];
let doms = 0;
const urlDict = {};
// save to local storage
const saveToStorage = (newsInstancesArray, key) =>
	new Promise((resolve, reject) => {
		chrome.storage.local.set(
			{
				[key]: newsInstancesArray
			},
			() => {
				resolve({ msg: 'Data was saved in Local Storage...', error: false });
			}
		);
	});
// get from local Storage
const getFromStorage = key => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get({ [key]: [] }, data => {
			resolve({ msg: 'Data retrieved', data, error: false });
		});
	});
};

const validateUrl = url => /^(http(s?)):\/\/.+/gi.test(url);

const isValidUrl = url => {
	let isValid = false;
	Object.keys(regexs).forEach(key => {
		if (!regexs[key].test(url)) {
			isValid = true;
		}
	});
	return isValid;
};
// Init Process
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
	});
	return jsonUrls;
};

export const scrapping = async (data, numJobs = sites.length) => {
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
	console.log(`[INFO] - Working on the scrapping over the Url retrieved from home pages`);
	for (const instance of instances) {
		if (instance.sprint <= 1) {
			await initProcess(instance, 1);
		} else break;
	}
	console.log('=======================================================');
	console.log('[INFO] - Finished the scrapping..');
	console.log(`[INFO] - ${doms} DOMS were processed.`);
	// console.log('Saving in Local Storage....');
	const { msg, error } = await saveToStorage(news, 'newsInstances');
	// console.log({ msg });
	// console.log('Retrieving from localStorage...');
	const instancesFromLocalStorage = await getFromStorage('newsInstances');
	const endScrap = performance.now();
	// console.log({ news });
	// now we process the retrieved data
	const startProcess = performance.now();
	console.log('=======================================================');
	console.log('[INFO] - Proccessing the extracted data...');
	const { getScore, extractTopics } = useSentiment();
	const instancesProcessed = instancesFromLocalStorage.data.newsInstances.filter(instance => {
		if (instance.content) {
			const contentRemovedStopWords = removeStopWords(instance.content);
			const topicsExtracted = extractTopics(contentRemovedStopWords);

			instance['score'] = getScore(contentRemovedStopWords);
			instance['nonStopWord'] = contentRemovedStopWords;
			instance['topic'] = topicsExtracted;
			return instance;
		}
	});
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
		group
	};
};

const localScrapping = async numJobs => {
	console.log('[INFO] - The process selected is local.');
	const dataProcessed = await scrapping({ info: 'All' }, numJobs);
	console.log('=========================================');
	console.log(`[INFO] - The scrapping was done locally.`);
	console.log({ dataProcessed });
};

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'send') {
		p2pExtension.sendRequest(
			{
				data: {
					automatic: true,
					info: message.data.job,
					group: message.data.group ? message.data.group : null
				},
				automatic: true
			},
			message.data.peer
		);

		// p2pExtension.sendRequest({
		// 	data: { automatic: true, info: message.data.job }, automatic: true },
		// 	usuario
		// );
	}
	if (message.type === 'local') {
		localScrapping(message.data.numJobs);
	}
});
