import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { AppContext } from '../../context/AppContext';
import { toast } from '../helpers/toast';
import '../../css/dashboard.css';

export const DashBoardModalForm = ( { edit, data } ) => {

    const { user, reload, setReload } = useContext( AppContext );

    // If we are editing, take values from props
    const initialForm = {
        type: (edit) ? data.movement_type : '',
        date: (edit) ? data.movement_date.toString().substr(0,10) : new Date().toISOString().split('T')[0],
        description: (edit) ? data.movement_description : '',
        amount: (edit) ? data.movement_amount : 0
    }

    const [ values, handleInputChange, reset ] = useForm( initialForm );

    const { amount, date, description, type } = values;

    // Reset form according to props
    useEffect( () => {

        reset(); 

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ edit, data ] );

    // Push values into database
    const handleInsert = () => {

        const apiUrl = process.env.REACT_APP_API_URL;

        const movementData = {
            userid: user.id,
            date: date,
            type: type,
            amount: parseInt(amount),
            description: description
        };
        
        fetch(  
            // Dinamically change url and method according to form type 
            ( edit ) 
            ? `${apiUrl}/api/movements/${ data.movement_id }` 
            : `${apiUrl}/api/movements`, {
            method: ( edit ) ? 'PUT' : 'POST',
            body: JSON.stringify(movementData),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {

                if (data.error) {
                    toast( '.modal', `ERROR: database operation has failed (${ data.error })`, 'ERROR' );
                    return
                }

                if (data.success) {
                    toast( '.container', 'GREAT! Movement has been processed', 'SUCCESS' );
                    setReload( !reload );
                    reset();
                    document.querySelector('.btn-form-close').click();
                    return
                }
            }
            )
            .catch( err => { 
                toast( '.modal', `FATAL: ${err}`, 'ERROR' )  
            } );
    }

    // Validate input values
    const validateValues = ( e ) => {

        e.preventDefault();
        
        if ( amount === 0 || description === '') {
            toast( '.modal', 'Description is empty or amount is zero.', 'ERROR' );
            return;
        }

        if ( description.length < 6 ) {
            toast( '.modal', 'Description too short.', 'ERROR' );
            return;
        }

        if ( type === '' ) {
            toast( '.modal', 'You must choose a type', 'ERROR' );
            return;
        }

        handleInsert( amount, date, description, type );

    } 

    return (
        <div
            className='modal fade'
            id='dashboardModalForm'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            tabIndex='-1'
            aria-labelledby='dashboardModalFormLabel'
            aria-hidden='true'
        >
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header modal-header-add py-2'>
                        <h5 className='modal-title' id='dashboardModalFormLabel'>
                            <i className='fas fa-cloud-upload-alt mx-2'></i>
                            { ( edit ) ? 'Edit movement' : 'Insert new movement' }
                        </h5>
                        <button
                            type='button'
                            className='btn-close btn-close-white'
                            data-bs-dismiss='modal'
                            aria-label='Close'
                        ></button>
                    </div>
                    <div className='modal-body'>

                        <form id='modal-add' onSubmit={ validateValues }>
                            <div className='input-group flex-nowrap'>
                                <select 
                                    className='form-select'
                                    name='type'
                                    value={ type }
                                    onChange={ handleInputChange }
                                    disabled= { ( edit ) ? true : false }
                                >
                                    <option value=''>
                                        Choose type
                                    </option>
                                    <option value='ING'>
                                        INGRESS
                                    </option>
                                    <option value='EGR'>
                                        EGRESS
                                    </option>
                                </select>
                            </div>
                            <div className='input-group flex-nowrap' >
                            <input
                                autoComplete='false'
                                className='form-control'
                                type="date"
                                max={ date }
                                name="date"
                                value={ date }
                                selected={ date }
                                onChange={ handleInputChange }
                                required
                                />
                            </div>
                            <div className='input-group flex-nowrap'>
                                <input 
                                    type='number' 
                                    className='form-control' 
                                    placeholder='Amount' 
                                    name='amount'
                                    value={ amount }
                                    onChange={ handleInputChange }
                                    required
                                />
                            </div>
                            <div className='input-group flex-nowrap'>
                                <input 
                                    type='text' 
                                    className='form-control' 
                                    placeholder='Description'
                                    maxLength='25' 
                                    name='description'
                                    value={ description }
                                    onChange={ handleInputChange }
                                    required
                                />
                            </div>
                        </form>

                    </div>
                    <div className='modal-footer'>
                        <button
                            type='button'
                            className='btn btn-secondary btn-form-close px-3'
                            data-bs-dismiss='modal'
                        >
                            Close
                        </button>
                        <button 
                            type='submit' 
                            className='btn btn-send py-2 px-4'
                            form='modal-add'
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}

DashBoardModalForm.propTypes = {
    edit: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
};
