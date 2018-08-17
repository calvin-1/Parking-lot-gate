import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux'

import { setGeneratedTicket, openGate, addTicket } from "../../redux/actions";

import OptionsPane from '../options-pane'
import Button from '../form/button'
import TicketComponent from '../ticket'

import {cls} from "../../util"
import Ticket from '../../util/ticket'

import './index.less'

const mapDispatchToProps = (dispatch) => {
    return {
        openGate: (ticket) => {
            addTicket(dispatch, ticket)
            openGate(dispatch, ticket);
            setGeneratedTicket(dispatch, null)
        },
        setGeneratedTicket: (ticket) => {setGeneratedTicket(dispatch, ticket);},
    };
};

const mapStateToProps = (state) => {
    return {
        ticket: state.generatedTicket,
    };
};

class EnterOptions extends React.Component {
        displayName: "EnterOptions";
    constructor(props) {
        super(props);

        this.state = {
            error: false
        }

        this.printTicket = this.printTicket.bind(this);
        this.downloadTicket = this.downloadTicket.bind(this);
        this.createTicket = this.createTicket.bind(this)
    }

    //param ticket for testing
    createTicket(e, ticket=null) {
        ticket = ticket ? ticket : new Ticket();

        ticket.generateImage(
            () =>  {
                this.setState({
                    error: false
                }, () => {
                    this.props.setGeneratedTicket(ticket)
                })
            },
            () => this.setState({error: true})
        );
        
    }

    downloadTicket() {

        if (!this.props.ticket) {
            return;
        }

        var downloadLink = document.createElement("a");
        downloadLink.href = this.props.ticket.image;
        downloadLink.download = "ticket.png";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        this.props.openGate(this.props.ticket);
    }

    printTicket() {

        if (!this.props.ticket) {
            return;
        }

        var popup = window.open();
        popup.document.write("<img src='" + this.props.ticket.image + "'/>");
        popup.focus(); //required for IE
        popup.print()
        popup.close();

        this.props.openGate(this.props.ticket);
    }


    render() {

        return (
            <OptionsPane title="Entering">
                <div className={cls(this)}>

                {this.state.error &&
                    <div className={cls(this, 'error')}>
                        Could not generate ticket
                    </div>
                }

                {!this.state.error &&

                    <div>
                        {!this.props.ticket &&
                            <Button onClick={this.createTicket} text="Create ticket"/>
                        }

                        {this.props.ticket &&
                            <div>
                                <TicketComponent ticket={this.props.ticket}/>

                                <Button text="Print" onClick={this.printTicket}/>
                                <Button text="Download" onClick={this.downloadTicket}/>
                            </div>
                        }
                    </div>

                }

                </div>
            </OptionsPane>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EnterOptions)