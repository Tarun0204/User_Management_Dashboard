import React from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

Modal.setAppElement('#root');

class UserList extends React.Component {
    state = {
        fetchedUsersData: [],
        hasError: false,
        editingUser: null,
        editedFirstName: "",
        editedLastName: "",
        editedEmail: "",
        editedDepartment: ""
    };

    componentDidMount() {
        this.getFetchedUsersData();
    }

    getFetchedUsersData = async () => {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            const updatedData = data.map((eachUser) => ({
                id: eachUser.id,
                firstName: eachUser.name.split(" ")[0],
                lastName: eachUser.name.split(" ")[1] || "",
                email: eachUser.email,
                department: eachUser.company.name,
            }));
            this.setState({
                fetchedUsersData: updatedData,
                hasError: false,
            });
        } catch (error) {
            console.error(error);
            this.setState({ hasError: true });
        }
    };

    handleFetchedDelete = (id) => {
        const updatedData = this.state.fetchedUsersData.filter((user) => user.id !== id);
        this.setState({ fetchedUsersData: updatedData });
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

    handleSaveChanges = async () => {
        const { editedFirstName, editedLastName, editedEmail, editedDepartment, editingUser, fetchedUsersData } = this.state;
        try {
            const updatedData = fetchedUsersData.map((user) =>
                user.id === editingUser
                    ? {
                        ...user,
                        firstName: editedFirstName,
                        lastName: editedLastName,
                        email: editedEmail,
                        department: editedDepartment,
                    }
                    : user
            );
            this.setState({ fetchedUsersData: updatedData, editingUser: null });
            toast.success("User Updated Successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };    

    handleCloseModal = () => {
        this.setState({ editingUser: null });
    };

    render() {
        const { fetchedUsersData, hasError, editingUser, editedFirstName, editedLastName, editedEmail, editedDepartment } = this.state;
        const { usersData, handleDeleteUser } = this.props;

        if (hasError) {
            return <div>Something went wrong...</div>;
        }

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
                            {[...fetchedUsersData, ...usersData].map((user) => (
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
                                            onClick={() => {
                                                handleDeleteUser(user.id);
                                                this.handleFetchedDelete(user.id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Modal
                    isOpen={editingUser !== null}
                    onRequestClose={this.handleCloseModal}
                    contentLabel="Edit User"
                    className="edit-modal"
                    overlayClassName="modal-overlay"
                >
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
                </Modal>

                <ToastContainer />
            </div>
        );
    }
}

export default UserList;
