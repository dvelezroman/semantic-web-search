import moment from 'moment';
import { regexs } from './consts';

export const getNowTime = () => moment().format('YYYY-MM-DD');

export const parseDate = (dateString, format) =>
	moment(dateString[0].replace(' de ', ' '), format, 'es')
		.locale('en')
		.format('YYYY-MM-DD');

export const isValidUrl = url => {
	let isValid = false;
	Object.keys(regexs).forEach(key => {
		if (!regexs[key].test(url)) {
			isValid = true;
		}
	});
	return isValid;
};
