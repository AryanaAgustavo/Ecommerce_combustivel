import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';



import FormInput from './form-input/form-input.componets';
import FormInputDate from '../../components/form-input-date/form-input-date.componets';
import CustomButton from '../../components/custom-button/custom-button.component';
import FormGroup from 'react-bootstrap/FormGroup'
import Alert from 'react-bootstrap/Alert'

import BoxContainer from "../../components/box-container/box-container.component"

import './cadastro-edit-page.styles.scss';

class CadastroEditPage extends Component {
    constructor(props) {
        super(props);
        const user = props.history.location.state.response;
        
        if (!localStorage.getItem('user')){
            this.props.history.push('/');
        }

        this.state = {
            "idUser" : user.idUser,
            "fullName": user.firstName + " " + user.lastName,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "CPF": user.cpf,
            "CPFValidation": "",
            "email": user.email,
            "password": "",
            "passwordValidation": "",
            "birth": user.birth,
            "gender": user.birth,
            "phone": user.phone,
            "errorMessage": "",
            "isValidEmail": "",
            "vGender": "",
            "vMail": "",
            "vBirth": "",
            "vPass": "",
            "vCpf": "",
            "vPhone": "",
            "vName": "",
            "valid": false
        }

        //this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = (props) => {
        console.log(props)
    }

    errorMessage = message => {
        this.setState({ errorMessage: `${message}` });
    }

    clearErrorMessage = () => {
        this.setState({ errorMessage: "" });
    }

    clearState = () => {
        this.setState({
            "email": "",
            "password": "",
            "firstName": "",
            "lastName": "",
            "CPF": "",
            "gender": "",
            "phone": "",
            "birth": "",
            "valEmail": ""
        })
    }

    handleChange = e => {
        const { name, value } = e.target;

        this.setState({ [name]: value });
    }

    handleNameChange = e => {
        const { name, value } = e.target;


        this.setState({ [name]: value },
            () => {
                var intNum = /^[0-9]+$/;
                if (!this.state.fullName.match(intNum)) {
                    this.setState({
                        fullName: this.state.fullName.replace(/[0-9]+/g, '')
                    })
                }
            })
    }

