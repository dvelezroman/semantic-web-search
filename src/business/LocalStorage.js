import browser from 'webextension-polyfill';
// const browser = window.browser || window.chrome;

class LocalStorage {
    static setItem(key, data) { return new Promise((resolve, reject) => {
        chrome.storage.local.set(
			{
				[key]: data
			}
        );
        resolve({ msg: 'Data was saved in Local Storage...', error: false });
    })}

    static getItem(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get({ [key]: [] }, data => {
                resolve({ msg: 'Data retrieved', data, error: false });
            });
        });
        }

    static findItem(instances, url) {
        return new Promise((resolve, reject) => {
            const exists = instances && instances.data && instances.data.newsInstances.filter(instance => instance.siteURL === url)
            resolve(Array.isArray(exists) && exists.length > 0)
        })
    }

    static dropItem(key) { return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.removeItem(key);
            resolve({ msg: 'Element deleted.', error: false })
        } catch (error) {
            reject({ msg: 'Error while removing data.', error})
        }
    })}

    static clearStorage() {
    }
}

export default LocalStorage;