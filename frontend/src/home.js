import './home.css';
import { useEffect, useState, useRef } from 'react';
import userIcon from './assets/user.png';
import profilePic from './assets/profile-pic.png';


export default function Home() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
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

    const change = async (user) => {
        const background = document.getElementById('background-image');
        if (background) {
            background.classList.add('hidden');
        }

        setSelectedUser(user);

        try {
            const res = await fetch(`http://localhost:8000/api/messages/${user._id}`, {
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error('Failed to fetch messages');
            }

            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setMessages([]);
        }
    };


    return (
        <div>
            <div className="container">
                <div className="side-container">
                    <h3>Chats</h3>
                    <div className="search-box">
                        <input type="text" placeholder="Search" className="search-input" />
                    </div>
                    <hr className='hr' />
                    <div className="chats">
                        {users.map(user => (
                            <div key={user._id} className="chat-user" onClick={() => change(user)}>
                                <img src={userIcon} alt="user" className="user-icon" />
                                {user.username}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="main-container">
                    <div className="background-image" id='background-image'></div>
                        <div className='user-chat'>
                            <div className='chat-box'>
                                <div className='chat-username'>
                                    {selectedUser && (
                                        <div className="user-info-row">
                                            <img src={profilePic} alt="profile" className="profile-avatar" />
                                            <h2>{selectedUser.username}</h2>
                                        </div>
                                    )}
                                    <hr />
                                </div>
                                <div className='message-box'>
                                    {messages.map(msg => {
                                        const alignment = msg.senderid === selectedUser._id ? 'left' : 'right';

                                        return (
                                        <div key={msg._id} className={`message ${alignment}`}>
                                            {msg.message}
                                        </div>
                                        );
                                    })}
                                </div>
                                <div className='send-message'>
                                    <div className="input-container">
                                        <input
                                            type="text"
                                            className="message-input"
                                            placeholder="Send a message..."
                                        />
                                        <button className="send-button">Send</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
}
