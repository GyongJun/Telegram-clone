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

const messages = {
}

//ConversationsSidebar (Left Part)

function SearchInputContainer() {
  return(
    <>
      <div className='searchInputContainer'>
        <input className='searchInput' placeholder='Search' />
      </div>
    </>
  );
}

function SearchChatInput () {
  return(
    <div className='searchChatInput'>
      <div className='iconContainer'>
        <Menu size={20} className='menuIcon' />
      </div>
      <SearchInputContainer />
    </div>
  );
}

function ProfileIconContainer({contact}) {
  return(
    <>
      <div className='profileIconContainer'>
        <div className='profileNickname'>
          {contact.nickname}
        </div>
      </div>
    </>
  )
}

function ProfileMainContainer({contact}) {
  return(
    <>
      <div className='profileMainContainer'>
          <div className='nameAndMessageContainer'>
            <div className='profileName'>
              {contact.name}
            </div>
            <div className='lastMessage'>
              {contact.lastMessage}
            </div>
          </div>

          <div className='timeAndStateContainer'>
            <div className='lastChattingTime'>
              {contact.lastMessageTime}
            </div>
            <div className='messageStateContainer'>
              <div className='messageState'>
                {contact.unreadCount}
              </div>
            </div>
          </div>
      </div>
    </>
  )  
}

function ConversationItem({contact, onCurrentIdChange}) {
  return(
    <>
      <li className='conversationItem' onClick={() => onCurrentIdChange(contact.id)}>
        <ProfileIconContainer contact={contact} />
        <ProfileMainContainer contact={contact} />
      </li>
    </>
  )
}

function ConversationsList({contactsList, onCurrentIdChange}) {
  const tempContactsList = [];
  Object.values(contactsList).forEach((contact) => {
    tempContactsList.push(<ConversationItem contact={contact} key={contact.id} onCurrentIdChange={onCurrentIdChange} />);
  });

  return(
    <>
      <div className='conversationsList'>
        {tempContactsList}
      </div>
    </>
  );
}

function ConversationsSidebar ({contactsList, onCurrentIdChange}) {
  return(
    <div className='conversationsSidebar'>
      <SearchChatInput />
      <ConversationsList contactsList={contactsList} onCurrentIdChange={onCurrentIdChange} />
    </div>
  );
}

// chatMainPanel (Right Part)

function ChatMessageInput() {
  return(
    <div className='chatMessageInput'>
      <div className='iconContainer'>
        <Paperclip className='paperClipIcon' />
      </div>
      <div className='messageInputContainer'>
        <input className='messageInput' placeholder='Write a message...'></input>
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

function ChatMainWindow() {
  return(
    <>
      <div className='chatMainWindow'>
        <div className='messagesContainer'>
          
        </div>
      </div>
    </>
  );
}

function CurrentContact ({currentId}) {
  return(
    <>
      <div className='currentContact'>
        <div className='contactNameContainer'>
          {mockContacts[currentId].name}
        </div>

        <div className='onlineStateContainer'>
          {mockContacts[currentId].state}
        </div>
      </div>
    </>
  )
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

function ChatMainPanel({currentId}) {
  return(
    <>
      <div className='chatMainPanel'>
        <ChatHeader currentId={currentId} />
        <ChatMainWindow />
        <ChatMessageInput />
        <div></div>
      </div>
    </>
  );
}

function ChatSplitView() {
  const [contactsList, setContactList] = useState(mockContacts);
  const [currentId, setCurrentId] = useState(Object.keys(mockContacts)[0]);
  return(
    <div className='chatSplitView'>
      <ConversationsSidebar contactsList={contactsList} onCurrentIdChange={setCurrentId}/>
      <ChatMainPanel currentId={currentId} />
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