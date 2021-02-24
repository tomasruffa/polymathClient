import React, {useState} from 'react'
import './login.scss'
import ButtonLink from '../../components/buttons/link'
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import {fetchMe, login, register} from '../../redux/actions/user'


function Login(props) {

  const [typeLogin, setTypeLogin] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRePassword, setRegisterRePassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');

  const registerButton = async (event) => {
    try{
      if(event === 'login') {
        let user = {
          email: loginEmail,
          password: loginPassword,
        };
        await props.login(user);
      } else if(event === 'register') {
        if(registerPassword === registerRePassword) {
          let user = {
            user : {
              name: registerName,
              lastName: registerLastName,
              email: registerEmail,
              password: registerPassword,
            }
          };
          await props.register(user)
        } else {
          alert('Passwords doesn\'t match')
        }
      }
    }catch(error){
      console.log(error)
    }
  }


  return(
    <div className="login">
      <div className="login__welcome">
        <h2>Welcome to Task Manager - Tomas Ruffa</h2>
        <span>Manage your tasks and carry in a register of your TODO LIST</span>
        <div className="login__welcome__btn" onClick={() => setTypeLogin('register')}>
          <ButtonLink text="Register" transparent={true} white={true} />
        </div>
      </div>
      <div className="login__card">
        <div className='login__card__container'>
          <div className="login__card__container__header">
            <h2>Tasks - Tomas Ruffa</h2>
          </div>
          <div className="login__card__container__login">
            {typeLogin == 'login' ? 
              <form noValidate autoComplete="off">
                <TextField required className="input-login" label="Email" value={loginEmail} onChange={data => {setLoginEmail(data.target.value)}} />
                <TextField required className="input-login" label="Contraseña" value={loginPassword} type="password" autoComplete="current-password" onChange={data => {setLoginPassword(data.target.value)}} />
                <div className="login__card__container__btn" onClick={() => registerButton('login')}>
                  <ButtonLink text="Login"/>
                </div>
                <div className="login__card__container__additional">
                  <span onClick={() => setTypeLogin('register')}>Register now</span>
                </div>
              </form>
            :
              <form noValidate autoComplete="off">
                <h2>Register</h2>
                <TextField required className="input-login" id="register_firstName" label="Name" value={registerName} onChange={data => {setRegisterName(data.target.value)}} />
                <TextField required className="input-login" id="register_secondName" label="Last Name" value={registerLastName} onChange={data => {setRegisterLastName(data.target.value)}} />
                <TextField required className="input-login" id="register_identification" label="Email" value={registerEmail} onChange={data => {setRegisterEmail(data.target.value)}} />
                <TextField required className="input-login" id="register_password" label="Password" type="password" autoComplete="current-password" value={registerPassword} onChange={data => {setRegisterPassword(data.target.value)}} />
                <TextField required className="input-login" id="register_repassword" label="Re-password" type="password" autoComplete="current-password" value={registerRePassword} onChange={data => {setRegisterRePassword(data.target.value)}} />
                <div className="login__card__container__btn" onClick={() => registerButton('register')}>
                  <ButtonLink text="Register" />
                </div>
                <div className="login__card__container__additional">
                  <span onClick={() => setTypeLogin('login')}>Back to login</span>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    </div>  
  )
}

const mapDispatchToProps = dispatch => {
  return {
    login: (data) => {
      return dispatch(login(data))
    },
    register: (data) => {
      return dispatch(register(data))
    },
  };
};

export default connect(null, mapDispatchToProps)(Login);