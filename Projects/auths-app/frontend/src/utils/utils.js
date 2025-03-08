import {toast} from 'react-toastify';

export const handleSuccess = (msg) =>{
    toast.success(msg,{
        position: 'top-right'
    })
}

export const handleError = (msg) =>{
    toast.error(msg,{
        position: 'top-right'
    })
}

export const signupValidationCheck = (data) =>{
    if(!data?.name){
        handleError('Name is required');
        return false;
    }
    if(!data?.email){
        handleError('Email is required');
        return false;
    }
    if(!data?.password){
        handleError('Password is required');
        return false;
    }
    return true;
}

export const loginValidationCheck = (data) =>{
    if(!data?.email){
        handleError('Email is required');
        return false;
    }
    if(!data?.password){
        handleError('Password is required');
        return false;
    }
    return true;
}