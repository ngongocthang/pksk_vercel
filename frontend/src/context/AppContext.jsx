import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [doctors, setDoctors] = useState([]);
    const [user, setUser] = useState(null); 
    const [patient, setPatient] = useState(null);
    const currencySymbol = '$';

    const value = {
        doctors,
        setDoctors,
        user, 
        setUser,
        patient,  
        setPatient,  
        currencySymbol
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppContextProvider;