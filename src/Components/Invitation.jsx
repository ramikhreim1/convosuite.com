import React, { Component } from "react";
import { computed, observable, makeObservable } from "mobx";
import { observer, inject } from "mobx-react";


@inject("store")
@observer
class FormHandlingClassComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      role:""
    };
    // makeObservable(this);

  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async(event) => {


    event.preventDefault();
    const { name, email, role } = this.state;
    try {
      this.setState({
        name: "",
        email: "",
        role:""
      })
      let data = await this.props.store.api
        .post("/admins/users/create", {
          email, name, role
        })
        .then(({ data }) => data);
      // this.props.store.loginWithDataTokenAndProfile(data);
      console.log(data.response)
      


    } catch (error) {
      console.error(error)
    }
    // You can perform any actions with the form data, like submitting it to a server or performing validation.
  };

  render() {
    const { name, email, role } = this.state;

    return (
      <div className="p-4">
        
        <form onSubmit={this.handleSubmit}>
          
            
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={name}
              className="rounded-md text-md px-4 py-2  border border-gray-300 inline-block"
              onChange={this.handleInputChange}
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email"
              className="rounded-md text-md px-4 py-2  border border-gray-300 inline-block w-auto"
              value={email}
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              id="role"
              name="role"
              placeholder="Role"
              className="rounded-md text-md px-4 py-2  border border-gray-300 inline-block w-auto"
              value={role}
              onChange={this.handleInputChange}
            />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Add
          </button>
          
        </form>
      </div>
    );
  }
}

export default FormHandlingClassComponent;
