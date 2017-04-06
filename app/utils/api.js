// const news = [
//     {
//         title: 'News title 1',
//     }, {
//         title: 'News title 2',
//     }, {
//         title: 'News title 3',
//     },
// ];
import news from '../../testData.json';

export default() => new Promise(resolve => setTimeout(() => resolve(news.data.nodeQuery), 2000));
