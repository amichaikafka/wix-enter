import {Ticket} from '../client/src/api';

const data = require('./data.json');
// const data2 = require('./data.json');

export const tempData = data as Ticket[];
// const d= tempData;
//  const dataTitle= d.sort((a, b) => {
//     var x = a.title.toLowerCase();
//     var y = b.title.toLowerCase();
//     if (x < y) { return -1; }
//     return 1;
// });
// export const tempDataTitle=dataTitle as Ticket[];
