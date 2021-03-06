import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';


import FormInput from '../cadastro-page/form-input/form-input.componets';
import CustomButton from '../../components/custom-button/custom-button.component';

import FormGroup from 'react-bootstrap/FormGroup'
import Alert from 'react-bootstrap/Alert'
import './login-page.styles.scss';
import axios from "axios";

class LoginPage extends Component {
    constructor(props) {
        super(props)

        if (localStorage.getItem('user'))
            this.props.history.push('/');

        this.state = {
            email: "",
            password: "",
            user: "",
            errorMessage: ""
        }
    }

    clearMessage = () => {
        this.setState({ errorMessage: "" })
    }

    emptyInputErrorMessage = error => {
        this.setState({ errorMessage: error })
    }

    credentialsErrorMessage = () => {
        this.setState({ errorMessage: "Email ou senha estão incorrentos" })
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSignIn = async e => {
        e.preventDefault();

        const { email, password } = this.state;


        this.clearMessage();
        // TODO refatorar codigo
        if (!email || !password ) {
            this.emptyInputErrorMessage("Todos os campos precisam estar preechidos");
            return null;
        } 
        else {
            try {

                await axios.get('http://localhost:8080/find-user-email/' + email)
                .then( response => {
                        if (response.data[0].password === password) {
                            let userName = response.data[0].firstName;
                            this.props.history.push("/");
                            localStorage.setItem("user", userName);
                            localStorage.setItem("email", response.data[0].email);
                            window.location.reload();
                        }
                        else
                        {
                            this.credentialsErrorMessage()
                        }
                }).catch(error => {
                    console.log(error)
                });
            } catch (err) {
                console.log(err)
                this.credentialsErrorMessage();
            }
        }
    }

    render() {
        return (
            <div className="container mt-4">
                <div className="row d-flex justify-content-center">
                    <div className="sign-in">
                        <form method="get" onSubmit={this.handleSignIn}>
                            <FormGroup>
                                <div className="text-container" >
                                    <h2>Bem vindo de volta</h2>
                                    <span className="span-signin" >Entre com email e senha</span>
                                </div>
                                {this.state.errorMessage ? (<Alert className="m-4" variant='danger'>{this.state.errorMessage}</Alert>) : ""}
                                <FormInput
                                    name="email"
                                    type="email"
                                    value={this.state.email}
                                    handleChange={this.handleChange}
                                    label='email'
                                    required />
                                <FormInput name="password"
                                    type="password"
                                    value={this.state.password}
                                    handleChange={this.handleChange}
                                    label='senha'
                                    required />
                                <CustomButton
                                    type="submit"
                                    onClick={this.handleSignIn} >
                                    Continuar
                            </CustomButton>
                            </FormGroup>
                            <span>Não tem conta ? <Link to='/cadastro'>cadastre-se</Link></span>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(LoginPage);
