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
		const { instancesProcessed, scrapTime, processTime } = await scrapping(extractor.info);
		console.log('Data scrapped ======================================================');
		console.log({ instancesProcessed });
		console.log('[INFO] - Terminó el proceso, ahora la devuelvo al Peer: ', peer);
		console.log(`[INFO] - The process took ${scrapTime} miliseconds.`);
		console.log(`[INFO] - The process took ${processTime} miliseconds.`);
		this.sendResponse({ data: { instancesProcessed, scrapTime, processTime } }, peer);
	}
}
