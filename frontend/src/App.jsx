import {
  Search,
  Settings,
  Smile,
  Mic,
  Menu,
  Paperclip,
  MoreVertical,
  MoreVerticalIcon,
} from 'lucide-react'

import {useState, useEffect, useRef} from 'react'
import './App.css'
import {io} from 'socket.io-client'


const myContactId = 'user_123';

//ConversationsSidebar (Left Part)

function SearchChatInput ({filterText, onSetFilterTextChange}) {
  const [filterText, setFilterText] = useState('');
  const filterTextRef = useRef('');

  useEffect(() => {
    filterTextRef.current = filterText;
    if (!filterText.current) {
      setResult([]);
      return;
    }

    const timer = setInterval(() => {
      const currentText 
      fetch(`api/search?q=${filterText}`)
    }, 150);
  }, [filterText]);

  return(
    <>
      <div className='searchChatInput'>
        <div className='iconContainer'>
          <Menu size={20} className='menuIcon' />
        </div>

        <div className='searchInputContainer'>
          <input className='searchInput' placeholder='Search' onChange={(e) => setFilterText(e.target.value)} value={filterText} />
        </div>
      </div>
    </>
  );
}

function ProfileMainContainer({contact, messages}) {
  let lastMessageTime = "";
  let lastMessage = "";
  let lastMessageStyle = "";
  if(messages[contact.id]) {
    let messagesLength = messages[contact.id].length;
    lastMessage = messages[contact.id][messagesLength - 1].text;
    lastMessageStyle =  (messages[contact.id][messagesLength - 1].isMine ? 'sent' : 'received');
    lastMessageTime = (messages[contact.id][messagesLength - 1].time);
  }
  return(
    <>
      <div className='profileIconContainer'>
        <div className='profileNickname'>
          {contact.nickname}
        </div>
      </div>

      <div className='profileMainContainer'>
          <div className='nameAndMessageContainer'>
            <div className='profileName'>
              {contact.name}
            </div>
            <div className= {`lastMessage ${lastMessageStyle}`}>
              {lastMessage}
            </div>
          </div>

          <div className='timeAndStateContainer'>
            <div className='lastChattingTime'>
              {lastMessageTime}
            </div>
            <div className='messageStateContainer'>
              <div className='messageState'>
                {contact.unreadCount}
              </div>
            </div>
          </div>
      </div>
    </>
  );
}

function ConversationItem({contact, onCurrentIdChange, messages}) {
  return(
    <>  
      <li className='conversationItem' onClick={() => onCurrentIdChange(contact.id)}>
        <ProfileMainContainer contact={contact} messages={messages} />
      </li>
    </>
  )
}

function ConversationsList({contactsList, onCurrentIdChange, messages, filterText}) {

  return(
    <>
      <div className='conversationsList'>
        {
          contactsList? (Object.values(contactsList)
            .filter(contact => contact.name.includes(filterText))
            .map(contact => (
              <ConversationItem key={contact.id} contact={contact} onCurrentIdChange={onCurrentIdChange} messages={messages} />
            ))) : ('')
        }
      </div>
    </>
  );
}

function ConversationsSidebar ({contactsList, onCurrentIdChange, messages}) {

  return(
    <div className='conversationsSidebar'>
      <SearchChatInput />
      <ConversationsList
        contactsList={contactsList}
        onCurrentIdChange={onCurrentIdChange}
        messages={messages} 
        filterText={filterText} />
    </div>
  );
}

// chatMainPanel (Right Part)

function ChatMessageInput({currentId, messages, onSetMessages, onSendMessage}) {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim() && currentId) { 
      onSendMessage(myContactId ,currentId, messageText.trim());
    }
    setMessageText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return(
        <div className='chatMessageInput'>
          <div className='iconContainer'>
            <Paperclip className='paperClipIcon' />
          </div>
          <div className='messageInputContainer'>
            <form onSubmit={handleSubmit}>
              <input className='messageInput' placeholder='Write a message...'
                onChange={(e) => setMessageText(e.target.value)} onKeyDown={handleKeyDown}
                value={messageText}/>
            </form>
          </div>
          <div className='iconContainer'>
            <Smile className='smileIcon' />
          </div>
          <div className='iconContainer'>
            <Mic className='micIcon' />
          </div>
        </div>
  );
}


function MessagesContainer({currentId, messages}) {

  if (!messages || !messages[currentId] || !currentId)
    return <div className='messagesContainer'></div>

  return(
    <div className='messagesContainer'>
      {
        messages[currentId].map(message => (
          <li className= {`message-item ${message.isMine ? 'sent' : 'received'}`} key={message.id}>
            <div className='message-content'>
              {message.text}
              <span className='message-info'>{message.time}</span>
            </div>
          </li>
        ))
      }
    </div>
  );
}

function ChatMainWindow({currentId, messages}) {  
  return(
    <>
      <div className='chatMainWindow'>
        <MessagesContainer currentId={currentId} messages={messages} />
      </div>
    </>
  );
}


