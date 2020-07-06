import rp from 'request-promise';
import cheerio from 'cheerio';
import { useState } from 'react';
import useSentiment from './useSentiment';

const useSearch = () => {
  const { getScore } = useSentiment();

  const getTitlesFromInfobae = ($) => {
    const from = 'Infobae';
    const titles = $('.search-feed-list-item')
      .get()
      .map((repo) => {
        const $repo = $(repo);
        const href = $repo.find('a').attr('href');
        const title = $repo.find('a').text();
        const description = $repo.find('.blurb').text();
        const author = $repo.find('.author').text();
        const date = $repo.find('.timestamp').text();
        const sentimentScore = getScore(description, 'es');
        return {
          title,
          description,
          author,
          date,
          from,
          href: `https://www.infobae.com${href}`,
          sentimentScore,
        };
      });
    return titles;
  };

  // const getTitlesFromElClarin = ($) => {
  //   const from = 'Clarín';
  //   const titles = $('.gs-result')
  //     .get()
  //     .map((repo) => {
  //       const $repo = $(repo);
  //       const title = $repo.find('a').text();
  //       const href = $repo.find('a').attr('href');
  //       const description = $repo.find('.gs-bidi-start-align b').text();
  //       const author = $repo.find('.author').text();
  //       const date = $repo.find('.gs-bidi-start-align').text();
  //       return { title, description, author, date, from, href };
  //     });
  //   console.log({ titles });
  //   return [];
  // };

  // const getTitlesFromElUniverso = ($) => {
  //   const from = 'RT Noticias';
  //   const titles = $('.Search-group')
  //     .get()
  //     .map((repo) => {
  //       const $repo = $(repo);
  //       const title = $repo.find('a').text();
  //       const description = $repo.find('.gs-bidi-start-align b').text();
  //       const author = $repo.find('.author').text();
  //       const date = $repo.find('.gs-bidi-start-align').text();
  //       return { title, description, author, date, from };
  //     });
  //   return titles;
  // };

  const urls = {
    infobae: {
      url: 'https://www.infobae.com/search/{text_to_search}/?q{text_to_search}',
      callback: getTitlesFromInfobae,
    },
    // elClarin: {
    //   url: 'https://www.clarin.com/buscador/?q={text_to_search}',
    //   callback: getTitlesFromElClarin,
    // },
    // elUniverso: {
    //   url: 'https://www.eluniverso.com/resultados?search={text_to_search}',
    //   callback: getTitlesFromElUniverso,
    // },
  };

  const [allTitles, setAllTitles] = useState([]);

  const onSearch = (text) => {
    // console.log('A buscar...');
    Object.keys(urls).map(async (item) => {
      console.log({ item });
      const searchUrl = getFormattedText(text, urls[item].url);
      let data = null;

      data = await rp(`https://cors-anywhere.herokuapp.com/${searchUrl}`).then(
        (html) => html
      );

      const $ = cheerio.load(data);
      const titles = urls[item].callback($);
      console.log({ titles });
      const getTitles = [...allTitles];
      setAllTitles([...getTitles, ...titles]);
    });
  };

  const getFormattedText = (text, url) => {
    const words = text.trim().replace(' ', '+');
    return url.replace('{text_to_search}', words, 'gi');
  };

  return { onSearch, allTitles };
};

export default useSearch;
