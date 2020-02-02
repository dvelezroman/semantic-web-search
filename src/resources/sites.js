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
		homeNewsSelector: ['article > h1 > a'],
		objectDefinition: {
			content: '#cuerpo > p.capital',
			author: '#cuerpo > div.barra > section > section > a',
			date: '#cuerpo > div.barra > div > section.fecha',
			title: '#nota > section.encabezado > h1',
			urls:
				'#cuerpo > section.listado.ademas.redaccion.notas4.floatFix > div:nth-child(2) > article > h2 > a'
		}
	}
	// { from: 'origin', name: 'RT', url: 'https://actualidad.rt.com' },
	// { from: 'origin', name: 'El Universo', url: 'https://www.eluniverso.com' },
	// { from: 'origin', name: 'El Comercio', url: 'https://www.elcomercio.com' },
	// { from: 'origin', name: 'CNN en Español', url: 'https://cnnespanol.cnn.com' }
];

export default sites;
