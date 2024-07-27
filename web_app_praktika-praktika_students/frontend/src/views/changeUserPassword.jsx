import { useState } from "react";
import useAxios from "../utils/useAxios";
import { checkPassword } from "../utils/password";

const ChangePasswordComponent = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [changeSuccess, setChangeSuccess] = useState("");
  const api = useAxios();

  const resetError = () => {
    setError("");
  };

  const resetPasswords = () => {
    setOldPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
  };

  const resetChangeSuccess = () => {
    setChangeSuccess("");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    // TODO: Create a confirm windows for changing the password or cancel the password change
    const confirm = window.confirm(
      "Are you sure you want to chage the password? ^_^"
    );

    if (confirm) {
      if (checkPassword(newPassword, newPasswordConfirm)) {
        // TODO: Set here the address to the change password url, with the old password, new password and new password confirm in the data from the put request
        api
          .put("http://127.0.0.1:8000/api/changePassword/", {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: newPasswordConfirm
          })
          .then(() => {
            // TODO: Set a message in ChangeSuccess
            setChangeSuccess("Password changed successfully.");
            resetError();
            resetPasswords();
          })
          .catch((error) => {
            setError(error.response.data.error);
            resetChangeSuccess();
          });
      }
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Old Password:</label>
          {/* TODO: set the value from this input to the oldPassword constants with the onChange function */}
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          {/* TODO: set the value from this input to the newPassword constants with the onChange function */}
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          {/* TODO: set the value from this input to the newPasswordConfirm constants with the onChange function */}
          <input
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            required
          />
        </div>
        {/* TODO: Show a error message when newPassword and newPasswordConfirm is not the same. Set the style from the error to 'error-message' */}
        {!checkPassword(newPassword, newPasswordConfirm) && (
          <p className="error-message">
            New password and confirm password do not match.
          </p>
        )}
        {/* TODO: Show a error message when something went wrong. Set the style from the error to 'error-message' */}
        {error && <p className='error-message'>{error}</p>}
        {/* TODO: Show a success message when the password is changed. Set the style from the message to 'success-message' */}
        {changeSuccess && <p className='success-message'>{changeSuccess}</p>}
        {/* TODO: set the style from the button to 'button' */}
        <button type="submit" className="button">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePasswordComponent;
