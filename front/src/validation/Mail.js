import React from 'react';

class Mail extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {
            valid : null,
        }
    }

    emailValid(mail)
    {
     if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
      {
        return true;
      } else {
        return false;
      }
    }

    change(evt) {
        this.props.change( evt );
        this.setState( { valid : this.emailValid( evt.target.value )});
        this.props.valid( this.emailValid( evt.target.value ));
    }

    render() {
        let warning = ! this.state.valid ? <span style={{ color : 'red'}}>Email non valide</span> : <span></span>;
        return (
            <div>{ warning }
                <input type="email" className="form-control" placeholder="Email" onChange={evt => this.change(evt)}/>
            </div>
            );
    }
}

export default Mail;