var express = require('express');
var jsonfile = require('jsonfile');
jsonfile.spaces = 4;
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var rooms = jsonfile.readFileSync('./data/rooms.json');

app.get('/rooms', function(req, res) {
	if (rooms) {
		return res.status(200).send(rooms);
	}
	else {
		return res.status(500);
	}
});

app.get('/reservations', function(req, res) {
	var reservations = jsonfile.readFileSync('./data/reservations.json');

	if (reservations) {
		return res.status(200).send(reservations);
	}
	else {
		return res.status(404).send();
	}
});
app.post('/reservations', function(req, res) {
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

	var file = './data/reservations.json';
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
app.get('/reservation/:room', function(req, res) {
	var reservations = jsonfile.readFileSync('./data/reservations.json');

	if (reservations[req.params.room]) {
		return res.status(200).send(reservations[req.params.room]);
	}
	else {
		return res.status(404).send();
	}
});
app.listen(3001);
