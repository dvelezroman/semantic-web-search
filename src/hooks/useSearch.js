import React, { useState, useEffect } from 'react';
import rp from 'request-promise';
import cheerio from 'cheerio';
import fetch from 'node-fetch';

const urls = {
	infobae: 'https://www.infobae.com/search/{text_to_search}}/'
};

const useSearch = () => {
	const onSearch = async text => {
		console.log('A buscar...');
		const searchUrl = `https://www.infobae.com/search/rafael+correa/?q=rafael+correa`;
		const data = await rp(`https://cors-anywhere.herokuapp.com/${searchUrl}`).then(html => html);

		// const data = await fetch('https://cors-anywhere.herokuapp.com/https://github.com/trending');
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
				return title;
			});
		return allTitles;
	};

	return { onSearch };
};

export default useSearch;
