import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import Animations from '../../animations/animation_controller';
import SelectedCardAddress from '../../components/card-selected-address/card-selected-address.component';
import {isAddressCardHidden,  selectAllAddresses, mapSelectedAddress } from '../../redux/address/address.selector';
import CardAddress from '../../components/card-address/cardAddress.component';

import './address-card-slide.styles.scss'
import { setHidden } from '../../redux/address/address.actions';
import { getCurrentUser } from '../../redux/user/user.selector';
import { successMessage, errorMessage } from '../../redux/message/message.actions';

class AddressSlider extends Component {
    constructor(props){
        super(props);
        const { hidden } = this.props;
        this.state = {
            fade_animation : {
                none : ""
            },
        }
    }

    componentDidMount = () => {
        //if (!this.props.hidden) {
            //this.props.setHidden()
        //}
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.isHidden !== prevProps.isHidden) {
            return (this.handleFadeIn)()
        }
    }

    handleFadeIn = () => {
        const { hidden } = this.props;
        
        if (!hidden) {
            return this.setState({
                fade_animation: Animations.FADE_IN_FROM_LEFT()
            })
        }
    }

    
    render(){
        const {addresses, currentUser} = this.props;
        return(
            <div className="slider-address-container"
            style={this.state.fade_animation}>
            <div className="cart-dropdown">
                    <div className="close-cart"
                        onClick={() => {
                            //hide_cart()
                            return Animations.DELAY_CONTROLLER(
                                () => { setHidden()},
                                () => {
                                    this.setState({
                                        fade_animation: Animations.FADE_OFF_FROM_LEFT()
                                    })
                                },
                                2500
                            )
                        }}>
                        x
                    </div>
                    <div className="address-slide-content-container">
                    <h5 className="dashboard-title">endereço de entrega</h5>
                    <SelectedCardAddress />
                    <h5 className="dashboard-title">Meus endereços</h5>
                    {/* {
                        addresses
                        ? (<span>{addresses.length} endereços cadastrados</span>)
                        : ("")
                    }
                            
                    {
                        addresses.length >= 1
                        ? (
                            addresses.map(elm => {
                                return <CardAddress
                                    cep={elm.cep}
                                    street={elm.street}
                                    city={elm.city}
                                    district={elm.district}
                                    number={elm.number}
                                    complement={elm.complement}
                                    state={elm.state}
                                    key={elm.idAddress}
                                    idAddress={elm.idAddress}
                                    userId={
                                        currentUser
                                        ? (currentUser.idUser)
                                        : "" 
                                    }
                                />
                            })
                        )
                        : (
                            ""
                        )
                    } */}
                    </div>
                    </div>
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    isHidden: isAddressCardHidden,
    addresses: selectAllAddresses,
    addressSelected: mapSelectedAddress,
    currentUser : getCurrentUser
});

const mapDispatchToProps = dispatch => ({
    setHidden : () => dispatch(setHidden()),
    successMessage: message => dispatch(successMessage(message)),
    errorMessage: message => dispatch(errorMessage(message)),
})

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
        (AddressSlider)
);