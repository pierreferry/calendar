import React, { Component } from 'react';
import FlashMessages from "./flash/FlashMessages.jsx";
import SearchForm from "./components/SearchForm.jsx";
import RoomsTable from "./components/RoomsTable.jsx";
const servAdress = "http://localhost:3000";

class ReservationsPage extends Component {
	constructor() {
		super();
		var date = new Date().toISOString().slice(0, 16);
		this.state = {
			rooms: [],
			initialRooms: [],
			room : [],
			reservations: [],
			datetime: date,
			messages: [],
			duration: 60
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
		this.handleReservation = this.handleReservation.bind(this);
		this.removeMessage = this.removeMessage.bind(this);
	}

	componentDidMount() {
		fetch(servAdress + '/rooms')
		.then(function(response) {
			return response.json();
		})
		.then((json) => {
			this.setState({initialRooms: json.rooms});
			this.setState({rooms: json.rooms})
		})
		.catch(function(ex) {
			console.log('parsing failed', ex);
		});
		fetch(servAdress + '/reservations')
		.then(function(res) {
			return res.json();
		})
		.then((reservations) => {
			this.setState({reservations})
			this.handleSearchSubmit();
		});
	}

	roomToString(room) {
		var string = room.name.toLowerCase();
		room.equipements.forEach(function(equipement) {
			string += equipement.name.toLowerCase();
		});
		return string;
	}

	filterList(event) {
		let updatedList = this.state.initialRooms;

		updatedList = updatedList.filter((room) => {
			return this.roomToString(room).search(
				event.target.value.toLowerCase()) !== -1;
		});
		this.setState({rooms: updatedList});
	}

	handleReservation(room) {
		const data = {
			room: room.name,
			datetime: this.state.datetime,
			duration: this.state.duration
		}
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');

		const options = {
			method: 'POST',
			headers,
			body: JSON.stringify(data)
		};

		fetch(servAdress + '/reservations', options)
		.then(function(response) {
			return response.json();
		})
		.then((json) => {
			if (json.error) {
				this.setState({
					messages: this.state.messages.concat([{type: "error", text: json.error, id: this.state.messages.length + 1}])
				})
			}
			else {
				this.setState({
					reservations: json.reservations,
					messages: this.state.messages.concat([{type: "success", text: "Réservation effectuée", id: this.state.messages.length + 1}])
				});
			}
			this.handleSearchSubmit();
		})
		.catch(function(ex) {
			console.log(ex);
			alert("Reservation impossible.");
		});
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

		this.setState({
      [name]: value
    });
	}

	handleSearchSubmit(event) {
		if (event) {
			event.preventDefault();
		}

		let data = {
			datetime: this.state.datetime,
			duration: this.state.duration
		}
		let updatedList = this.state.initialRooms;

		updatedList = updatedList.filter((room) => {
			return this.checkRoomDisponibily(this.state.reservations[room.name], data);
		});
		this.setState({rooms: updatedList});
	}

	checkRoomDisponibily(reservations, data) {
		function isBetween(target, min, max) {
			return (target >= min && target <= max);
		}
		if (reservations) {
			const newReservationBegin = Date.parse(data.datetime);
			const newReservationEnd = newReservationBegin + data.duration * 60 * 1000;

			for (let reservation of reservations) {
				let resBegin = Date.parse(reservation.datetime);
				let resEnd = resBegin + reservation.duration * 60 * 1000;
				if ((isBetween(newReservationBegin, resBegin, resEnd)) ||
						(isBetween(newReservationEnd, resBegin, resEnd)))
				{
					return false;
				}
			};
		}
		return true;
	}

	removeMessage(message) {
		const messages = this.state.messages;
		// this.setState({messages});
		delete messages[message.id - 1];
		this.setState({messages});
	}

	render() {
		return (
			<div className="container">
				<div className="flash-message">
					<FlashMessages removeMessage={this.removeMessage} messages={this.state.messages}/>
				</div>
				<div className="datetime form">
					<SearchForm
						handleSearchSubmit={this.handleSearchSubmit}
						handleInputChange={this.handleInputChange}
						datetime={this.state.datetime}
						duration={this.state.duration}
					/>
				</div>
				<div className="rooms-list">
					<label>
						Filtrer
						<input type="text" placeholder="Filter" onChange={this.filterList.bind(this)}/>
					</label>
					<RoomsTable
						rooms={this.state.rooms}
						handleReservation={this.handleReservation}
						datetime={this.state.datetime}
					/>
				</div>
			</div>
		)
	}
}
export default ReservationsPage;
