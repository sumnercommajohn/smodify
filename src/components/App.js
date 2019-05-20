import React from 'react';
import { hot } from 'react-hot-loader/root';
import { checkURIforError, getTokenFromURI, getAuthURL } from '../config/authConfig';
import macaroon from '../assets/img/Macaroonicon.png';


class App extends React.Component {
  state = {
    token: '',
    user: '',
    error: false,
    errorMessage: '',
  }

  componentDidMount() {
    const authError = checkURIforError();
    const token = getTokenFromURI();
    this.setAuthError(authError);
    if (token) {
      this.setToken(token);
      this.getProfile(token);
    }
  }

  setToken = (token) => {
    this.setState({ token });
  }

  setAuthError = (error) => {
    const errorMessage = error
      ? 'Access denied by user'
      : '';
    this.setState({ error, errorMessage });
  }

  getProfile = (token) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: myHeaders,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(`Request rejected with status ${response.status}`);
      })
      .then((userData) => {
        console.log(userData);
        const user = userData.display_name;
        this.setState(prevState => ({
          ...prevState,
          user,
          error: false,
          errorMessage: '',
        }));
      })
      .catch((error) => {
        this.setState({
          error: true,
          errorMessage: error.message,
        });
      });
  }

  render() {
    return (
      <div className="app">
        <img src={macaroon} alt="" />
        <h1 className="title">Smodify.</h1>
        { this.state.error && <ErrorMessage message={this.state.errorMessage} /> }
        { this.state.user ? <Welcome user={this.state.user} /> : <LoginLink message="Login to Spotify" /> }
      </div>
    );
  }
}

const Welcome = (props) => {
  const displayName = props.user.split(' ');
  return (
    <div>
      <h3>Welcome, {displayName[0]}
        <small><LoginLink dialog message=" (Not You?)" /></small>
      </h3>

    </div>
  );
};

const ErrorMessage = props => (
  <div className="warning">
    <p>
      Something weird happened:
    </p>
    <p>
      <strong>
        {props.message}.
      </strong>
    </p>
    <p>
      You should try again.
    </p>
  </div>
);

const LoginLink = (props) => {
  const { message, dialog } = props;
  return (
    <a href={getAuthURL(dialog)}>{message}</a>
  );
};

export default hot(App);