// 반드시 수정!!!
function CurrentContact ({currentId}) {
  return(
    <>
      <div className='currentContact'>
        <div className='contactNameContainer'>
        </div>

        <div className='onlineStateContainer'>
        </div>
      </div>
    </>
  );
}

function ChatHeader({currentId}) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleAddContact = () => {
    const contactName = prompt('새 련락처 이름을 입력하시오');
    if (contactName) {
      console.log(contactName);
    }
    setMenuOpen(false);
  }

  return(
    <>
      <div className='chatHeader'>
        <CurrentContact currentId={currentId} />
        <div className='iconsContainer'>

          <div className='iconContainer'>
            <Search className='searchIcon' />
          </div>

          <div className='iconContainer'>
            <MoreVerticalIcon className='moreVerticalIcon' onClick={() => setMenuOpen(!menuOpen)} />
            {menuOpen && (
              <div className='verticalMenu'>
                <div className='menuItem' onClick={handleAddContact} >
                  새 주소 추가
                </div>
                <div className='menuItem'>
                  대화자 정보 보기
                </div>
                <div className='menuItem'>
                  설정
                </div>
              </div>
              
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ChatMainPanel({currentId, messages, onSetMessages, onSendMessage}) {
  const [searchBoxShow, setSearchBoxShow] = useState(false);
  const [verticalBoxShow, setVerticalBoxShow] = useState(false);

  return(
    <>
      <div className='chatMainPanel'>
        <ChatHeader currentId={currentId} />
        <ChatMainWindow currentId={currentId} messages={messages} />
        <ChatMessageInput currentId={currentId} messages={messages} onSetMessages={onSetMessages} onSendMessage={onSendMessage} />
        <div></div>
      </div>
    </>
  );
}

function LoginForm ({onSignIn}) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSignUp = async () => {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-type' : 'application/json' },
      body: JSON.stringify({name, email, password})
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
    }
    else {
      console.log(data.error);
    }
  };
  
  const handleSignIn = async () => {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({email, password})
    });

    const data = await response.json();
    console.log(data);
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      onSignIn(true);
    }
    else {
      console.log(data.error);
    }
  };
 
  return (
    <>
      <form className='login-form-container'>
        <label>{isLogin ? 'Sign In' : 'Sign Up'}</label>
        {!isLogin && (<input type='text' className='login-input' placeholder='Write here your username' value={name} onChange={(e) => setName(e.target.value)}></input>) }
        <input type='text' className='login-input' placeholder='user@domain.region' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input type='password' className='login-input' placeholder="Write here your password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <input type='submit' className='login-input continue-button' value={'CONTINUE'} onClick={(e) => {e.preventDefault(); isLogin? handleSignIn() : handleSignUp();}}></input>
        {isLogin ? 
          (<input type='button' className='login-input create-account-btn' value="CREATE AN ACCOUNT" onClick={() => {
            setIsLogin(!isLogin);
            setPassword('');
            setEmail('');
          }}></input>) :
          (<input type="button" className='login-input create-account-btn' value={'BACK'} onClick={() => {
            setIsLogin(!isLogin);
            setPassword('');
            setEmail('');
            setName('');
          }}></input>)
        }
      </form>
    </>
  );
}

export default function App () {
  const [contactsList, setContactList] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [messages, setMessages] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isSignIn, setIsSignIn] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsSignIn(false);
      return;
    }

    setIsSignIn(true);
    if (!socket) {
      const newSocket = io('http://localhost:3000', {
        auth : {token}
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnet();
        socketRef.current = null;
        setSocket(null);
      }
    };
  }, []);

  useEffect(() => { 
    const token = localStorage.getItem('token');

    if (isSignIn && token && !socketRef.current) {
      const newSocket = io('http://localhost:3000', {
        auth : {token}
      });
      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    if (!isSignIn && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }

  }, [isSignIn]);

  const handleSendMessage = (myContactId, contactId, messageText) => {
    if (socket) {
      socket.emit('sendMessage', {
        senderId: myContactId,
        receiverId: contactId,
        text: messageText,
        isMine: true
      });
    }

    const newMessage = {
      id: Date.now().toString(),
      text: messageText,
      time: new Date().toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit', hour12: false}),
      isMine: true
    };

    setMessages(prev => ({
      ...prev,
      [contactId]: [...prev[contactId], newMessage]
    }));
  };

  return(
    <>
    {isSignIn? (
      <div className='chatSplitView'>
        <ConversationsSidebar contactsList={contactsList} onCurrentIdChange={setCurrentId} messages={messages} />
        <ChatMainPanel currentId={currentId} messages={messages} onSetMessages={setMessages} onSendMessage={handleSendMessage}/>
      </div>
    ) : (
      <div className='login-window'>
        <LoginForm onSignIn={setIsSignIn} /> 
      </div>
    )}
    </>
  );
}