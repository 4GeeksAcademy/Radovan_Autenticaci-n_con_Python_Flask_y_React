import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import successImageUrl from "../../img/success_people.jpg";
import "../../styles/home.css";

export const Single = props => {
	const { store, actions } = useContext(Context);
	const params = useParams();

	return (
		<>

			{store.currentUser ?

				<div className="jumbotron">
					<h2 className="display-4">¡Felicitaciones, acabas de loguearte! </h2>

					<img src={successImageUrl} alt="Imagen de éxito" className="centered-image" />
					
					<hr className="my-4" />
				</div>

				:

				<>

					<div className="cont-off">
						<h2>Crea una cuenta para accesar</h2>
					</div>

				</>
			}
		</>
	);
};

Single.propTypes = {
	match: PropTypes.object
};