import news from '../../testData.json';

export default() => new Promise(resolve => setTimeout(() => resolve(news.data.nodeQuery), 500));
