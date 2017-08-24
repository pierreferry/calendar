import React from 'react';
import PropTypes from 'prop-types';

const SearchForm = ({
  handleSearchSubmit,
  handleInputChange,
  datetime,
  duration,
}) => (
	<form onSubmit={handleSearchSubmit} className="form-inline">
		<div className="form-group">
			<label>
				Jour et heure de la reservation
				<input className="form-control" name="datetime" id="datetime" value={datetime} onChange={handleInputChange} type="datetime-local"/>
			</label>
		</div>
		<div className="form-group">
			<label>
				Durée :
				<input className="form-control" name="duration" value={duration} onChange={handleInputChange} type="number" />
				min
			</label>
		</div>
		<input className="btn btn-primary" type="submit" value="Rechercher"/>
	</form>
);

SearchForm.propTypes = {
  handleSearchSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  datetime: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired
};

export default SearchForm;
