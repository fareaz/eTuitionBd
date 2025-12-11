import axios from 'axios';
import React from 'react';


const axiosInstance = axios.create({
    baseURL: 'https://e-tuition-bd-server-seven.vercel.app/'
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;