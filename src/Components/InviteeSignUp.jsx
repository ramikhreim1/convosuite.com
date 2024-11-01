import React from "react";
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { Helmet } from "react-helmet";
import { CheckIcon, UserIcon, LockClosedIcon } from "@heroicons/react/outline";

@inject("store")
@observer
class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "fetching",
      password: "",
      allowed: true,
    };

    // makeObservable(this);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    // console.log(event)
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { fname, lname, email, password } = this.state;
    const { match } = this.props;
    try {
      let data = await this.props.store.apiv2
        .post(`invitations/invite/${match.params.id}`, {
          fname,
          lname,
          email,
          password,
        })
        .then(({ data }) => (this.props.store.redirect = "/tools"));

      // this.props.store.loginWithDataTokenAndProfile(data);
      this.props.store
        .refreshTokenAndProfile()
        .then((this.props.store.redirect = "/tools"));
    } catch (error) {
      console.error(error);
    }
  };

  fetchEmail = async () => {
    const { match } = this.props;
    console.log(this.props.store.apiv2);
    await this.props.store.apiv2
      .get(`invitations/invite/${match.params.id}`)
      .then(({ data }) => this.setState({ email: data.email }))
      .catch((err) =>
        this.setState({ email: "No longer invited", allowed: false })
      );
  };
  signUpWithGoogle = async () => {
    // this.isLoading = true;
    const redirectURL =
      this.props.store.redirectURL + `&state=${this.props.store.referral}`;
    window.location.href = redirectURL;
  };
  componentDidMount() {
    console.log(this.props.store);
    this.fetchEmail();
  }

  render() {
    const { fname, lname, email, password, allowed } = this.state;
    return (
      <>
        <Helmet>
          <title>Invitee SignUp</title>
        </Helmet>
        {/* <div className="border border-solid border-gray-500 p-4"> */}
        <div className="container mx-auto lg:px-4 py-4 min-h-screen flex flex-col md:items-center md:justify-center">
          <div className="text-center mb-6">
            <Logo />
          </div>
          <div
            className={`min-w-full md:min-w-0 bg-white rounded-xl shadow-xl transform transition-all hover:shadow-2xl focus:shadow-2xl w-1/2 p-4`}
          >
            <form onSubmit={this.handleSubmit}>
              <div
                className={`mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-${
                  email && password ? "green" : "gray"
                }-300  ${email && password ? "bg-green-300" : "bg-gray-300"} `}
              >
                <UserIcon
                  className={`h-8 w-8 ${"text-gray-500"} text-${
                    email && password ? "green-700" : "gray-500"
                  }`}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center ">
                <div className="text-3xl font-medium text-gray-900">
                  Welcome Onboard!!!
                </div>
                <p className="text-lg text-gray-500">Create your account</p>
                <div className="md:flex">
                  <div className="flex flex-col min-w-0 md:pr-2 flex-1">
                    <label className="text-gray-400 text-sm block mt-4 inline-block text-left">
                      First Name
                    </label>
                    <input
                      value={fname}
                      onChange={this.handleChange}
                      name="fname"
                      className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block w-auto"
                      placeholder="John"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 md:pl-2 flex-1">
                    <label className="text-gray-400 text-sm block mt-4 inline-block text-left">
                      Last Name
                    </label>
                    <input
                      value={lname}
                      onChange={this.handleChange}
                      type="text"
                      name="lname"
                      className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block w-auto"
                      placeholder="Smith"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm block mt-4 inline-block text-left">
                    Email Address
                  </label>
                  <input
                    value={email}
                    //   onChange={this.handleChange}
                    focus="true"
                    type="email"
                    name="email"
                    className="rounded-md cursor-not-allowed text-lg px-4 py-2  border border-gray-300 "
                    placeholder="john@smith.com"
                    readOnly={true}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm block mt-4 inline-block text-left">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={this.handleChange}
                    type="password"
                    name="password"
                    className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block"
                    placeholder="*******"
                  />
                </div>
                <div className="flex flex-col">
                  {allowed ? (
                    <>
                      <button
                        type="submit"
                        className="hover:bg-gray-600 font-medium rounded-lg text-lg px-4 py-2 bg-gray-500 text-white mt-4 border border-gray-300 inline-block"
                      >
                        Create Account
                      </button>
                      <button
                        // disabled={loading}
                        onClick={() => this.signUpWithGoogle()}
                        className="hover:bg-gray-600 hover:cursor-pointer font-medium rounded-lg text-lg px-4 py-2 bg-gray-500 text-white mt-4 border border-gray-300 inline-block"
                      >
                        Continue with google
                      </button>
                    </>
                  ) : (
                    <>Not Invited or Invitation Expired</>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

const Logo = () => <img src="/logo.gif"></img>;
// export default InviteeSignUp
export default withRouter(Body);
