const sites = [
	{
		siteURL: 'https://wwww.infobae.com',
		name: 'Infobae',
		type: 'home',
		homeNewsSelectors: ['div > div > div.headline.xx-large.normal-style > a'],
		objectDefinition: {
			content: '#article-content > div > div > p',
			author: 'a.author-name',
			date: 'span.byline-date',
			title: 'div > div > header > h1',
			urls: 'div > p > a'
		}
	}
	// {
	// 	from: 'origin',
	// 	name: 'Infobae',
	// 	url: 'https://www.infobae.com'
	// },
	// {
	// 	from: 'origin',
	// 	name: 'TN',
	// 	url: 'https://tn.com.ar',
	// 	objectDefinition: { author: '.author-class', date: '.date-class' }
	// }
	// { from: 'origin', name: 'Clarin', url: 'https://www.clarin.com' },
	// { from: 'origin', name: 'La Nación', url: 'https://www.lanacion.com.ar' },
	// { from: 'origin', name: 'RT', url: 'https://actualidad.rt.com' },
	// { from: 'origin', name: 'El Universo', url: 'https://www.eluniverso.com' },
	// { from: 'origin', name: 'El Comercio', url: 'https://www.elcomercio.com' },
	// { from: 'origin', name: 'CNN en Español', url: 'https://cnnespanol.cnn.com' }
];

export default sites;
