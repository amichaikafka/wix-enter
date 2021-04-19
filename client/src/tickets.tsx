import React from 'react';
import './App.scss';
import { Ticket } from './api';

export type ticketsState = {
    isShowAll: boolean;

}
/** 
* This Component is in charge of displaying every  thicket. 
*/

export class Tickets extends React.PureComponent<{ ticket: Ticket, handleClick: (ticket: Ticket) => void}, ticketsState> {
    state: ticketsState = {
        isShowAll: false,
   
    }
   /**
    * 
    * This function is in charge of the how much contact to display (according to showless/more button)
    * @returns contact to dispaly
    */
    cutContent=()=> {
        const content = this.props.ticket.content;
        if (content.length > 100 && !this.state.isShowAll) {
            return content.substring(0, 100) + "...";
        } else {
            return content;
        }
    }



    toggleIsShow = () => {
        this.setState({ isShowAll: !this.state.isShowAll })
    }

    className=()=>  {
        if (this.state.isShowAll) {
            if (this.props.ticket.isPin) {
                return 'ticket pinnedTickets ticket-shwo-all';
            } else {
                return 'ticket ticket-shwo-all';
            }
        }
        else if (this.props.ticket.isPin) {
            return 'ticket pinnedTickets';
        } else {
            return 'ticket';
        }
    }


    render() {
      


        return (
           

            <li className={this.className()}>
               
                <button className={this.props.ticket.isPin ? 'btn btn-on' : 'btn pin-button'} onClick={() => { this.props.handleClick(this.props.ticket) }}>{this.props.ticket.isPin ? 'Unpin' : 'Pin'}</button>
                <h5 className='title'>{this.props.ticket.title}</h5>
                <p className="content">{this.cutContent()}</p>
                {this.props.ticket.content.length > 100 && <button className={this.state.isShowAll ? 'btn btn-on' : 'btn pin-button'} onClick={this.toggleIsShow}>{this.state.isShowAll?'Show less':'Show more'}</button>}
                <ul className='labels'>
                   {this.props.ticket.labels?this.props.ticket.labels.map((label)=><div className='label-show' key={label}>{label}</div>):null}
                </ul>
                <footer>
                    <div className='meta-data'>By {this.props.ticket.userEmail}  {new Date(this.props.ticket.creationTime).toLocaleString()}</div>
                </footer>
               

            </li>

        )

    }
}


export default Tickets;