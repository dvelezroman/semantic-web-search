import cheerio from 'cheerio';
import browser from 'webextension-polyfill';
import { NewsP2P } from '../background/webp2p';
import sites from '../../resources/sites';
import useSentiment from '../../hooks/useSentiment';
import { removeStopWords } from './utilities';

const loadUsersCustom = async event => {
	try {
		console.log('loadUsersCustom');
		let listaUsuarios = p2pExtension.getDataCallBack();
		console.log({ listaUsuarios });
		// TODO: guardar al LOCAL STORAGE
		chrome.storage.local.set({
			peers: listaUsuarios
		});
		// if (listaUsuarios != null || listaUsuarios != undefined || listaUsuarios !== 'undefined') {
		// 	let usuarios = document.getElementById('listusers');
		// 	let optionOne = new Option('All', 'All');
		// 	usuarios.options.length = 0;
		// 	usuarios.options[usuarios.options.length] = optionOne;
		// 	for (let i in listaUsuarios) {
		// 		if (listaUsuarios.hasOwnProperty(i)) {
		// 			console.log('Key is: ' + i + '. Value is: ' + listaUsuarios[i]);
		// 			let optionNew = new Option(listaUsuarios[i].username, listaUsuarios[i].username);
		// 			usuarios.options[usuarios.options.length] = optionNew;
		// 		}
		// 	}
		// }
	} catch (e) {
		console.log('Error al cargar lista de usuarios');
		console.log(e);
	}
};

var p2pExtension = new NewsP2P();
p2pExtension.connect();
p2pExtension.getPeers(loadUsersCustom);

const instances = [];
const news = [];
let doms = 0;
const urlDict = {};

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

const getFromStorage = key => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get({ [key]: [] }, data => {
			resolve({ msg: 'Data retrieved', data, error: false });
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

export const scrapping = async siteName => {
	console.log('Working =============================');
	console.log(`I have to scrap: ${siteName} site(s)`);
	for (const site of sites) {
		// this gives the number of sprints
		if (siteName === 'All' || siteName === site.name) {
			await initProcess(site, 0); // sprint one
		}
	}
	console.log('=======================================================');
	console.log(`[INFO] - Finished the first scrap over the home of ${siteName}`);
	console.log('=======================================================');
	console.log(
		`[INFO] - Working on the scrapping over the Url retrieved from home page of ${siteName}`
	);
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
	console.log({ instancesFromLocalStorage });
	// console.log({ news });
	// now we process the retrieved data
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
	return instancesProcessed;
};

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'send') {
		console.log(message.data);
		p2pExtension.sendRequest({ automatic: true, info: message.data.job }, message.data.peer);
	}
});
