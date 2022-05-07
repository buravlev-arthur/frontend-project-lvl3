const parseXMLTree = (content, resourceLink) => {
  const parser = new DOMParser();
  const tree = parser.parseFromString(content, 'application/xml');
  const errorNode = tree.querySelector('parsererror');

  if (errorNode) {
    return null;
  }

  const feed = {
    title: '',
    description: '',
    link: resourceLink,
  };
  const posts = [];

  try {
    const channel = tree.querySelector('channel');
    const channelItems = channel.querySelectorAll('item');

    feed.title = channel.querySelector('title').textContent;
    feed.description = channel.querySelector('description').textContent;

    channelItems.forEach((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;

      posts.push({
        title,
        link,
        description,
        visited: false,
      });
    });

    return { feed, posts };
  } catch {
    return null;
  }
};

const setFeedId = (feed, id) => ({ ...feed, id });

const setPostsIds = (posts, initId, feedId) => {
  const result = posts.map((post, index) => ({ ...post, feedId, id: initId + index }));
  return result;
};

const resourceExists = (url, feeds) => {
  const alreadyExists = feeds.filter((feed) => feed.link === url);

  if (alreadyExists.length > 0) {
    return true;
  }

  return false;
};

const getProxyUrl = (url) => {
  const protocol = 'https';
  const hostname = 'allorigins.hexlet.app';
  const path = '/get';
  const query = `disableCache=true&url=${encodeURIComponent(url)}`;

  const formattedUrl = new URL(`${protocol}://${hostname}${path}?${query}`);

  return formattedUrl.href;
};

export {
  parseXMLTree,
  setFeedId,
  setPostsIds,
  resourceExists,
  getProxyUrl,
};
