import React, { useContext } from 'react';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { AuthContext } from '../../auth/AuthContext';
import { HandleLogin } from './HandleLogin';
import '../../css/login.css';

export const LoginScreen = () => {

    const { dispatch } = useContext( AuthContext );

    const initialForm = {
        username: '',
        password: ''
    }

    const [ values, handleInputChange, reset ] = useForm( initialForm );

    const { username, password } = values;

    // Show error alert
    const showErrorAlert = ( value ) => {

        const loginContainer = document.querySelector('.login-container')

        const alert = document.createElement('div');
        alert.innerHTML = `
            <div class="toast show animate__animated animate__fadeInDown" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex justify-content-center">
                    <div class="toast-body">
                    <i class="fas fa-exclamation-circle px-1 text-danger"></i> ${ value }
                    </div>
                </div>
            </div>`;

        if ( !document.querySelector('.toast') ) {

            loginContainer.append(alert);
            setTimeout(() => {
                document.querySelector('.toast').remove();
            }, 3000);

        }

    }

    // Validate input values
    const validateValues = ( e ) => {

        e.preventDefault();
        
        if ( username === '' || password === '') {
            showErrorAlert( 'No ingresaste el usuario o el password.' );
            return;
        }

        if ( username.length < 6 || password.length < 6 ) {
            showErrorAlert( 'Usuario o password muy corto.' );
            return;
        }

        HandleLogin( dispatch, reset, username, password );

    } 

    

    return (
        <div className='container text-center my-5 d-flex align-items-center justify-content-center animate__animated animate__fadeInDown'>
            <div className='card form-content shadow d-flex align-items-center justify-content-center login-container'>
                <img className='img-fluid logo-login' src={ logo } alt='Finances App Logo' />
                <form onSubmit={ validateValues }>
                    <input 
                        type='text'
                        autoComplete='true'
                        className='form-control' 
                        name='username'
                        placeholder='username'
                        value={ username }
                        onChange={ handleInputChange }
                        required
                    />
                    <input 
                        type='password'
                        autoComplete='false'
                        className='form-control' 
                        name='password' 
                        placeholder='password'
                        value={ password } 
                        onChange={ handleInputChange }
                        required
                    />
                    <button 
                        className='btn btn-login shadow'
                    >
                        LOGIN
                    </button>
                </form>
                <div className='form-footer mt-5'>
                    <Link to='/' className={ 'links' }>Register NOW</Link> | <Link to='/' className={ 'links' }>Forgot Password</Link>
                </div>
            </div>
        </div>
    )
}
