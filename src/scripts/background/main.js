import cheerio from 'cheerio';
import sites from '../../resources/sites';

const instances = [];
let doms = 0;
const urlDict = {};

const saveToStorage = (newsInstancesArray, key) => {
	chrome.storage.local.set(
		{
			newsInstances: { [key]: newsInstancesArray }
		},
		function() {
			console.log('News were added to list in local storage...');
		}
	);
};

const getFromStorage = key => {
	chrome.storage.local.get({ [key]: [] }, function(data) {
		console.log({ data });
	});
};

const validateUrl = url => {
	if (/(http(s?)):\/\//gi.test(url)) {
		return true;
	} else return false;
};

const validateSocialUrl = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;

const initProcess = async site => {
	if (!(site.url in urlDict) && validateUrl(site.url) && !validateSocialUrl.test(site.url)) {
		try {
			urlDict[site.url] = true;
			const { error, data } = await retrieveDOM(site.url);
			if (error) throw new Error('Error retrieving this site: ' + site.url);
			doms = doms + 1;
			const newsInstances = await getUrls(data, site);
			instances.push(...newsInstances);
		} catch (e) {
			console.log(e.message);
		}
	} else {
		console.log('Url not valid: ' + site.url);
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

const getUrls = (DOM, site) => {
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
			} else if (href[0] === '/') {
				url = `${site.url}${href}`;
			} else {
				url = `${site.url}/${href}`;
			}
		}
		const title = $tag.text().trim();
		const urlInstance = { name: site.name, from: site.url, url, title };
		console.log({ urlInstance });
		jsonUrls.push(urlInstance);
		// TODO: this creates another instance from an URL and control by loop increased in one every time
	});
	return jsonUrls;
};

const main = async () => {
	console.log('Working');
	for (const site of sites) {
		await initProcess(site);
	}
	console.log('Finish...');
	console.log('Working');
	for (const site of instances) {
		await initProcess(site);
	}
	console.log('Finish');
	console.log({ doms });
	console.log({ instances });
};

main();
