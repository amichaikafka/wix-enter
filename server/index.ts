import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import {Ticket} from '../client/src/api';
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
  console.log(req.query.superSearch);
 

var newtempData=search(tempData,req.query.superSearch);



if(newtempData){
  console.log("ssss");
  
console.log(newtempData.length);
}
newtempData
  // @ts-ignore
 const page: number = req.query.page || 1;
 if(newtempData){
  var paginatedData
  if (req.query.sortBy === "date") { ( sortByDate(newtempData, req.query.sortDown)); }
  else if (req.query.sortBy === "title") {sortByTitle(newtempData, req.query.sortDown); }
  else if (req.query.sortBy === "email") { ( sortByEmail(newtempData, req.query.sortDown)); }
 }
  if(newtempData){
  paginatedData = newtempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }

   var ans=[paginatedData,newtempData?.length];
   

 
  res.send(ans);
  
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)
/**
 * Using those three functions for sorting by pramter in the server
 * @param tickets 
 * @param sortDown 
 */
function sortByDate(tickets: Ticket[], sortDown: string|any) {

  if (tickets) {
      if (sortDown==='false') {
          tickets.sort((a, b) => a.creationTime - b.creationTime);
          return tickets;
      } else {
          tickets.sort((a, b) => b.creationTime - a.creationTime);
          return tickets;

      }
  }
}

function sortByTitle(tickets: Ticket[] | undefined, sortDown: string|any) {
 

  if (tickets) {
      if (sortDown==='false') {
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
function sortByEmail(tickets: Ticket[] | undefined, sortDown:string|any) {


  if (tickets) {
      if (sortDown==='false') {
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
function search(tickets :Ticket[]|undefined,superSearch:string|any){
  console.log("oooooooooooooooooo");
  console.log(superSearch);
  
  
  var searcBy=superSearch.substring(0,5);

  if(searcBy==="from:"){
   var newSuperSearch=superSearch.substring(5);
    if(newSuperSearch.includes(' ')&&newSuperSearch.includes('@')){
console.log("nnnnnnnn");

    tickets=searchByEmail(tickets,newSuperSearch);
    return tickets;
    }
  }
  
  var newTicket=tickets;
  if(tickets){
  newTicket=tickets.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(superSearch.toLowerCase()));
  }
  tickets=newTicket;
  return tickets;
  
  

}
function searchByEmail(tickets :Ticket[]|undefined,email:string|any){
  console.log("111111")
  var newTicket=tickets;
  console.log("222222");
  
  var index=cutSearch(email);
  console.log("33333333")
  if(tickets){
    console.log("4444444")
  var searchEmail=email.substring(0,index);
  console.log(searchEmail.toLowerCase());
  
  console.log("555555555");
  
 console.log(tickets[0].userEmail);


  newTicket=tickets.filter((t) => (t.userEmail.toLowerCase())===(searchEmail.toLowerCase()));
  console.log(newTicket);
  
  console.log("666666666");
  
  }
  var wordToSearch=email.substring(index);
  console.log(wordToSearch);
  
  console.log("77777777");
  
  if(newTicket){
    console.log("88888888");
    
  newTicket=newTicket.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(wordToSearch.toLowerCase()));
  console.log("99999999");
  
  }
  tickets=newTicket;
  console.log("kkkkkkkkkk");
  
  return tickets;

} 
function cutSearch(search:string){
  var i=0;
  var flag=false;
  while(!flag){
    if(search.charAt(i)===' '){
      flag=true;
    }
    i++;
  }
  return i;
}

