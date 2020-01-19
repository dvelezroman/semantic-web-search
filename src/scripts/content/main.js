var pageManager = new ContentPageManager();

//Listening for background's messages
browser.runtime.onMessage.addListener((request, sender) => {
	console.log('[content-side] calling the message: ' + request.call);
	if (pageManager[request.call]) {
		pageManager[request.call](request.args);
	}
});
