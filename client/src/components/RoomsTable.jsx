import React from 'react';
import PropTypes from 'prop-types';

const printEquipement = (equipements) => {
	var tab = [];
	equipements.forEach(function(equipement) {
		tab.push( equipement.name );
	});
	return tab.join(', ');
};

const RoomsTable = ({
	rooms,
	handleReservation,
	datetime
}) => {
	if (rooms && rooms.length > 0) {
		return (
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
						rooms.map(room => {
							return (
								<tr key={ room.name }>
									<td> <button onClick={() => {handleReservation(room)}}>Réserver</button> </td>
									<td> { room.name } </td>
									<td> { room.description } </td>
									<td> { room.capacity } </td>
									<td> { printEquipement(room.equipements) } </td>
								</tr>
							)
						})
					}
				</tbody>
			</table>
		)
	}
	else {
		return (
			<p> Pas de réservation disponible pour le { datetime.toString() }. </p>
		)
	}
}

RoomsTable.propTypes = {
  rooms: PropTypes.array.isRequired,
  handleReservation: PropTypes.func.isRequired,
  datetime: PropTypes.string.isRequired,
};

export default RoomsTable;
