import React from 'react';
import Email from '../validation/Mail';

class SubscribeForm extends React.Component {

    constructor( props ) {
        super(props);
        this.state = {
            email : null,
            pwd : null,
            pwd2 : null,
            error : false,
            userExists : false,
            emailValid : false,
        }
    }

    changeEmail( evt ) {
        this.setState({ email : evt.target.value });
    }

    isEmailValid( valid ) {
        this.setState( {emailValid : valid });
    }

    changePassword( evt ) {
        let error = false;
        if(this.state.pwd2 && evt.target.value !== this.state.pwd2 ) {
            error = true;
        }

        this.setState({pwd : evt.target.value, error : error  });
    }

    changePassword2( evt ) {
        if(this.state.pwd && this.state.pwd !== evt.target.value ) {
            this.setState({error : true , pwd2 : evt.target.value });
        } else {
            this.setState({error : false, pwd2 : evt.target.value});
        }
    }

    submit() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.state.email , password : this.state.pwd })
        };
        fetch('http://localhost:8000/subscribe', requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.reason ) {
                    this.setState( {userExists : true });
                }
            });
    }

    render(){

        let span = this.state.error ? <span style={{ color : 'red' }}>*</span> : <span></span>;
        let exists = this.state.userExists ? <span style={{ color : 'red'}}>Cette utilisateur existe déjà</span>: <span></span>;
        let button = (! this.state.error && this.state.emailValid ) ?
            <button type="button" className="btn btn-primary" onClick={() => this.submit()}>Sauvegarder</button> : <button type="button" className="btn btn-primary" disabled>Sauvegarder</button>
        return (
            <form>
                { exists }
                <div className="input-group flex-nowrap">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="addon-wrapping">@</span>
                    </div>
                    <Email change={evt => this.changeEmail(evt)} valid={ valid => this.isEmailValid(valid)}></Email>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" className="form-control" id="password" onChange={evt => this.changePassword( evt )} />
                </div>
                <div className="form-group">
                    <label htmlFor="password2">Confirmer le mot de passe {span}</label>
                    <input type="password" className="form-control" id="password2" onChange={ evt => this.changePassword2( evt )} />
                </div>
                { button }

            </form>
        )
    }
}
export default SubscribeForm;