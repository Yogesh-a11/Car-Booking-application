import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext();

export const AppProvider = ({children})=> {
    
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pickupLocation, setPickupLocation] = useState("");


    const fetchUser = async() => {
        try {
            const {data} = await axios.get('/api/user/data');
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
            } else {
                logout(); 
                navigate('/');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false)
        }
    }

    const fetchCars = async() => {
        try {
            const {data } = await axios.get('/api/user/cars');
            data.success ? setCars(data.cars) : toast.error(data.message);

        } catch (error) {
            toast.error(error.message);
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsOwner(false);
        axios.defaults.headers.common['Authorization'] = null;
        toast.success('Logout successful');
    }
 
    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        fetchCars();
    }, [])

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        }
    }, [token])

    const value = {
        navigate, currency, axios, token, setToken, user, setUser, isOwner, setIsOwner, showLogin, setShowLogin, pickupDate, setPickupDate, returnDate, setReturnDate, cars, setCars, logout,
        fetchUser, fetchCars, loading, setLoading, pickupLocation, setPickupLocation
    }

    return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>)
};

export const useAppContext = () => {
    return useContext(AppContext);
}