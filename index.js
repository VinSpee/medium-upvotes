const cheerio = require('cheerio');
const got = require('got');
const {
  send,
  json,
  createError,
  sendError,
} = require('micro');

const formatNumber = (num) => {
  if (!num) {
    throw createError(404, 'No upvote data found in the target page');
  }
  if (/K$/.exec(num)) {
    const formattedNum = /(\d)\.?(\d)?K/.exec(num);
    return `${formattedNum[1] ? formattedNum[1] : ''}${formattedNum[2] ? `${formattedNum[2]}00` : '000'}`;
  }
  return num;
};

const getVoteCount = (html) => {
  if (!html) {
    throw createError(404, 'No upvote data found in the target page');
  }
  const $ = cheerio.load(html);
  let postID;
  $('script').each((i, el) => {
    const matches = $(el).text().match(/{"id":"(\w+)",/);
    postID = matches && matches[1];
  });
  
  return {
    upvotes: formatNumber($(`[data-post-id="${postID}"] [data-action="show-recommends"]`)
      .map((i, el) => $(el).text()).get()[0]),
    id: postID,
  };
};

const validateURL = (url) => {
  const urlRegex = /(^http)s?:\/\/(?:.+\.\w+)\/(?:.+\/)?(.+)(?:[#|\?]?.+)$|(?:^(?!https?:\/\/))(\w+)/;
  const match = url.match(urlRegex);
  if (match && match.length >= 4 && match[3]) {
    return `https://medium.com/posts/${url}`;
  }
  if (match && match.length >= 3 && match[2]) {
    return url;
  }
  if (match && match.length >= 2 && match[1]) {
    return url;
  }
  throw createError(400, 'Not a valid medium post');
}

module.exports = async (req, res) => { 
  let postURL;
  try {
    const { post } = await json(req);
    postURL = post;
  } catch(err) {
    sendError(req, res, err);
  }
  const isValid = validateURL(postURL);
  let html;
  try {
    html = await got(isValid, {
      headers: {
        'Content-Type': 'application/json'
        'User-Agent': 'Medium Upvote Getter'
      } 
    });
  } catch(err) {
    return sendError(req, res, err);
  }
  try {
    const number = getVoteCount(html.body);
    return send(res, 200, JSON.stringify({ data: number, }));
  } catch (err) {
    if (err === 'No upvote data found in the target page') {
      return sendError(req, res, err);
    }
  }
};
