import rp from 'request-promise';
import cheerio from 'cheerio';
import { useState } from 'react';

const useSearch = () => {
	const getTitlesFromInfobae = $ => {
		const from = 'Infobae';
		const titles = $('.search-feed-list-item')
			.get()
			.map(repo => {
				const $repo = $(repo);
				const title = $repo.find('a').text();
				const description = $repo.find('.blurb').text();
				const author = $repo.find('.author').text();
				const date = $repo.find('.timestamp').text();
				return { title, description, author, date, from };
			});
		return titles;
	};

	const getTitlesFromElClarin = $ => {
		const from = 'Clarín';
		const titles = $('.gsc-thumbnail-inside')
			.get()
			.map(repo => {
				const $repo = $(repo);
				const title = $repo.find('a').text();
				const description = $repo.find('.gs-bidi-start-align b').text();
				const author = $repo.find('.author').text();
				const date = $repo.find('.gs-bidi-start-align').text();
				return { title, description, author, date, from };
			});
		console.log({ titles });
		return [];
	};

	const getTitlesFromElUniverso = $ => {
		const from = 'RT Noticias';
		const titles = $('.Search-group').get();
		console.log(titles).map(repo => {
			const $repo = $(repo);
			const title = $repo.find('a').text();
			const description = $repo.find('.gs-bidi-start-align b').text();
			const author = $repo.find('.author').text();
			const date = $repo.find('.gs-bidi-start-align').text();
			return { title, description, author, date, from };
		});
		return titles;
	};

	const urls = {
		infobae: {
			url: 'https://www.infobae.com/search/{text_to_search}/?q{text_to_search}',
			callback: getTitlesFromInfobae
		}
		// elClarin: {
		// 	url: 'https://www.clarin.com/buscador/?q={text_to_search}',
		// 	callback: getTitlesFromElClarin
		// }
		// elUniverso: {
		// 	url: 'https://www.eluniverso.com/resultados?search={text_to_search}',
		// 	callback: getTitlesFromElUniverso
		// }
	};

	const [allTitles, setAllTitles] = useState([]);

	const onSearch = text => {
		console.log('A buscar...');
		Object.keys(urls).map(async item => {
			console.log(item);
			const searchUrl = getFormattedText(text, urls[item].url);
			const data = await rp(`https://cors-anywhere.herokuapp.com/${searchUrl}`).then(html => html);

			const $ = cheerio.load(data, {
				withDomLvl1: true,
				normalizeWhitespace: false,
				xmlMode: true,
				decodeEntities: true
			});
			const titles = urls[item].callback($);
			console.log(titles);
			const getTitles = [...allTitles];
			setAllTitles([...getTitles, ...titles]);
		});
	};

	const getFormattedText = (text, url) => {
		const words = text.trim().replace(' ', '+');
		return url.replace('{text_to_search}', words, 'gi');
	};

	return { onSearch, allTitles };
};

export default useSearch;
