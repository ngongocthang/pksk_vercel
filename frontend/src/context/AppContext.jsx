import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patient, setPatient] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedUnreadCount = localStorage.getItem("unreadCount");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedUnreadCount) {
      setUnreadCount(Number(savedUnreadCount));
    }
  }, []);

  const value = {
    user,
    setUser,
    doctors,
    setDoctors,
    patient,
    setPatient,
    unreadCount,
    setUnreadCount,
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