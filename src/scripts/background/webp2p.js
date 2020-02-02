import { AbstractP2PExtensionBackground } from './conector';
import { scrapping } from './main';

export class NewsP2P extends AbstractP2PExtensionBackground {
	constructor() {
		super();
	}

	browserAction() {
		//conector para realizar algun actividad
	}

	showUsers(peers) {}

	getExtensionName() {
		return 'webp2p';
	}
	getExtensionId() {
		return 'webp2p@oncosmos.com';
	}

	initialize() {
		this.startCollaborativeScraping();
	}

	startCollaborativeScraping() {
		console.log('Inicializacion de funcion');
		//this.getPeers(this.collaborativeScraping);
	}

	receiveMessage(msg, peer) {
		console.log('Receive message');
		console.log(msg);
	}

	collaborativeScraping(peers) {
		console.log('Hace algo');
	}

	processResponse(msg, peer) {
		console.log('Process response');
		console.log(msg);
		console.log(peer);
	}

	processRequest(msg, peer) {
		//dataTemp=msg.data;
		//remoteuser=peer;
		//console.log("Por ahora solo recive datos");
		console.log('Process request');
		console.log(msg);
		console.log(peer);
		/*
     let url_resource=browser.extension.getURL("user_webp2p.html");
     console.log(url_resource);
     browser.tabs.create({
         "url": url_resource,
     });
     */
	}

	receiveResponse(msg, peer) {
		console.log('Receive data');
		console.log(msg);
	}

	async automaticProcessing(extractor, peer) {
		/*
      let news = this.processExtractor(extractor);
      let msg = {'data':news};
      return msg;
      */
		const start = performance.now();
		const dataScrapped = await scrapping(extractor.info);
		console.log({ extractor });
		console.log('Data scrapped ========================');
		console.log({ dataScrapped });
		console.log('Scrappie y procesé la data, ahora la envío al Peer: ', peer);
		const end = performance.now();
		const timeElapsed = end - start;
		console.log(`The process took ${timeElapsed} miliseconds.`);
		this.sendResponse({ data: { dataScrapped, timeElapsed } }, peer);
	}
}
