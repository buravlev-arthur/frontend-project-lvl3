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

export default parseXMLTree;
