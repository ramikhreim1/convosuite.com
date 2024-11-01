import React, { Component } from "react";
import FormHandlingClassComponent from "./Invitation";
import { Provider } from "mobx-react";
import { computed, observable, makeObservable } from "mobx";
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";

@inject("store")
@observer
class Body extends Component {
  constructor() {
    super();
    this.state = { users: [] };
  }

  fetchUsers = async () => {
    let data = await this.props.store.api
      .get("/admins/users/")
      .then(({ data }) => data)
      .catch((err) => console.error(err));
    console.log("users data", data);
    this.setState({ users: data });
    return data;
  };

  componentDidMount() {
    // const usersList = this.users;
    this.fetchUsers();
    // console.log("function value:", this.state.users);

    // this.setState = { users: usersList };
    <Redirect to="/tools" replace={true} />;
  }
  render() {
    return (
      <>
        <Helmet>
          <title>User Controls</title>
        </Helmet>
        <div className="container mx-auto lg:px-4 py-4 min-h-screen flex flex-col md:items-center md:justify-center">
          <table classname="text-2xl font-bold table-auto w-full">
            <tr className="bg-green-500 text-white ">
              <th className="rounded-md text-lg px-4 py-2  border border-gray-300  w-auto">
                Name
              </th>
              <th className="rounded-md text-lg px-4 py-2  border border-gray-300  w-auto">
                Status
              </th>
              <th className="rounded-md text-lg px-4 py-2  border border-gray-300  w-auto">
                Email
              </th>
              <th className="rounded-md text-lg px-4 py-2  border border-gray-300  w-auto">
                Role
              </th>
            </tr>
            {this.state.users &&
              this.state.users.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="rounded-md text-lg px-4 py-2  border border-gray-300  w-auto">
                    {row.name}
                  </td>
                  <td className="rounded-md text-lg px-4 py-2  border border-gray-300  w-auto">
                    {row.status}
                  </td>
                  <td className="rounded-md text-lg px-4 py-2  border border-gray-300  w-auto">
                    {row.email}
                  </td>
                  <td className="rounded-md text-lg px-4 py-2  border border-gray-300  w-auto">
                    {row.role}
                  </td>
                </tr>
              ))}
          </table>

          <FormHandlingClassComponent />
        </div>
      </>
    );
  }
}

export default withRouter(Body);
