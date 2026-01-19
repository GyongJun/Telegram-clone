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

import {useState} from 'react'
import './App.css'

const mockContacts = {
  'conv_1': {id: 'conv_1', name: "Hong Gyong Jun", nickname: "H", state: 'online', iconColor: 'tomato' , lastMessage: 'Hey, guys. Let us play football!!!', lastMessageTime: '11:34', unreadCount: 2},
  'conv_2': {id: 'conv_2', name: 'Ri Won Hyok', nickname: "R", state: 'offline', iconColor: 'blue', lastMessage: 'No I have to study.',  lastMessageTime: '10:34', unreadCount: 7},
  'conv_3': {id: 'conv_3', name: 'Shaine Fian', nickname: "S", state: 'online', iconColor: 'green', lastMessage: 'Yes', lastMessageTime: '09:20', unreadCount: 5}
};

const mockMessages = {
  'conv_1' : [
    {id: '1', text: 'Hello', time: '11:30', isMine: false},
    {id: '2', text: 'Hello, How a Hello, How are you Hello, How are you Hello, How are you Hello, How are you Hello, How are you Hello, How are you', time: '11:31', isMine: true},
    {id: '3', text: 'I am fine. Do you have a minute?' , time:'11:32', isMine: false}
  ],

  'conv_2' : [
    {id: '4', text: 'Hi', time: '06:21', isMine: false},
    {id: '5', text: '1', time: '06:22', isMine: true}
  ],

  'conv_3' : [
    {id: '6', text: '2', time: '15:01', isMine: false},
    {id: '7', text: '3', time: '15:02', isMine: false}
  ]
}

let tempContactsList = [];
let tempMessagesList = [];

let lastMessage = ""
let lastMessageStyle = ""
let lastMessageTime=""

//ConversationsSidebar (Left Part)

function SearchChatInput ({filterText, onSetFilterTextChange}) {
  return(
    <>
      <div className='searchChatInput'>
        <div className='iconContainer'>
          <Menu size={20} className='menuIcon' />
        </div>

        <div className='searchInputContainer'>
          <input className='searchInput' placeholder='Search' onChange={(e) => onSetFilterTextChange(e.target.value)}  />
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
          Object.values(contactsList)
            .filter(contact => contact.name.includes(filterText))
            .map(contact => (
              <ConversationItem key={contact.id} contact={contact} onCurrentIdChange={onCurrentIdChange} messages={messages} />
            ))
        }
      </div>
    </>
  );
}

function ConversationsSidebar ({contactsList, onCurrentIdChange, messages}) {
  const [filterText, setFilterText] = useState('');

  return(
    <div className='conversationsSidebar'>
      <SearchChatInput filterText={filterText} onSetFilterTextChange={setFilterText} />
      <ConversationsList
        contactsList={contactsList}
        onCurrentIdChange={onCurrentIdChange}
        messages={messages} 
        filterText={filterText} />
    </div>
  );
}

// chatMainPanel (Right Part)

function ChatMessageInput({currentId, messages, onSetMessages}) {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim() && currentId) {
      // const nextMessages = {...messages};
      // // console.log(currentId);
      // nextMessages[currentId].push({id: '' + 100 * Math.random(), text: messageText, time:'11:44', isMine: true});
      // onSetMessages(nextMessages);
      const newMessage = {id: Date.now().toString(), text: messageText, time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })};

      const nextMessages = {...messages, [currentId] : [...messages[currentId], newMessage]};
      onSetMessages(nextMessages);
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
              <input className='messageInput' placeholder='Write a message...' onChange={(e) => setMessageText(e.target.value)} onKeyDown={handleKeyDown} value={messageText}/>
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
  tempMessagesList = [];
  if (currentId) {
    if (Object.keys(messages).includes(currentId)) {
      messages[currentId].forEach((message) => {
        if (message.isMine) {
          tempMessagesList.push(
            <li className='message-item sent' key={message.id}>
              <div className='message-content'>
                {message.text}
              <span className='message-info'>
                {message.time}
              </span>

              </div>
            </li>
          );
        }
        else {
          tempMessagesList.push(
            <li className='message-item received' key={message.id}>
              <div className='message-content'>
                {message.text}
                <span className='message-info'>
                  {message.time}
                </span>
              </div>
            </li>
          );
        }
      });
    }
  }

  if (!messages[currentId] && !currentId)
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
  )
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

function CurrentContact ({currentId}) {
  return(
    <>
      <div className='currentContact'>
        <div className='contactNameContainer'>
          {currentId? mockContacts[currentId].name : ""}
        </div>

        <div className='onlineStateContainer'>
          {currentId? mockContacts[currentId].state : ""}
        </div>
      </div>
    </>
  );
}

function ChatHeader({currentId}) {
  return(
    <>
      <div className='chatHeader'>
        <CurrentContact currentId={currentId} />
        <div className='iconsContainer'>
          <div className='iconContainer'>
            <Search className='searchIcon' />
          </div>

          <div className='iconContainer'>
            <MoreVerticalIcon className='moreVerticalIcon' />
          </div>
        </div>
      </div>
    </>
  );
}

function ChatMainPanel({currentId, messages, onSetMessages}) {
  return(
    <>
      <div className='chatMainPanel'>
        <ChatHeader currentId={currentId} />
        <ChatMainWindow currentId={currentId} messages={messages}/>
        <ChatMessageInput currentId={currentId} messages={messages} onSetMessages={onSetMessages} />
        <div></div>
      </div>
    </>
  );
}

function ChatSplitView() {
  const [contactsList, setContactList] = useState(mockContacts);
  const [currentId, setCurrentId] = useState(Object.keys(mockContacts).length > 0 ? Object.keys(mockContacts)[0] : null);
  const [messages, setMessages] = useState(mockMessages);
  return(
    <div className='chatSplitView'>
      <ConversationsSidebar contactsList={contactsList} onCurrentIdChange={setCurrentId} messages={messages} />
      <ChatMainPanel currentId={currentId} messages={messages} onSetMessages={setMessages}/>
    </div>
  );
}

export default function ChatLayout() {
  return (
    <>
      <ChatSplitView />
    </>
  );
}