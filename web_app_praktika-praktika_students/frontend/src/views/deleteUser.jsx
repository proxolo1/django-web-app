import { useState } from 'react';
import useAxios from '../utils/useAxios';
import { logout } from '../utils/auth';

const DeleteUserComponent = () => {
    const [deleteError, setDeleteError] = useState(null);
    const api = useAxios();

    const handleDelete = () => {
        const confirm = window.confirm(
            'Do you really want to delete this User? :('
        )

        if (confirm === true) {
            // TODO: Set here the delete url for the backend
            api.delete('http://127.0.0.1:8000/api/deleteUser/')
                .then(() => {
                    // TODO: Show a alert window with the message, that the user delete was successfully
                    window.alert("User deleted successfully");
                    // TODO: Execute the logout script
                    logout();
                })
                .catch((error) => {
                    setDeleteError(error.response.data.error.toString());
                });
        } 
    };
    return (
        <div>
            {/* TODO: set the style from the button to 'button' and 'delete-button' */}
             <button className="button delete-button" onClick={handleDelete}>Delete Account</button>
            {/* TODO: Show the error message. Set the style from the error to 'error-message' */}
            {deleteError && <p className="error-message">{deleteError}</p>}
        </div>
    );
};

export default DeleteUserComponent;