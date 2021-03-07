import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import DarkModeToggle from "react-dark-mode-toggle";

import AppBar from '@material-ui/core/AppBar';
import ListTickets from './lst-ticket';






export type AppState = {
	tickets?: Ticket[],
	search: string,
	isDark: boolean;
	sortDownArray: { date: number, title: number, email: number };
	sortBy: string;
	page: number;
	totalResults: number;

}

const api = createApiClient();




export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		isDark: false,
		sortDownArray: { date: 0, title: 0, email: 0 },
		sortBy: '',
		page: 1,
		totalResults: 0

	}

	searchDebounce: any = null;

	async componentDidMount() {



		this.getTickets();
	}
	/**
	 * The goal of this function is to call to the API getTickets function and infact 
	 * send a requst to the server by demand
	 */

	getTickets = async () => {

		const ans = await api.getTickets(this.state.sortBy, this.state.sortDownArray, this.state.page, this.state.search);
		const ticketByRequst = ans[0];
		const totalResults = ans[1];

		const newTickets = ticketByRequst.map((ticket) => ({ ...ticket, isPin: false, isShowAll: false }));
		this.setState({
			tickets: newTickets, totalResults: totalResults
		});

	}


	/**
	 * This function is scrolling up the screen when needed
	 */
	scrollUp() {

		window.scrollTo(0, 0)
	}
	/**
	 * This function is in chrage of the search functionalty.
	 * The function send the search value to the server,
	 * then the server send beck only the relevant ticket.
	 * @param val -the search value.
	 * @param newPage 
	 */


	onSearch = async (val: string) => {

		this.setState({ search: val, page: 1 }, () => this.getTickets());
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
	 * The function send a request to the server to sort the tickets by parmeter (date,title,email).
	 * The server sort the data and send it beck to the client.
	 * NOTE: if a button wes pressed two times in a row thats will change the sortDwon state to true,therfore the sort will be in revers.
	 * @param tickets 
	 * @param sortBy -way of sort, change the sortBy state to this for saveing to next time.
	 */

	sort = async ( sortBy: string) => {
		var isSortDown = this.sortDown(sortBy);

		this.setState({ sortBy: sortBy, sortDownArray: isSortDown, page: 1 }, () => this.getTickets());

	}


	/**
	 * This function is in charge of changing the sortDwon state when pressing a sort button. 
	 */
	sortDown = (sortBy: string) => {

		var sortArray = this.state.sortDownArray;
		switch (sortBy) {
			case 'date':
				sortArray['email'] = 0;
				sortArray['title'] = 0;
				if (sortArray['date'] === 0 || sortArray['date'] === 2) {
					sortArray['date'] = 1;
				} else {
					sortArray['date'] = 2;
				}
				break;
			case 'email':
				sortArray['date'] = 0;
				sortArray['title'] = 0;
				if (sortArray['email'] === 0 || sortArray['email'] === 2) {
					sortArray['email'] = 1;
				} else {
					sortArray['email'] = 2;
				}
				break;
			case 'title':
				sortArray['date'] = 0;
				sortArray['email'] = 0;
				if (sortArray['title'] === 0 || sortArray['title'] === 2) {
					sortArray['title'] = 1;
				} else {
					sortArray['title'] = 2;
				}
				break;

		}
		return sortArray;
	}

	/**
	 * This function will be active iff one of the page buttons was pressed.
	 * Because there is no need to send all the data every time, the data is divided to parts (20 for each),
	 * those part will be represent in the web as a pages,each page will display up to 20 tickets(depend on search results).
	 * The function send a request to the server to bring the next page(or previous).
	 * @param page -the page number we are looking for.
	 */
	pageNumber = async (page: string) => {


		if (page === "next" && this.state.page < Math.ceil(this.state.totalResults / 20)) {

			this.setState({
				page: this.state.page + 1
			}, () => this.getTickets());
			this.scrollUp();

		} else if (page === "prev" && this.state.page > 1) {

			this.setState({
				page: this.state.page - 1
			}, () => this.getTickets());
			this.scrollUp();

		}



	}


	render() {

		const { tickets } = this.state;

		return (<main className={this.state.isDark ? 'dark-mode' : ''}>
			<AppBar className='app-bar'>
				<div className="nav-bar">
					<DarkModeToggle className='nav mode-toggle' onChange={this.onChangeMode} checked={this.state.isDark} size={65} speed={3} ></DarkModeToggle>
					<h1 className="nav">Tickets List</h1>
					<header>
						<input className="nav" type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)} />
					</header>
				</div>
				<div className='sort-buttons'>
					<button className={this.state.sortDownArray['date'] > 0 ? "btn btn-on" : "btn sort-button"} onClick={() => this.sort( "date")}>sort by date</button>
					<button className={this.state.sortDownArray['title'] > 0 ? "btn btn-on" : "btn sort-button"} onClick={() => this.sort( "title")}>sort by title</button>
					<button className={this.state.sortDownArray['email'] > 0 ? "btn btn-on" : "btn sort-button"} onClick={() => this.sort( "email")}>sort by Email</button>
				</div>
			</AppBar>
			{tickets ? <div className='results'>{tickets.length !== 0 ? <p>
				Page number {this.state.page}.<br></br>
				Showing {tickets.length} results in this page,Out of {this.state.totalResults} in {Math.ceil(this.state.totalResults / 20)} pages
			</p> : <p>
				There is no results for {this.state.search}.
			</p>}
			</div> : null}
			<ListTickets Tickets={this.state.tickets ? this.state.tickets : []} ></ListTickets>
			<div className="page-button-location">
				<button className=" btn button-page left" onClick={() => this.pageNumber("prev")} >{this.state.page - 1 > 0 ? this.state.page - 1 : '(X)'}</button>
				<button className="btn button-page right" onClick={() => this.pageNumber("next")}>{this.state.page + 1 < Math.ceil(this.state.totalResults / 20) + 1 ? this.state.page + 1 : '(X)'}</button>
			</div>
		</main>)
	}
}

export default App;