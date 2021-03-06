import React from 'react';
import './App.scss';
import { Ticket } from './api';
import Tickets from './tickets';

export type ticketsState = {
    pinTicket: Ticket[];
}

export class ListTicket extends React.PureComponent<{Tickets:Ticket[]}, ticketsState> {
    state: ticketsState = {
        pinTicket: []

    }
    handleClick = (ticket: Ticket) => {
        ticket.isPin = !ticket.isPin;
        var newPinTicket = this.state.pinTicket
        if (ticket.isPin) {
            newPinTicket.push(ticket);
            this.setState({ pinTicket: newPinTicket });
            this.forceUpdate();
        }
        else {

            const idx = newPinTicket.findIndex(t => t.id === ticket.id)
            newPinTicket.splice(idx, 1);
            this.setState({ pinTicket: newPinTicket });
            this.forceUpdate();
        }
    }




    render() {

        const filteredTickets = this.props.Tickets
            .filter((t) => (!t.isPin));
            

        return (<div> {this.state.pinTicket&&<ul className='tickets'>      
        {this.state.pinTicket.map((ticket) => (<Tickets ticket={ticket} key={ticket.id} handleClick={() => this.handleClick(ticket)} ></Tickets>
        ))}
    </ul>}
        <ul className='tickets'>
            {filteredTickets.map((ticket) => (<Tickets ticket={ticket} key={ticket.id} handleClick={() => this.handleClick(ticket)} ></Tickets>
            ))}
        </ul></div>)



    }
}

export default ListTicket;