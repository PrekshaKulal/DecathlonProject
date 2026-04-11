import { useEffect, useState } from "react";
import axios from "axios";

function View_Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.API_URL}/users`)
      .then(res => setUsers(res.data));
  }, []);

  return (
    <div style={{ padding: "20px", color: "#333" }}>
      <h2>Users</h2>
      {users.map((user) => (
        <div key={user._id}>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default View_Users;