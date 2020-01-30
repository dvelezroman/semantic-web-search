import sentiment from 'multilang-sentiment';
import nlp from 'compromise';

const useSentiment = () => {
	const getScore = (text, lang) => {
		const score = sentiment(text, lang);
		return score;
	};

	const extractTopics = text => {
		return nlp(text)
			.normalize()
			.topics();
	};

	return { getScore, extractTopics };
};

export default useSentiment;
