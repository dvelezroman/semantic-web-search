export const regexs = {
  youtube: /(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/,
  tweeter: /.+(twitt(er)?).+/,
  instagram: /.+(instagram).+/,
  facebook: /.+(facebook).+/,
  whatsapp: /.+(whatsapp).+/,
  telegram: /.+(telegram).+/,
  pinterest: /.+(pinterest).+/,
  plus: /.+(plus.google.com).+/,
  mailto: /.+(mailto).+/,
  spotify: /.+(spotify).+/,
  linkedin: /.+(linkedin).+/,
};

export const validateUrl = (url) => /^(http(s?)):\/\/.+/gi.test(url);
