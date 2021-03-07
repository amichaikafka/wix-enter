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
    getTickets: (sortBy: string, sortDown: {date:number,title:number,email:number},page:number|undefined,superSearch?:string) => Promise<[Ticket[],number]>;
   
}

export const createApiClient = (): ApiClient => {

    return {
        getTickets: (sortBy: string, sortDown:{date:number,title:number,email:number},page:number|undefined,superSearch?:string) => {
            console.log(APIRootPath);
            //send param to the server 
            return axios.get(APIRootPath,{params:{sortBy,sortDown,page,superSearch}}).then((res) => (res.data));

        },
   
    }
}


