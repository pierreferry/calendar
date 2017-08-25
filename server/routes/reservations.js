const express = require('express');
const validator = require('validator');
const jsonfile = require('jsonfile');
jsonfile.spaces = 4;
const cors = require('cors');
const bodyParser = require('body-parser');
const app = new express.Router();

app.get('/rooms', function(req, res) {
	const rooms = jsonfile.readFileSync('./server/data/rooms.json');

	if (rooms) {
		return res.status(200).send(rooms);
	}
	else {
		return res.status(400);
	}
});

app.get('/reservations', function(req, res) {
	const reservations = jsonfile.readFileSync('./server/data/reservations.json');

	if (reservations) {
		return res.status(200).send(reservations);
	}
	else {
		return res.status(400).send();
	}
});
app.post('/reservations', function(req, res) {
	let checkRoomDisponibily = (reservations, data) => {
		let isBetween = (target, min, max) => {
			return (target >= min && target <= max);
		}
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
		return true;
	};

	var file = './server/data/reservations.json';
	var room = req.body.room;
	var data = {
		datetime: req.body.datetime,
		duration: req.body.duration
	};
	if (!Number.isInteger(data.duration) || !validator.isISO8601(data.datetime)) {
		return res.status(400).send({error: "Erreur lors de la réception des données."});
	}

	var reservations = jsonfile.readFileSync(file);
	if (typeof (reservations[room]) !== 'undefined') {
		if (checkRoomDisponibily(reservations[room], data)) {
			reservations[room].push(data);
		}
		else {
			return res.status(400).send({error: "Cette réservation n'est plus disponible."});
		}
	}
	else {
		reservations[room] = [data];
	}
	jsonfile.writeFileSync(file, reservations);
	res.status(200).send({reservations});
});

module.exports = app;
