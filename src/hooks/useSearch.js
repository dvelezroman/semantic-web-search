import React, { useState, useEffect } from 'react';
import rp from 'request-promise';

const urls = {
	infobae: 'https://www.infobae.com/search/{text_to_search}}/'
};

const useSearch = () => {
	const onSearch = async text => {
		console.log('A buscar...');
		const searchUrl = `https://www.clarin.com/buscador/?q=lenin%20moreno`;
		rp(`https://cors-anywhere.herokuapp.com/${searchUrl}`).then(html => console.log(html));
	};

	return { onSearch };
};

export default useSearch;
