import './home.css';
import { useEffect, useState, useRef } from 'react';
import userIcon from './assets/user.png';

export default function Home() {
    const [users, setUsers] = useState([]);
    const userIdsRef = useRef(new Set());

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/users', {
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await res.json();
                setUsers(data);

                userIdsRef.current = new Set(data.map(user => user._id));
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <div className="container">
                <div className="side-container">
                    <h3>Chats</h3>
                    <div className="search-box">
                        <input type="text" placeholder="Search" className="search-input" />
                    </div>
                    <hr className='hr'></hr>
                    <div className="chats">
                        {users.map(user => (
                            <div key={user._id} className="chat-user">
                                <img src={userIcon} alt="user" className="user-icon" />
                                {user.username}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="main-container">
                    
                </div>
            </div>
        </div>
    );
}
