import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { Ticket } from '../client/src/api';
import { searchconsole } from 'googleapis/build/src/apis/searchconsole';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {

  var newtempData = search(tempData, req.query.superSearch);

  // @ts-ignore
  const page: number = req.query.page || 1;


  if (newtempData) {
    var paginatedData
    if (req.query.sortBy === "date") { (sortByDate(newtempData, req.query.sortDown)); }
    else if (req.query.sortBy === "title") { sortByTitle(newtempData, req.query.sortDown); }
    else if (req.query.sortBy === "email") { (sortByEmail(newtempData, req.query.sortDown)); }
  }
  if (newtempData) {
    paginatedData = newtempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }

  var ans = [paginatedData, newtempData?.length];


  res.send(ans);

});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)
/**
 * Using those three functions for sorting by pramter in the server
 * @param tickets 
 * @param sortDown 
 */
function sortByDate(tickets: Ticket[], sortDown: {} | any) {

  if (tickets) {
    if (sortDown != 'true') {
      tickets.sort((a, b) => a.creationTime - b.creationTime);
      return tickets;
    } else {
      tickets.sort((a, b) => b.creationTime - a.creationTime);
      return tickets;

    }
  }
}

function sortByTitle(tickets: Ticket[] | undefined, sortDown: { date: number, title: number, email: number } | any) {

  if (tickets) {
    if (sortDown != 'true') {
      tickets.sort((a, b) => {
        var x = a.title.toLowerCase();
        var y = b.title.toLowerCase();
        if (x < y) { return -1; }
        return 1;
      });
      return tickets;
    } else {

      tickets.sort((a, b) => {
        var x = a.title.toLowerCase();
        var y = b.title.toLowerCase();
        if (x < y) { return 1; }
        return -1;
      });
      return tickets;
    }

  }
}
function sortByEmail(tickets: Ticket[] | undefined, sortDown: {} | any) {


  if (tickets) {
    if (sortDown[28] != 'true') {
      tickets.sort((a, b) => {
        var x = a.userEmail.toLowerCase();
        var y = b.userEmail.toLowerCase();
        if (x < y) { return -1; }
        return 1;
      });
      return tickets;
    } else {
      tickets.sort((a, b) => {
        var x = a.userEmail.toLowerCase();
        var y = b.userEmail.toLowerCase();
        if (x < y) { return 1; }
        return -1;
      });
      return tickets;

    }
  }
}
/**
 * The goal of this function is to search according to the deamend from the client
 * The search soppurt in regular search search by email and search by server
 * Note:for the email mode it has to be writting like that:from:[email]
 * and for the label like that: label:[lable]
 * @param tickets 
 * @param superSearch -value to search
 * @returns tickets by demand
 */
function search(tickets: Ticket[] | undefined, superSearch: string | any) {
  var searcBy = superSearch.substring(0, 5);
  if (searcBy.toLowerCase() === "from:") {
    var newSuperSearch = superSearch.substring(5);
    if (newSuperSearch.includes(' ') && newSuperSearch.includes('@')) {
      tickets = searchByEmail(tickets, newSuperSearch);
      return tickets;
    }
  }
  searcBy = superSearch.substring(0, 6);
  if (searcBy.toLowerCase() === "label:") {
    var newSuperSearch = superSearch.substring(6);
    tickets = searchByLabel(tickets, newSuperSearch);
    return tickets;

  }
  var newTicket = tickets;
  if (tickets) {
    newTicket = tickets.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(superSearch.toLowerCase()));
  }
  tickets = newTicket;
  return tickets;
}

function searchByEmail(tickets: Ticket[] | undefined, email: string | any) {
  var newTicket = tickets;
  var index = cutSearch(email);
  if (tickets) {
    var searchEmail = email.substring(0, index - 1);
    newTicket = tickets.filter((t) => (t.userEmail.toLowerCase()) === (searchEmail.toLowerCase()));
  }
  var wordToSearch = email.substring(index);
  if (newTicket) {
    newTicket = newTicket.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(wordToSearch.toLowerCase()));
  }
  tickets = newTicket;

  return tickets;
}
function searchByLabel(tickets: Ticket[] | undefined, label: string | any) {
  var newTicket = tickets;
  if (tickets) {

    newTicket = tickets.filter((t) => (t.labels?.map((label) => (label.toLowerCase())).includes(label.toLowerCase())));

  }
  tickets = newTicket;

  return tickets;

}

function cutSearch(search: string) {
  var i = 0;
  var flag = false;
  while (!flag) {
    if (search.charAt(i) === ' ') {
      flag = true;
    }
    i++;
  }
  return i;
}

