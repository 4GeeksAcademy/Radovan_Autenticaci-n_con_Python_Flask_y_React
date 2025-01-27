import React, { useContext, useState, } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; 
import 'sweetalert2/dist/sweetalert2.min.css';
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [fullName, setFullName] = useState("")
	const [userName, setUserName] = useState("")


	const navigate = useNavigate()

	const createNewUser = async () => {
		try {
			if (email === "" || password === "" || fullName === "" || userName === "") {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Todos los campos son obligatorios',
				});
				return;
			}

			let newUser = {
				email: email,
				password: password,
				fullName: fullName,
				userName: userName,

			};

			const result = await actions.sign(newUser);
			console.log(result);

			Swal.fire({
				icon: 'success',
				title: '¡Registro exitoso!',
				text: 'Tu cuenta ha sido creada exitosamente.',
			});

			navigate("/demo");
		} catch (error) {
			console.log(error);
		}
	};

	return (

		<>

			<div className="container-signUp mt-5">

				<div className="left">

					

					<div className="body-l">

						<h3 className="title-l fw-bold"> PROYECTO DE AUTENTICACIÓN DE JWT </h3>

						<img src="https://img.freepik.com/free-vector/abstract-pink-cube-background_1394-899.jpg?t=st=1738015671~exp=1738019271~hmac=dbfc1fb8fd5622d68a3ca0434ed01317e4a504874f44e4c63742e68db1ead200&w=826" alt="rochet img" />

					</div>

				</div>

				<div className="form-container right">

					<h2 className="title-r">Crear cuenta</h2>

					<form className="row g-3 form-r">
						<div className="col-md-12">
							<label htmlFor="inputAddress" className="form-label labels">Nombre Completo :</label>
							<input type="text" className="form-control inputs" id="inputAddress" value={fullName} onChange={(e) => setFullName(e.target.value)} />
						</div>
						<div className="col-md-12">
							<label htmlFor="inputCity" className="form-label labels">Nombre de Usuario :</label>
							<input type="text" className="form-control inputs" id="inputCity" value={userName} onChange={(e) => setUserName(e.target.value)} />
						</div>
						<div className="col-md-12">
							<label htmlFor="inputEmail4" className="form-label labels">Email :</label>
							<input type="email" className="form-control inputs" id="inputEmail4" value={email} onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div className="col-md-12">
							<label htmlFor="inputPassword4" className="form-label labels">Contraseña :</label>
							<input type="password" className="form-control inputs" id="inputPassword4" value={password} onChange={(e) => setPassword(e.target.value)} />
						</div>


						<div className="form-check mt-5">
							<input className="form-check-input inputs" type="checkbox" value="" id="flexCheckDefault" />
							<label className="form-check-label labels" htmlFor="flexCheckDefault">
								Acepta terminos y condiciones?
							</label>
						</div>
						<div className="butons">

							<Link to="/demo">
								<button className="btn btn-primary singup">iniciar sesion</button>
							</Link>

							<button type="button" className="btn btn-primary singup" onClick={createNewUser}>Crear cuenta</button>

						</div>
					</form>
				</div>

			</div>

		</>
	);
};
