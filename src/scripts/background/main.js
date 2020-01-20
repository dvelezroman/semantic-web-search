import cheerio from 'cheerio';
import sites from '../../resources/sites';

const instances = [];
let doms = 0;

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

const initProcess = async site => {
	if (validateUrl(site.url)) {
		try {
			const DOM = await retrieveDOM(site.url);
			doms = doms + 1;
			const newsInstances = await getUrls(DOM, site);
			instances.push(...newsInstances);
		} catch (e) {
			console.log(`Error retrieving: ${site.url}`);
		}
	} else {
		console.log('Finished this Loop...');
	}
};

const retrieveDOM = url =>
	new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onload = function(e) {
			resolve(request.response);
		};
		request.open('GET', url, true);
		request.send();
	});

const getUrls = (DOM, site) =>
	new Promise((resolve, reject) => {
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
				url = validateUrl(href) ? href : `${site.url}${href}`;
			}
			const title = $tag.text().trim();
			jsonUrls.push({ name: site.name, from: site.from, url, title });
			// TODO: this creates another instance from an URL and control by loop increased in one every time
		});
		resolve(jsonUrls);
	});

const sitesPromises = sites.map(site => initProcess(site));

const main = async () => {
	await Promise.all(sitesPromises);
	console.log('Finished the origin sites Promises');
	console.log(`Instances: ${instances.length}`);
	console.log(`Doms obtained: ${doms}`);
	// now the first loop
	const childSitesPromises = instances.map(site => initProcess(site));
	await Promise.all(childSitesPromises);
	console.log('Finished the second loop of sites Promises');
	console.log(`Instances: ${instances.length}`);
	console.log(`Doms obtained: ${doms}`);
};

main();
