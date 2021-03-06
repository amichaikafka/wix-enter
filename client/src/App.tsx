import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import DarkModeToggle from "react-dark-mode-toggle";
import Tickets from './tickets';
import pinTickets from './pin-ticket'
//import listTickets from './list';
import lstTickets from './list-ticket';
import ListTickets from './lst-ticket';

import './Button';
import Button from './Button';
import { createButtonFunc } from './button-func';


export type AppState = {
	tickets?: Ticket[],
	search: string,
	pinnedTickets: Ticket[],
	isDark: boolean;
	sortDownArray: boolean[];
	sortBy: string;
	page: number;
	totalResults:number;

}

const api = createApiClient();
const t = createButtonFunc();



export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		pinnedTickets: [],
		isDark: false,
		sortDownArray: [false, false, false],
		sortBy: '',
		page: 1,
		totalResults:0

	}

	searchDebounce: any = null;

	async componentDidMount() {


		const ans = await api.getTickets(this.state.sortBy, false, this.state.page,'');
		
		const tickets=ans[0];
		const totalResults=ans[1];
		var newTickets = tickets.map((ticket) => ({ ...ticket, isPin: false }));
		this.setState({
			tickets: newTickets,totalResults:totalResults
		});
	}


scrollUp() {
	
  window.scrollTo(0, 0)
}

	
	/**
	 * This function will be active iff one of the pin  buttons was pressed.
	 * The function uptades the  isPin of the tickts.
	 * Accordind to the new value of  ispin the ticket will be add/remove from/to the pinnedTickets array,
	 * that contain all the ticket that pinned.
	 * @param ticket -the ticket that un/pinned.
	 */
	// handleClick = (ticket: Ticket) => {
	// 	ticket.isPin = !ticket.isPin;
	// 	if (ticket.isPin) this.setState({ pinnedTickets: [...this.state.pinnedTickets, ticket] } );
	// 	else {
	// 		const { pinnedTickets } = this.state;
	// 		const pinneds = this.state.pinnedTickets;
	// 		if (pinneds) {
	// 			const idx = pinneds.findIndex(t => t.id === ticket.id)
	// 			pinneds.splice(idx, 1);
	// 			this.setState({ pinnedTickets : pinneds });
	// 			this.forceUpdate();
	// 		}
	// 	}
	// }
	handleClick = (ticket: Ticket) => {
		//ticket.isPin = !ticket.isPin;

		this.setState({ pinnedTickets: t.handleClick(ticket, this.state.pinnedTickets) });
		this.forceUpdate();


	}

	// textToShow = (ticket: Ticket) => {
	// 	if (ticket.isShowAll) {

	// 		return "dfd";
	// 	} else {
	// 		return ticket.content;

	// 	}

	// }
	cutContent=(content:string)=>{
		var ans=content.substr(0,100);
		return ans;

	}



	// renderTickets = (tickets: Ticket[]) => {

	// 	const filteredTickets = tickets
	// 		.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()) && !t.isPin);


	// 	return (<ul className='tickets'>
	// 		{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
	// 			<button className='btn pin-button' onClick={() => { this.handleClick(ticket) }}>Pin</button>
	// 			<h5 className='title'>{ticket.title}</h5>
	// 			<p className="content">{this.cutContent(ticket.content)}</p>
	// 			<footer>
	// 				<div className= 'meta-data'>By {ticket.userEmail}  {new Date(ticket.creationTime).toLocaleString()}</div>
	// 			</footer>
	// 		</li>))}
	// 	</ul>);
	// }
	// renderTickets = (tickets: Ticket[]) => {

	// 	const filteredTickets = tickets
	// 		.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()) && !t.isPin);


	// 	return (<ul className='tickets'>
	// 		{filteredTickets.map((ticket) => (<Tickets ticket={ticket} key={ticket.id} handleClick={()=>this.handleClick(ticket)} ></Tickets>
	// 		))}
	// 	</ul>);
	// }
	/**
	 * This function is in charge of displaying the pinned thickets.
	 * To achive the goal of the pin button, an array tickets was defind that will contain 
	 * all the pinned tickets and will dispaly before those who didnt pin.
	 * If pin button was pressed this will change ticket.isPin to true,if it allready was true so to false.  
	 * @param pinnedTickets 
	 */
	// renderPinnedTickets = (pinnedTickets: Ticket[]) => {
	// 	// return (<ul className='tickets'>
	// 	// 	{pinnedTickets.map((ticket) => (<li key={ticket.id} className='ticket pinnedTickets'>
	// 	// 		<button className='btn pin-button' onClick={() => { this.handleClick(ticket) }}>Unpin</button>
	// 	// 		<h5 className='title'>{ticket.title}</h5>
	// 	// 		<p className="content">{this.cutContent(ticket.content)}</p>
	// 	// 		<footer>
	// 	// 			<div className='meta-data'>By {ticket.userEmail}  {new Date(ticket.creationTime).toLocaleString()}</div>
	// 	// 		</footer>
	// 	// 	</li>))}
	// 	// </ul>);
	// 	return (<ul className='tickets'>
	// 	{pinnedTickets.map((ticket) => (<Tickets ticket={ticket} key={ticket.id} handleClick={()=>this.handleClick(ticket)} ></Tickets>
	// 	))}
	// </ul>);
	// }


	onSearch = async (val: string, newPage?: number) => {
		
	this.setState({search: val,page:1},()=>this.getTickets());
	}

	/**
	 * This function will be active iff one of the mode buttons was pressed.
	 * The function change the isDark state.
	 * According to the new value of isDark state the function will add/remove the class dark-mode,
	 * that in charge of display the dark mode.
	 */
	onChangeMode = () => {
		this.setState({
			isDark: !this.state.isDark
		}, () => {
			if (this.state.isDark) { document.body.classList.add('dark-mode') }
			else {
				document.body.classList.remove('dark-mode')
			}
		}
		)
	}

	/**
	 * This function will be active iff one of the sortBy buttons was pressed.
	 * The function use the sortBy parmeter of the ApiClient to sort the tickets by parmeter (date,title,email).
	 * The sort performed in the ApiClient.
	 * NOTE: if a button wes pressed two times in a row thats will change the sortDwon state to true,
	 * therfore the sort will be in revers.
	 * @param tickets 
	 * @param sortBy -way of sort, change the sortBy state to this ,for saveing to next time.
	 */

	//  sort =(tickets:Ticket[]|undefined,sortBy:string) =>{
	// 	this.sortDown();
	// 	this.setState({sortBy:sortBy});
	// 	//const tick=t.sort(tickets,sortBy,this.state.sortDown);
	// 	const newThickets=api.sortBy(tickets,sortBy,this.state.sortDown);
	// 	this.setState({tickets:newThickets});

	// }
	/**
	 * This function will be active iff one of the sortBy buttons was pressed.
	 * The function send a request to the server to sort the tickets by parmeter (date,title,email).
	 * The server sort the data and send it beck to the client.
	 * NOTE: if a button wes pressed two times in a row thats will change the sortDwon state to true,therfore the sort will be in revers.
	 * @param tickets 
	 * @param sortBy -way of sort, change the sortBy state to this for saveing to next time.
	 */

	sort = async (tickets: Ticket[] | undefined, sortBy: string, sortDown: number) => {

		this.setState({ sortBy: sortBy },()=>this.getTickets());

	}
	getTickets= async()=>{
		const ans = await api.getTickets(this.state.sortBy, this.state.sortDownArray[0], this.state.page,this.state.search);
		const ticketByRequst=ans[0];
		const totalResults=ans[1];

			const newTickets = ticketByRequst.map((ticket) => ({ ...ticket, isPin: false, isShowAll: false, isDisplay: true }));
			this.setState({
				tickets: newTickets, totalResults:totalResults
			});
	}

	/**
	 * This function is in charge of changing the sortDwon state when pressing a sort button. 
	 */
	sortDown = (sortBy: string, sortDown: number) => {
		console.log(sortBy);
		const sortArray = this.state.sortDownArray;
		console.log(this.state.sortDownArray);
		for (let i = 0; i < sortArray.length; i++) {
			if (i == sortDown) {
				sortArray[i] = !sortArray[i]
			} else {
				sortArray[i] = false;
			}
		}
		this.setState({ sortDownArray: sortArray });
		console.log(this.state.sortDownArray);
	}

	/**
	 * This function will be active iff one of the page buttons was pressed.
	 * Because there is no need to send all the data every time, the data is divided to parts (20 for each),
	 * those part will be represent in the web as a pages,each page will display up to 20 tickets.
	 * The function send a request to the server to bring the next page(or previous).
	 * @param page -the page number we are looking for.
	 */
	pageNumber = async (page: string) => {
		clearTimeout(this.searchDebounce);

		if (page === "next" && this.state.page < Math.ceil(this.state.totalResults/20)) {

			this.setState({
				page: this.state.page + 1
			},()=>this.getTickets());

		} else if (page === "prev" && this.state.page > 1) {

			this.setState({
				page: this.state.page - 1
			},()=>this.getTickets());

		}
		this.scrollUp();
	
	}


	render() {
		//const { tickets, pinnedTickets } = this.state;
		const { tickets} = this.state;

		return (<main className={this.state.isDark ? 'dark-mode' : ''}>
			<button className="btn button-mode" onClick={this.onChangeMode}>{this.state.isDark? 'Light':"dark"}</button>
			{/* <button className="button-mode" onClick={()=>this.state.isDark=!this.state.isDark}>dark</button> */}
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value, 5)} />
			</header>
			<button className="btn sort-button" onClick={() => this.sort(tickets, "date", 0)}>sort by date</button>
			<button className="btn sort-button" onClick={() => this.sort(tickets, "title", 1)}>sort by title</button>
			<button className="btn sort-button" onClick={() => this.sort(tickets, "email", 2)}>sort by Email</button>
			{tickets ? <div className='results'>Page number {this.state.page}.<br></br>Showing {tickets.length} results in this page,Out of
			 {this.state.totalResults} in {Math.ceil(this.state.totalResults/20)} pages</div> : null}
		
			{/* {pinnedTickets && this.renderPinnedTickets(pinnedTickets)}
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>} */}
			{/* <lstTickets tickets={this.state.tickets} handleClick={() =>{ this.handleClick()}} ></lstTickets> */}
			<ListTickets Tickets={this.state.tickets? this.state.tickets:[] } ></ListTickets>
			

			
			<div className="page-button-location">
				<button className=" btn button-page left" onClick={() => this.pageNumber("prev")} >{this.state.page - 1 > 0 ? this.state.page - 1 : '(X)'}</button>
				<button className="btn button-page right" onClick={() => this.pageNumber("next")}>{this.state.page + 1 < Math.ceil(this.state.totalResults/20)+1 ? this.state.page + 1 : '(X)'}</button>
			</div>


		</main>)
	}
}

export default App;