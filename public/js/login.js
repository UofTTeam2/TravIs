// Initiated by: login.handlebars
// Purpose: This file is used to handle the login and signup forms on the login.handlebars page. It is used to send the user's input to the server to be validated and then redirect the user to the homepage if the login/signup is successful. If the login/signup is unsuccessful, the user will be alerted with a message.
//-------------------------------------------------------------------

// Creating a function to handle the error message
// if the user's login/signup is unsuccessful, using a modal
const displayErrorModal = (errorMessage) => {
    const modal = document.querySelector('#errorModal');
    const modalContent = document.querySelector('#modalErrorMessage');
    const closeModalButton = document.querySelector('#closeModal');

    modal.style.display = 'block';
    modalContent.textContent = errorMessage;

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

const loginHandler = async (event) => {
    event.preventDefault();
    const email = document.querySelector('#emailLogin').value.trim();
    const password = document.querySelector('#passwordLogin').value.trim();

    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            //adding an error message if the user's login is unsuccessful
            const errorData = await response.json();
            const errorMessage = errorData.errors[0].message;
            displayErrorModal(errorMessage);
        }
    }
};
