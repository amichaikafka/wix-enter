import React, {useState} from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
import DarkModeToggle from "react-dark-mode-toggle";

import './Button';


export type AppState = {
	tickets?: Ticket[],
	search: string,
	pinnedTickets: Ticket[],
	isDark:boolean;
	
}

const api = createApiClient();


export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		pinnedTickets : [],
		isDark:false
	}

	searchDebounce: any = null;

	async componentDidMount() {
		const tickets = await api.getTickets()
		const newTickets = tickets.map((ticket) => ({ ...ticket, isPin: false }));
		this.setState({
			tickets: newTickets
		});
		
	}
	handleClick = (ticket: Ticket) => {
		ticket.isPin = !ticket.isPin;
		if (ticket.isPin) this.setState({ pinnedTickets: [...this.state.pinnedTickets, ticket] } );
		else {
			const { pinnedTickets } = this.state;
			const pinneds = this.state.pinnedTickets;
			if (pinneds) {
				const idx = pinneds.findIndex(t => t.id === ticket.id)
				pinneds.splice(idx, 1);
				this.setState({ pinnedTickets : pinneds });
				this.forceUpdate();
			}
		}
	}



	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase())&& !t.isPin);

		
		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
				<button className='pin-button' onClick={() => { this.handleClick(ticket) }}>Pin</button>
				<h5 className='title'>{ticket.title}</h5>
				<p className="content">{ticket.content}</p>
				<footer>
					<div className='meta-data'>By {ticket.userEmail}  { new Date(ticket.creationTime).toLocaleString()}</div>
				</footer>
			</li>))}
		</ul>);
	}
	renderPinnedTickets = (pinnedTickets: Ticket[]) => {

		
		return (<ul className='tickets'>
			{pinnedTickets.map((ticket) => (<li key={ticket.id} className='pinnedTickets'>
				<button className='pin-button' onClick={() => { this.handleClick(ticket) }}>Unpin</button>
				<h5 className='title'>{ticket.title}</h5>
				<p className="content">{ticket.content}</p>
				<footer>
					<div className='meta-data'>By {ticket.userEmail}  { new Date(ticket.creationTime).toLocaleString()}</div>
				</footer>
			</li>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	onChangeMode = () => {
		this.setState({
			isDark:!this.state.isDark
		}, () =>{if(this.state.isDark){ document.body.classList.add('dark-mode')}
		else{
			document.body.classList.remove('dark-mode')
		}
	}
		)
	}

	render() {	
		const {tickets,pinnedTickets} = this.state;

		return (<main className={this.state.isDark?'dark-mode':''}>
			<button className="button-mode" onClick={this.onChangeMode}>dark</button>
			{/* <button className="button-mode" onClick={()=>this.state.isDark=!this.state.isDark}>dark</button> */}
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null }	
			{pinnedTickets && this.renderPinnedTickets(pinnedTickets)}
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;