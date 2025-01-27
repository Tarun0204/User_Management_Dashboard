import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usersManagement from "../../assets/usersManagement.jpg";
import UserList from "../UserList";
import "./index.css";

class UserForm extends Component {
    state = {
        formData: {
            id: null,
            firstName: "",
            lastName: "",
            email: "",
            department: "",
        },
        formUsersList: [],
        fetchedUsersData: [],
    };

    handleInputChange = (event) => {
        const { id, value } = event.target;
        this.setState((prevState) => ({
            formData: { ...prevState.formData, [id]: value },
        }));
    };

    handleAddUser = async () => {
        const { formData, formUsersList } = this.state;
        if (formData.firstName && formData.email && formData.department) {
            const newUser = {
                id: uuidv4(),
                ...formData,
            };
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/users", {
                    method: "POST",
                    body: JSON.stringify(newUser),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to add user");
                }
                const data = await response.json();
                this.setState({
                    formUsersList: [...formUsersList, data],
                    formData: { id: null, firstName: "", lastName: "", email: "", department: "" },
                });
                toast.success("User added successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            } catch (error) {
                toast.error("Error adding user!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            }
        } else {
            toast.error("Please fill all required fields!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        }
    };

    handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            this.setState((prevState) => ({
                formUsersList: prevState.formUsersList.filter((user) => user.id !== id),
                fetchedUsersData: prevState.fetchedUsersData.filter((user) => user.id !== id),
            }));
            toast.success("User deleted successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        } catch (error) {
            toast.error("Error deleting user!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        }
    };

    render() {
        const { formData, formUsersList, fetchedUsersData } = this.state;
        return (
            <>
                <div className="user-form-section">
                    <div className="user-form-container">
                        <div className="user-form-content">
                            <h1 className="user-form-heading">Users Management Dashboard</h1>
                        </div>
                        <div className="form-left-container">
                            <img src={usersManagement} alt="logo" className="form-img" />
                        </div>
                        <div className="form-right-container">
                            <form className="user-data-form">
                                <label htmlFor="firstName" className="input-field-label">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className="input-field"
                                    placeholder="Enter your First Name"
                                    value={formData.firstName}
                                    onChange={this.handleInputChange}
                                />
                                <label htmlFor="lastName" className="input-field-label">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className="input-field"
                                    placeholder="Enter your Last Name"
                                    value={formData.lastName}
                                    onChange={this.handleInputChange}
                                />
                                <label htmlFor="email" className="input-field-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="input-field"
                                    placeholder="Enter your Email"
                                    value={formData.email}
                                    onChange={this.handleInputChange}
                                />
                                <label htmlFor="department" className="input-field-label">Department</label>
                                <input
                                    type="text"
                                    id="department"
                                    className="input-field"
                                    placeholder="Enter your Department"
                                    value={formData.department}
                                    onChange={this.handleInputChange}
                                />
                                <button
                                    type="button"
                                    className="add-user-btn"
                                    onClick={this.handleAddUser}
                                >
                                    Add User
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <UserList
                    usersData={[...formUsersList, ...fetchedUsersData]}
                    handleDeleteUser={this.handleDeleteUser}
                />
            </>
        );
    }
}

export default UserForm;
