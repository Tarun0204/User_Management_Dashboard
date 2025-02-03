import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
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
        usersList: [],
    };

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers = async () => {
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
            this.setState({ usersList: updatedData });
        } catch (error) {
            console.error(error);
        }
    };

    handleInputChange = (event) => {
        const { id, value } = event.target;
        this.setState((prevState) => ({
            formData: { ...prevState.formData, [id]: value },
        }));
    };

    handleAddUser = async () => {
        const { formData, usersList } = this.state;
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
                    usersList: [...usersList, data],
                    formData: { id: null, firstName: "", lastName: "", email: "", department: "" },
                });
                toast.success("User Added Successfully!");
            } catch (error) {
                toast.error("Error Adding User!");
            }
        } else {
            toast.error("Please fill all required fields!");
        }
    };

    handleDeleteUser = (id) => {
        this.setState((prevState) => ({
            usersList: prevState.usersList.filter((user) => user.id !== id),
        }), () => {
            toast.success("User Deleted Successfully!");
        });
    };


    handleUpdateUser = (updatedUser) => {
        this.setState((prevState) => ({
            usersList: prevState.usersList.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            ),
        }));
    };

    render() {
        const { formData, usersList } = this.state;
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
                                    value={formData.firstName}
                                    onChange={this.handleInputChange}
                                    placeholder="Enter your First Name"
                                />
                                <label htmlFor="lastName" className="input-field-label">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className="input-field"
                                    value={formData.lastName}
                                    onChange={this.handleInputChange}
                                    placeholder="Enter your Last Name"
                                />
                                <label htmlFor="email" className="input-field-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="input-field"
                                    value={formData.email}
                                    onChange={this.handleInputChange}
                                    placeholder="Enter your Email"
                                />
                                <label htmlFor="department" className="input-field-label">Department</label>
                                <input
                                    type="text"
                                    id="department"
                                    className="input-field"
                                    value={formData.department}
                                    onChange={this.handleInputChange}
                                    placeholder="Enter your Department"
                                />
                                <button type="button" className="add-user-btn" onClick={this.handleAddUser}>
                                    Add User
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <UserList
                    usersData={usersList}
                    handleDeleteUser={this.handleDeleteUser}
                    handleUpdateUser={this.handleUpdateUser}
                />
                <ToastContainer position="top-right" autoClose={3000} />
            </>
        );
    }
}

export default UserForm;
