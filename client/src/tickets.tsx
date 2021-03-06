import React from 'react';
import './App.scss';
import { Ticket } from './api';

export type ticketsState = {
    isPin: boolean;
    isShowAll: boolean;
}

export class Tickets extends React.PureComponent<{ ticket: Ticket,handleClick:(ticket:Ticket)=>void }, ticketsState> {
    state: ticketsState = {
        isPin: false,
        isShowAll: false
    }
    // cutContent=(content:string)=>{
	// 	var ans=content.substr(0,100);
	// 	return ans;

    // }
    get cutContent() {
        const content = this.props.ticket.content;
        if (content.length > 100 && !this.state.isShowAll) {
            return content.substring(0, 100) + "...";
        } else {
            return content;
        }
    }

    get contentBtn() {
        if (this.state.isShowAll) return 'Show less';
        else return 'Show more'
    }

    toggleIsShow = () => {
        this.setState({ isShowAll: !this.state.isShowAll }, () => console.log(this.state))
    }
    
    render() {


        return (

            <li className={this.props.ticket.isPin? 'ticket pinnedTickets':'ticket'}>
                <button className='btn pin-button' onClick={() => { this.props.handleClick(this.props.ticket) }}>{this.props.ticket.isPin?'Unpin':'Pin'}</button>
                <h5 className='title'>{this.props.ticket.title}</h5>
                <p className="content">{this.cutContent}</p>
                {this.props.ticket.content.length > 100 && <button onClick={this.toggleIsShow}>{this.contentBtn}</button>}
                <footer>
                    <div className='meta-data'>By {this.props.ticket.userEmail}  {new Date(this.props.ticket.creationTime).toLocaleString()}</div>
                </footer>
            </li>

        )

    }
}

export default Tickets;