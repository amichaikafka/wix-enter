import axios from 'axios';
import { APIRootPath } from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
    isPin:boolean;
    


}


export type ApiClient = {
    getTickets: (sortBy: string, sortDown: boolean,page:number|undefined,superSearch?:string) => Promise<[Ticket[],number]>;
    sortBy: (tickets: Ticket[] | undefined, sortBy: string, sortDown: boolean,page:number) => Ticket[]|undefined;
}

export const createApiClient = (): ApiClient => {

    return {
        getTickets: (sortBy: string, sortDown: boolean,page:number|undefined,superSearch?:string) => {
            console.log(APIRootPath);
            //send param to the server 
            return axios.get(APIRootPath,{params:{sortBy,sortDown,page,superSearch}}).then((res) => (res.data));

        },
        sortBy: (tickets: Ticket[] | undefined, sortBy: string, sortDown: boolean) => {
            if (sortBy === "date") { return sortByDate(tickets, sortDown) }
            else if (sortBy === "title") { return sortByTitle(tickets, sortDown) }
            else if (sortBy === "email") { return sortByEmail(tickets, sortDown) }
        }
    }
}


/**
 * Using those three functions for sorting by pramter in the ApiClinet
 * @param tickets 
 * @param sortDown 
 */

function sortByDate(tickets: Ticket[] | undefined, sortDown: boolean) {

    if (tickets) {
        if (!sortDown) {
            tickets.sort((a, b) => a.creationTime - b.creationTime);
            return tickets;
        } else {
            tickets.sort((a, b) => b.creationTime - a.creationTime);
            return tickets;

        }
    }
}

function sortByTitle(tickets: Ticket[] | undefined, sortDown: boolean) {
    console.log(tickets);

    if (tickets) {
        if (!sortDown) {
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
function sortByEmail(tickets: Ticket[] | undefined, sortDown: boolean) {


    if (tickets) {
        if (!sortDown) {
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



