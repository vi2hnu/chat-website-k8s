import './home.css';
import { useEffect, useState, useRef } from 'react';
import userIcon from './assets/user.png';
import profilePic from './assets/profile-pic.png';

export default function Home() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const userIdsRef = useRef(new Set());
    const [searchText, setSearchText] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [popup, setPopup] = useState({ visible: false, message: '' });
    const messageBoxRef = useRef(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/auth/me', {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Failed to fetch current user');
                const data = await res.json();
                setCurrentUserId(data._id);
            } catch (err) {
                console.error('Error fetching current user:', err);
            }
        };

        fetchCurrentUser();

        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/users', {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Failed to fetch users');
                const data = await res.json();
                setUsers(data);
                userIdsRef.current = new Set(data.map(user => user._id));
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchUsers();
    }, []);
    useEffect(() => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    }, [messages]);
    const fetchMessages = async (user) => {
        try {
            const res = await fetch(`http://localhost:8000/api/messages/${user._id}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch messages');
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setMessages([]);
        }
    };

    const change = async (user) => {
        const background = document.getElementById('background-image');
        if (background) background.classList.add('hidden');
        setSelectedUser(user);
        await fetchMessages(user);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedUser) return;

        try {
            const res = await fetch(`http://localhost:8000/api/messages/send/${selectedUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ message: messageText.trim() }),
            });

            if (!res.ok) {
                throw new Error('Failed to send message');
            }

            setMessageText('');
            await fetchMessages(selectedUser);
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const search = async (e) => {
        e.preventDefault();
        try {
            const query = searchText.trim();
            const res = await fetch(`http://localhost:8000/api/users/search/${query}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (res.status === 200) {
                const user = await res.json();
                setFoundUser(user);
                setPopup({ visible: true, message: 'User found' });
            } else if (res.status === 404) {
                setFoundUser(null);
                setPopup({ visible: true, message: 'User not found' });
            } else {
                throw new Error('Failed to search user');
            }
        } catch (err) {
            console.error('Error searching user:', err);
            setFoundUser(null);
            setPopup({ visible: true, message: 'User not found' });
        }
    };

    const sendHi = async () => {
        if (!foundUser) return;

        try {
            const res = await fetch(`http://localhost:8000/api/messages/send/${foundUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ message: "Hi!" }),
            });

            if (!res.ok) {
                throw new Error('Failed to send message');
            }

            closePopup()
        } catch (err) {
            console.error('Error sending Hi:', err);
        }
    };


    const closePopup = () => {
        setPopup({ visible: false, message: '' });
    };

    return (
        <div>
            <div className="container">
                <div className="side-container">
                    <h3>Chats</h3>
                    <div className="search-box">
                        <form onSubmit={search} className='search-form'>
                            <input
                                type="text"
                                placeholder="Search"
                                className="search-input"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </form>
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

                            <div className='message-box' ref={messageBoxRef}>
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
                                <form className='input-form' onSubmit={sendMessage}>
                                    <div className="input-container">
                                        <input
                                            type="text"
                                            className="message-input"
                                            placeholder="Send a message..."
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                        />
                                        <button className="send-button" type="submit">Send</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {popup.visible && (
                <div className="search-popup">
                    <h3>{popup.message}</h3>

                    {foundUser && (
                        <div className='display-user'>
                            <div className='pop-up-username'><h3 style={{ marginRight: '10px' }} >{foundUser.username}</h3></div>
                            <button onClick={sendHi} className='pop-up-button'><h3 style={{ color: 'white' }}>Send Hi!</h3></button>
                        </div>
                    )}

                    <button className="popup-close" onClick={closePopup}>X</button>
                </div>
            )}
        </div>
    );
}
