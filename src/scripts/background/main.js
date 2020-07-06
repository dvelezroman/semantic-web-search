/* global chrome */
// import browser from 'webextension-polyfill';
import LocalStorage from '../../business/LocalStorage';
import { localScrapping } from './business';

// const browser = window.browser || window.chrome;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'local') {
    localScrapping(request.data.numJobs).then(() => {
      sendResponse({ farewell: 'Scrapping completed...' });
    });
  }
  if (request.type === 'clearStorage') {
    LocalStorage.clearStorage('newsInstances').then(() => {
      sendResponse({ farewell: 'Storage cleaned...', complete: true });
    });
  }
  return true;
});
