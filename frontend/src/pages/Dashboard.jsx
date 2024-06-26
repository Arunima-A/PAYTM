import axios from "axios";
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useEffect, useState } from "react";

const fetchbalance = async () => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    if (!token) {
      return null; // or handle the case when token is not available
    }
    try {
      const response = await axios.get("http://localhost:3001/api/v1/account/balance", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null; // or handle the error as needed
    }
  };
export const Dashboard = () => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        const getBalance = async () => {
          const fetchedBalance = await fetchbalance();
          setBalance(fetchedBalance);
        };
        getBalance();
      }, []);
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance} />
            <Users />
        </div>
    </div>
}