    handleCpfValidation = CPF => {

        let strCPF = CPF
        var Soma;
        var Resto;
        Soma = 0;
        if (strCPF === "00000000000") return false;

        for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11)) Resto = 0;
        if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11)) Resto = 0;
        if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
        return true
    };

    handleSubmit = async e => {
        e.preventDefault();

        let intNum = /^[0-9]+$/;
        const { fullName, CPF, email, password, passwordValidation, birth, gender, phone, idUser, valid } = this.state;

        // TODO este bloco de codigo é um codigo mocado e não deve ser passado para produção

        fullName === "" ? this.setState({ vName: "este campo precisa estar preenchido" })
            : this.setState({ vName: "" })

        CPF === "" ? this.setState({ vCpf: "este campo precisa estar preenchido" })
            : this.setState({ vCpf: "" })

        email === "" ? this.setState({ vMail: "este campo precisa estar preenchido" })
            : this.setState({ vMail: "" })

        password === "" ? this.setState({ vPass: "este campo precisa estar preenchido" })
            : this.setState({ vPass: "" })

        birth === "" ? this.setState({ vBirth: "este campo precisa estar preenchido" })
            : this.setState({ vBirth: "" })

        gender === "" ? this.setState({ vGender: "este campo precisa estar preenchido" })
            : this.setState({ vGender: "" })

        phone === "" ? this.setState({ vPhone: "este campo precisa estar preenchido" })
            : this.setState({ vPhone: "" })

        // TODO fim do codigo mocado !!!!! ==== nao passar para produção   

        if (password !== passwordValidation) this.errorMessage("as senhas precisam ser iguais");


        const arr = [];
        for (let i = 0; i < CPF.length; i++) {
            if (CPF[i].match(intNum)) arr.push(CPF[i])
        }
        const cpf = arr.slice(",").join('');
        try {
        console.log("entrou try")
        if (this.handleCpfValidation(cpf)) {
            console.log("passou validação")
            
            let birthArr = [];
            for (let i = 0; i < birth.length; i++) {
                if (birth[i].match(intNum)) birthArr.push(birth[i])
            }
            const date = birthArr.slice(",").join('');
            const user = {
                "idUser": idUser,
                "email": email.toLowerCase(),
                "password": password,
                "firstName": fullName.split(" ").slice(0, 1).toString().toLowerCase(),
                "lastName": fullName.split(" ").slice(1).join(" ").toLowerCase(),
                "cpf": cpf,
                "gender": gender,
                "phone": phone,
                "birth": date
            }
            console.log(user)
            console.log("entrou val")
            try {
                console.log("entrou try da requisição")

                await axios.put("http://localhost:8080/update-user", user)
                .then(response => {
                    if (response.status === 200) {
                        console.log("passou validação server")
                                this.setState({
                                    errorMessage: "",
                                    valid: true,
                                    successMessage: "informações editadas com sucesso"
                                })
                                localStorage.setItem("user", fullName);
                                localStorage.setItem("email", response.data.email);
                                setInterval(() => {
                                    this.clearState();
                                    this.props.history.push("/dashboard");
                                    window.location.reload();
                                }, 1500);
                            } else {
                        console.log("deu erro com servidor")

                                throw new Error(response.data);
                            }
                        })
                }
                catch (err) {
                    if (err) {
                        console.log(err.response)
                        this.setState({ errorMessage: err.response.data.error, valid: false })
                    }
                } finally {

                }


            }
            else throw new Error("cpf invalido");

        } catch (err) {
            this.setState({ errorMessage: err.message })

        }

    }

    render() {

        return (
            <div className="container mt-4">
                <div className="row d-flex justify-content-center">
                    <BoxContainer >
                        <div className="text-container" >
                            <h1>Editar informações</h1>
                        </div>
                        <form method="get" onSubmit={this.handleSubmit}>


                            <FormGroup>

                                <FormInput
                                    name="email"
                                    type="email"
                                    value={this.state.email}
                                    handleChange={this.handleChange}
                                    label='email'
                                    required />
                                {this.state.vMail ? (<Alert className="m-4" variant='danger'>{this.state.vMail}</Alert>) : ""}

                                <FormInput name="password"
                                    type="password"
                                    value={this.state.password}
                                    handleChange={this.handleChange}
                                    label='senha'
                                    size="input-small"
                                    required />
                                {this.state.vPass ? (<Alert className="m-4" variant='danger'>{this.state.vPass}</Alert>) : ""}


                                <FormInput
                                    name="passwordValidation"
                                    type="password"
                                    value={this.state.passwordValidation}
                                    handleChange={this.handleChange}
                                    label='repita a senha'
                                    size="input-small"
                                    required />

                                <FormInput
                                    name="fullName"
                                    type="text"
                                    value={this.state.fullName}
                                    handleChange={this.handleNameChange}
                                    label='nome completo'
                                    required />
                                {this.state.vName ? (<Alert className="m-4" variant='danger'>{this.state.vName}</Alert>) : ""}


                                <FormInput
                                    name="CPF"
                                    type="text"
                                    label="digite seu CPF"
                                    mask="999.999.999-99"
                                    size="input-m"
                                    value={this.state.CPF}
                                    handleChange={this.handleChange}
                                    required />
                                {this.state.vCpf ? (<Alert className="m-4" variant='danger'>{this.state.vCpf}</Alert>) : ""}


                                <div className="gender">
                                    <div>
                                        <input
                                            id="f"
                                            name="gender"
                                            type="radio"
                                            value={"F"}
                                            onClick={this.handleChange}
                                            required />
                                        <label className="label-gender" htmlFor="f">feminino</label>
                                    </div>

                                    <div><input
                                        id="m"
                                        name="gender"
                                        type="radio"
                                        value={"M"}
                                        onClick={this.handleChange}
                                        required />
                                        <label className="label-gender" htmlFor="m">masculino</label></div>
                                </div>
                                {this.state.vGender ? (<Alert className="m-4" variant='danger'>{this.state.vGender}</Alert>) : ""}

                                {/* //TODO tratativa de ano de nascimento! */}
                                <FormInputDate
                                    label="data de nascimento"
                                    name="birth"
                                    type="date"
                                    size="input-small"
                                    value={this.state.birth}
                                    handleChange={this.handleChange}
                                    required />
                                {this.state.vBirth ? (<Alert className="m-4" variant='danger'>{this.state.vBirth}</Alert>) : ""}


                                <FormInput
                                    label="telefone"
                                    mask="(99) 99999-9999"
                                    name="phone"
                                    type="text"
                                    size="input-m"
                                    value={this.state.phone}
                                    handleChange={this.handleChange}
                                    required />
                                {this.state.vPhone ? (<Alert className="m-4" variant='danger'>{this.state.vPhone}</Alert>) : ""}


                                <CustomButton
                                    type="submit"
                                    onClick={this.handleSubmit} >
                                    Continuar
                            </CustomButton>
                                {this.state.successMessage ? (<Alert className="m-4" variant='success'>{this.state.successMessage}</Alert>) : ""}
                                {this.state.errorMessage ? (<Alert className="m-4" variant='danger'>{this.state.errorMessage}</Alert>) : ""}

                            </FormGroup>
                            <Link to='/dashboard'>voltar</Link>


                        </form>
                    </BoxContainer>
                </div>
            </div>
        )
    }
}



export default withRouter(CadastroEditPage);