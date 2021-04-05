import React from 'react';
import { toast } from '../helpers/toast';

export const DashBoardDeleteModal = ( { id } ) => {

    const handleSubmit = ( e ) => {

        const apiUrl = process.env.REACT_APP_API_URL;

        fetch(`${apiUrl}/api/movements/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {

                if (data.error) {
                    toast( '.span-toast', `ERROR: database operation has failed (${ data.error })`, 'ERROR' );
                    return
                }

                if (data.success) {
                    document.querySelector('.btn-delete-close').click();
                    return
                }
            }
            )
            .catch( err => { 
                toast( '.span-toast', `FATAL: ${err}`, 'ERROR' )  
            } );

    }

    return (
        <div
            className="modal fade"
            id="deleteModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            data-id=''
            tabIndex="-1"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header modal-title-delete p-2">
                        <h5 className="modal-title" id="deleteModalLabel">
                            WARNING!
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to remove this movement?
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary btn-delete-close"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </button>
                            <form onSubmit={ handleSubmit }> 
                            <button
                                type="submit" 
                                className="btn btn-danger"
                            >
                                Do it!
                            </button>
                            <span className='span-toast'></span>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}