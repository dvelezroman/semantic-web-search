import sentiment from 'multilang-sentiment';
import nlp from 'compromise';

const useSentiment = () => {
  const getScore = (text, lang) => {
    const score = sentiment(text, lang);
    return score;
  };

  const extractTopics = (text) =>
    nlp(text)
      // .normalize()
      .topics() // you can search a specific people here
      .json();

  return { getScore, extractTopics };
};

export default useSentiment;
