import React from "react";
import "./index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class UserList extends React.Component {
    state = {
        editingUser: null,
        editedFirstName: "",
        editedLastName: "",
        editedEmail: "",
        editedDepartment: "",
    };

    handleEditClick = (user) => {
        this.setState({
            editingUser: user.id,
            editedFirstName: user.firstName,
            editedLastName: user.lastName,
            editedEmail: user.email,
            editedDepartment: user.department,
        });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSaveChanges = () => {
        const { handleUpdateUser } = this.props;
        const { editingUser, editedFirstName, editedLastName, editedEmail, editedDepartment } = this.state;

        const updatedUser = {
            id: editingUser,
            firstName: editedFirstName,
            lastName: editedLastName,
            email: editedEmail,
            department: editedDepartment,
        };

        handleUpdateUser(updatedUser);
        this.setState({ editingUser: null });
        toast.success("User Updated Successfully!");
    };

    handleCloseModal = () => {
        this.setState({ editingUser: null });
    };

    render() {
        const { usersData, handleDeleteUser } = this.props;
        const { editingUser, editedFirstName, editedLastName, editedEmail, editedDepartment } = this.state;

        return (
            <div className="user-list-section">
                <div className="user-list-container">
                    <h1 className="users-heading">Users List</h1>
                    <table className="user-table">
                        <thead className="user-table-main-headings">
                            <tr className="user-table-row-heading">
                                <th className="user-table-heading">First Name</th>
                                <th className="user-table-heading">Last Name</th>
                                <th className="user-table-heading">Email</th>
                                <th className="user-table-heading">Department</th>
                                <th className="user-table-heading">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.map((user) => (
                                <tr className="user-table-row" key={user.id}>
                                    <td className="user-table-data">{user.firstName}</td>
                                    <td className="user-table-data">{user.lastName}</td>
                                    <td className="user-table-data">{user.email}</td>
                                    <td className="user-table-data">{user.department}</td>
                                    <td className="user-table-data">
                                        <button
                                            type="button"
                                            className="edit-button"
                                            onClick={() => this.handleEditClick(user)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {editingUser && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2 className="edit-form-heading">Update User</h2>
                            <div className="update-form">
                                <label className="edit-form-label">First Name</label>
                                <input
                                    type="text"
                                    name="editedFirstName"
                                    value={editedFirstName}
                                    onChange={this.handleChange}
                                    className="edit-form-input"
                                />
                                <label className="edit-form-label">Last Name</label>
                                <input
                                    type="text"
                                    name="editedLastName"
                                    value={editedLastName}
                                    onChange={this.handleChange}
                                    className="edit-form-input"
                                />
                                <label className="edit-form-label">Email</label>
                                <input
                                    type="email"
                                    name="editedEmail"
                                    value={editedEmail}
                                    onChange={this.handleChange}
                                    className="edit-form-input"
                                />
                                <label className="edit-form-label">Department</label>
                                <input
                                    type="text"
                                    name="editedDepartment"
                                    value={editedDepartment}
                                    onChange={this.handleChange}
                                    className="edit-form-input"
                                />
                            </div>
                            <div className="edit-form-buttons">
                                <button type="button" onClick={this.handleCloseModal} className="delete-button1">
                                    Close
                                </button>
                                <button type="button" onClick={this.handleSaveChanges} className="edit-button1">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default UserList;
