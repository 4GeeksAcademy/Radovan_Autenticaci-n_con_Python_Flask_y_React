const apiUrl = process.env.BACKEND_URL + "/api";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			loggedUserId: null,
			currentUser: null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			changeColor: (index, color) => {
				// Get the store
				const store = getStore();

				// Loop through the demo array to look for the respective index and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				// Reset the global store
				setStore({ demo: demo });
			},

			sign: async (newUser) => {
				console.log(newUser);

				try {
					let response = await fetch(apiUrl + "/sign", {
						method: "POST",
						body: JSON.stringify(newUser),
						headers: {
							"Content-Type": "application/json",
						}
					});

					const data = await response.json();
					console.log("respuesta al intentar un nuevo usuario:", data);
				} catch (error) {
					console.log("Error:", error);
				}
			},

			privateRoute: async () => {
				try {
					// Asegúrate de que el token exista en localStorage
					const token = localStorage.getItem("token");
					console.log(token)
					if (!token) {
						setStore({ currentUser: false });
						return;
					}

					// Configuración de las cabeceras correctamente
					const options = {
						method: "GET", // Asegúrate de usar el verbo correcto
						headers: {
							Authorization: 'Bearer ' + token // Enviar el token como 'Bearer <token>'
						}
					};

					const response = await fetch(apiUrl + "/private", options);
					console.log(response); // Esto te ayudará a ver la respuesta del servidor

					// Verifica si la respuesta es exitosa
					if (response.ok) {
						const res = await response.json();
						console.log(res);
						setStore({ currentUser: res }); // Guarda los datos del usuario en el store
						return null;
					}

					// Si no está autorizado, actualizar el estado
					setStore({ currentUser: false });
				} catch (error) {
					console.error("Error en la solicitud privateRoute:", error);
					setStore({ currentUser: false });
				}
			},

			logIn: async (newLogIn) => {
				try {
					let result = await fetch(apiUrl + "/login", {
						method: "POST",
						body: JSON.stringify(newLogIn),
						headers: {
							"Content-Type": "application/json"
						}
					});

					const data = await result.json();
					console.log("respuesta al intentar iniciar sesión:", data);

					// Asegúrate de que la respuesta contenga 'access_token' y 'user'
					if (data.access_token) {
						localStorage.setItem("token", data.access_token); // Usar access_token en lugar de data.token
						setStore({ loggedUserId: data.user.id });  // Guarda el ID del usuario
						return data;
					} else {
						console.error("No se recibió un token válido");
					}
				} catch (e) {
					console.log("Error al intentar iniciar sesión:", e);
				}
			},

			logout: async () => {
				try {
					const actions = getActions();
					localStorage.removeItem('token'); // Eliminar el token del localStorage
					setStore({ loggedUserId: null }); // Resetear el loggedUserId en el store
					actions.privateRoute(); // Llamar a privateRoute para asegurar que el estado se actualice
					return true;
				} catch (error) {
					console.error('Error al cerrar sesión:', error);
					return false;
				}
			},
		}
	};
};

export default getState;