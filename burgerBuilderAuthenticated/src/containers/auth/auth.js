import { Component } from "react";
import Input from '../../components/ui/input/input';
import Button from '../../components/ui/button/button';
import './auth.css';
import * as actions from '../../store/actions/index';
import { connect } from "react-redux";
import Spinner from "../../components/ui/spinner/spinner";
import { Redirect } from "react-router-dom";

class Auth extends Component{
   
   state ={
       controls:{
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Email'
            },
            value: '',
            validation : {
                required : true,
                isEmail : true
            },
            valid : false,
            touched : false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation : {
                required : true,
                minLength : 6
            },
            valid : false,
            touched : false
        }
       },
       isSignup : true
   }

   componentDidMount(){
       if(!this.props.buildingBurger && this.props.authRedirectPath !=='/'){
           this.props.onSetAuthRedirectPath();
       }

   }

   checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
}

inputChangedHandler (event, controlName){
    const updatedControls = {
        ...this.state.controls,
        [controlName] : {
            ...this.state.controls[controlName],
            value: event.target.value,
            valid : this.checkValidity(event.target.value, this.state.controls[controlName].validation ),
            touched : true

        }
    };
    this.setState({controls : updatedControls});
}
submitHandler = (event) =>{
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);

} 
switchAuthModeHandler = () =>{
    this.setState(prevState =>{
        return{isSignup: !prevState.isSignup};
    });
}


   
    render(){

        const formElementArray = [];
        for(let key in this.state.controls){
            formElementArray.push({
                id : key,
                config : this.state.controls[key]
            });
        }

        let form = formElementArray.map(formElement => (
                <Input  
                key = {formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid ={!formElement.config.valid}
                shouldValidate = {formElement.config.validation}
                touched ={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)} />
            
               
        ));

        if(this.props.loading){
            form= <Spinner/>
        }
        let errorMessage = null;
        if(this.props.error){
            errorMessage =(
                <p>{this.props.error.message} </p>
            );
        };
        let authRedirected = null;
        if(this.props.isAuthenticated){
                authRedirected = <Redirect to={this.props.authRedirectPath} />
        }



        return(

            <div className="Auth">
                {authRedirected}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success" ><span style={{color:"black"}}>..</span>SUBMIT</Button>
                </form>
                <Button
                    clicked = {this.switchAuthModeHandler}
                 btnType="Danger" >Switch to {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}
                 </Button>
            </div>

        );
    }
};

const mapStateToProps = state =>{
    return{
        loading : state.auth.loading,
        error : state.auth.error,
        isAuthenticated : state.auth.token !== null,
        buildingBurger : state.burgerBuilder.building,
        authRedirectPath : state.auth.authRedirectPath

    };
};

const mapDispatchToprops = dispatch =>{
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath : () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToprops)( Auth);



