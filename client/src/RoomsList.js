import React, { Component } from 'react';
import FlashMessages from "./flash/FlashMessages"

class RoomsList extends Component {
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
		this.removeMessage = this.removeMessage.bind(this);
	}

	componentDidMount() {
		fetch('http://localhost:3001/rooms')
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
		fetch('http://localhost:3001/reservations')
		.then(function(res) {
			return res.json();
		})
		.then((reservations) => {
			this.setState({reservations})
			this.handleSearchSubmit();
		});
	}

	printEquipement(equipements) {
		var tab = [];
		equipements.forEach(function(equipement) {
			tab.push( equipement.name );
		});
		return tab.join(', ');
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

		fetch('http://localhost:3001/reservations', options)
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
		const table =
			<table className="table table-striped">
				<thead>
					<tr>
						<th></th>
						<th>Nom</th>
						<th>Description</th>
						<th>Capacité</th>
						<th>Equipements</th>
					</tr>
				</thead>
				<tbody>
					{
						this.state.rooms.map(room => {
							return (
									<tr key={ room.name }>
										<td> <button onClick={() => {this.handleReservation(room)}}>Réserver</button> </td>
										<td> { room.name } </td>
										<td> { room.description } </td>
										<td> { room.capacity } </td>
										<td> { this.printEquipement(room.equipements) } </td>
									</tr>
							)
						})
					}
				</tbody>
			</table>;
		const notable =
			<p>
				Pas de réservation disponible pour le { this.state.datetime.toString() }.
			</p>
		return (
			<div className="container">
				<div className="flash-message">
					<FlashMessages removeMessage={this.removeMessage} messages={this.state.messages}/>
				</div>
				<div className="datetime form">
					<form onSubmit={this.handleSearchSubmit} className="form-inline">
						<div className="form-group">
							<label>
								Jour et heure de la reservation
								<input className="form-control" ref="datetime" name="datetime" id="datetime" value={this.state.datetime} onChange={this.handleInputChange} type="datetime-local"/>
							</label>
						</div>
						<div className="form-group">
							<label>
								Durée :
								<input className="form-control" ref="duration" name="duration" value={this.state.duration} onChange={this.handleInputChange} type="number" />
								min
							</label>
						</div>
						<input className="btn btn-primary" type="submit" value="Rechercher"/>
					</form>
				</div>
				<div className="rooms-list">
					<label>
						Filtrer
						<input type="text" placeholder="Nom, Equipement" onChange={this.filterList.bind(this)}/>
					</label>
					{this.state.rooms.length > 0 ? table : notable }
				</div>
			</div>
		)
	}
}
export default RoomsList;
