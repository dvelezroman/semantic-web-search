import sentiment from 'multilang-sentiment';

const useSentiment = () => {
	const getScore = (text, lang) => {
		const score = sentiment(text, lang);
		return score;
	};

	return { getScore };
};

export default useSentiment;
