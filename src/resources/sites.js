const sites = [
	{
		siteURL: 'https://www.infobae.com',
		name: 'Infobae',
		type: 'home',
		homeNewsSelector: ['div > div > div > a', 'div > div > div.headline.normal.normal-style > a'],
		objectDefinition: {
			content: '#article-content > div > div > p',
			author: 'a.author-name',
			date: 'span.byline-date',
			title: 'div > div > header > h1',
			urls: 'div > p > a'
		}
	},
	{
		siteURL: 'https://tn.com.ar',
		name: 'TN',
		type: 'home',
		homeNewsSelector: ['div > div > div > article > div > h2 > a'],
		objectDefinition: {
			content:
				'div > section > div.content-container > article > div.article__content-and-social-wrapper > div > div.article__body > div:nth-child(2) > div > p',
			author: 'a.author-name',
			date: 'span.byline-date',
			title: 'div > section > div.content-container > article > header > div > h1',
			urls:
				'div > section > div.content-container > article > div > div > div.article__body > div > div > div > div > div.article__body__related-tag__links > a'
		}
	},
	{
		siteURL: 'https://www.lanacion.com.ar',
		name: 'La Nacion',
		type: 'home',
		homeNewsSelector: ['article > h2 > a'],
		objectDefinition: {
			content: '#cuerpo > p.capital',
			author: '#cuerpo > div.barra > section > section > a',
			date: 'div.barra > div > section.fecha',
			title: 'section.encabezado > h1',
			urls: 'section > div > article > h2 > a'
		}
	},
	{
		siteURL: 'https://actualidad.rt.com',
		name: 'RT',
		type: 'home',
		homeNewsSelector: [
			'body > div > main > div > section > div > div > div > div > article > div. > div > div > div > a'
		],
		objectDefinition: {
			content:
				'body > div > main > div > section > div > div > div > div > div > div > div > div > p',
			author: 'div > section > section > a',
			date:
				'body > div > main > div > section > div > div > div > div > div > div > div > div > time',
			title:
				'body > div > main > div > section > div > div > div > div > div > div > div > div > h1',
			urls:
				'body > div > main > div > section > div > div > div > div > div > div > div > div > p > a'
		}
	},
	{
		siteURL: 'https:/www.eluniverso.com',
		name: 'ElUniverso',
		type: 'home',
		homeNewsSelector: ['div > div > div > div > div > div > div > div > h2 > a'],
		objectDefinition: {
			content:
				'div > div > div > div > div > div > div > div > div > div > div > div > div > div > p',
			author: '',
			date: 'div > div > div > div > div > div > div > div > div > div > div > div > span',
			title: 'div > div > div > div > div > div > h1',
			urls:
				'div > div > div > div > div > div > div > div > div > div > div > ul > li > div > span > a'
		}
	}
	// { from: 'origin', name: 'El Comercio', url: 'https://www.elcomercio.com' },
	// { from: 'origin', name: 'CNN en Español', url: 'https://cnnespanol.cnn.com' }
];

export default sites;
