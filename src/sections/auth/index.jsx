import React, { useEffect } from "react";
import {
  Route,
} from "react-router-dom";
import Dashboard from "../dashboard";
import Login from "../login";
import { connect } from "react-redux";
import { fetchMe } from "../../redux/actions/user";

function Auth(props) {
const [initialTry, setInitialTry] = React.useState(false)
useEffect(()=>{
  if(localStorage.getItem('Authorization') != ""){
    props.fetchMe();
    setInitialTry(true);
  }
},[])

  const IsUserLoggedIn = () => {
    if(!initialTry) return <></>;
    if (props.user && localStorage.getItem('Authorization')) {
      if(window.location.pathname != "/dashboard")window.location.pathname = '/dashboard'
      return (
        <React.Fragment>

        <Route path={"/dashboard"}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              overflow: "hidden"
            }}
          >
            <Dashboard/>
          </div>
        </Route>
        </React.Fragment>
      );
    } else {
      if(window.location.pathname != "/login")window.location.pathname = '/login'
      return (
        <React.Fragment>
        <Route exact path={"/login"}>
          <Login />
        </Route>
        {/* <Redirect exact from={"/usuarios"} to='/login' /> */}
        </React.Fragment>
      );
    }
  };

  return <IsUserLoggedIn />;
}

function compareProps(prev, next) {
  return prev.user == next.user;
}

const MemoizedAuth = React.memo(Auth, compareProps);

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMe: () => {
      return dispatch(fetchMe());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MemoizedAuth);
