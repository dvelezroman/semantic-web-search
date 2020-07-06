const browser = window.browser || window.chrome;
console.log({ browser });

class LocalStorageRaw {
	constructor(storageKey) {
		this.storageKey = storageKey;
	}

	setItem(data) {
		return new Promise(async (resolve, reject) => {
			const oldData = await this.getItem();
			console.log({ oldData });
			if (!oldData.error && oldData.data && oldData.data.newsInstances) {
				const updatedData = [...oldData.data.newsInstances, ...data];
				browser.storage.local.set({
					[this.storageKey]: updatedData,
				});
				resolve({ msg: 'Data was saved in Local Storage...', error: false });
			} else {
				browser.storage.local.set({
					[this.storageKey]: [...data],
				});
				resolve({ msg: 'Data was  in Local Storage...', error: true });
			}
		});
	}

	getItem() {
		return new Promise((resolve, reject) => {
			browser.storage.local.get([this.storageKey], data => {
				resolve({ msg: 'Data retrieved', data, error: false });
			});
		});
	}

	findItem(instances, url) {
		return new Promise((resolve, reject) => {
			const exists =
				instances &&
				instances.data &&
				instances.data.newsInstances &&
				instances.data.newsInstances.filter(
					instance => instance.siteURL === url
				);
			resolve(Array.isArray(exists) && exists.length > 0);
		});
	}

	dropItem(key) {
		return new Promise((resolve, reject) => {
			try {
				browser.storage.local.removeItem(key);
				resolve({ msg: 'Element deleted.', error: false });
			} catch (error) {
				reject({ msg: 'Error while removing data.', error });
			}
		});
	}

	clearStorage(key) {
		return new Promise((resolve, reject) => {
			try {
				browser.storage.local.remove(this.storageKey);
				resolve({ msg: 'The storage was cleaned.', error: false });
			} catch (error) {
				reject({ msg: 'Error while cleaning the store data.', error });
			}
		});
	}
}

const LocalStorage = new LocalStorageRaw('newsInstances');

export default LocalStorage;
