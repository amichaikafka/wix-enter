import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import {App,AppState} from './App';

export type buttonFunc = {
    handleClick:  (ticket: Ticket,pinnedTickets:Ticket[]) =>Ticket[];
    
}
export const createButtonFunc = (): buttonFunc => {
   

    return {
      
        handleClick : (ticket: Ticket,pinnedTickets:Ticket[]) => {
            ticket.isPin = !ticket.isPin;
            if (ticket.isPin){
                 pinnedTickets.push(ticket);
                 return pinnedTickets;
            }
            else {
                const pinneds = pinnedTickets;
                    const idx = pinneds.findIndex(t => t.id === ticket.id)
                    pinneds.splice(idx, 1);
                    return pinneds;
            }
        }
    
    }
}



