const express = require('express');
const validator = require('validator');
const jsonfile = require('jsonfile');
jsonfile.spaces = 4;
const cors = require('cors');
const bodyParser = require('body-parser');
const router = new express.Router();

const rooms = jsonfile.readFileSync('./server/data/rooms.json');

router.get('/rooms', function(req, res) {
	if (rooms) {
		return res.status(200).send(rooms);
	}
	else {
		return res.status(500);
	}
});

router.get('/reservations', function(req, res) {
	var reservations = jsonfile.readFileSync('./server/data/reservations.json');

	if (reservations) {
		return res.status(200).send(reservations);
	}
	else {
		return res.status(404).send();
	}
});
router.post('/reservations', function(req, res) {
	function checkRoomDisponibily(reservations, data) {
		function isBetween(target, min, max) {
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

	var reservations = jsonfile.readFileSync(file);
	if (typeof (reservations[room]) !== 'undefined') {
		if (checkRoomDisponibily(reservations[room], data)) {
			reservations[room].push(data);
		}
		else {
			return res.send({error: "Cette réservation n'est plus disponible."});
		}
	}
	else {
		reservations[room] = [data];
	}
	jsonfile.writeFileSync(file, reservations);
	res.status(200).send({reservations});
});
router.get('/reservation/:room', function(req, res) {
	var reservations = jsonfile.readFileSync('./server/data/reservations.json');

	if (reservations[req.params.room]) {
		return res.status(200).send(reservations[req.params.room]);
	}
	else {
		return res.status(404).send();
	}
});


module.exports = router;
