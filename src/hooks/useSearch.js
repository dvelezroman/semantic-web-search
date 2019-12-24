import rp from 'request-promise';
import cheerio from 'cheerio';

const urls = {
	infobae: 'https://www.infobae.com/search/{text_to_search}/?q{text_to_search}'
};

const useSearch = () => {
	const onSearch = async text => {
		console.log('A buscar...');
		const searchUrl = getFormattedText(text);
		const data = await rp(`https://cors-anywhere.herokuapp.com/${searchUrl}`).then(html => html);

		const $ = cheerio.load(data, {
			withDomLvl1: true,
			normalizeWhitespace: false,
			xmlMode: true,
			decodeEntities: true
		});

		const allTitles = $('.search-feed-list-item')
			.get()
			.map(repo => {
				const $repo = $(repo);
				const title = $repo.find('a').text();
				const description = $repo.find('.blurb').text();
				const author = $repo.find('.author').text();
				const date = $repo.find('.timestamp').text();
				return { title, description, author, date };
			});
		return allTitles;
	};

	const getFormattedText = text => {
		const words = text.trim().replace(' ', '+');
		return urls.infobae.replace('{text_to_search}', words, 'gi');
	};

	return { onSearch };
};

export default useSearch;
