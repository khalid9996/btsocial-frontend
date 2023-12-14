import Avatar from "../../avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import "./chatWindow.scss";
import MessageInput from "../../chat/window/message-input/MessageInput";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Utils } from "../../../services/utils/utils.service";
import { user_getUserProfileByUserId } from "../../../services/api/user/user.service";
import { ChatUtils } from "../../../services/utils/utils.chat.service";
import { chatService } from "../../../services/api/chat/chat.service";
import { some } from "lodash";
import MessageDisplay from "../../chat/window/message-display/MessageDisplay";

const ChatWindow = () => {
  const { profile } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.chat);
  const [receiver, setReceiver] = useState(null);
  const [conversationId, setConversationId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();

  const getChatMessages = useCallback(
    async (receiverId) => {
      try {
        const response = await chatService.getChatMessages(receiverId);
        ChatUtils.privateChatMessages = [...response.data.messages];
        setChatMessages([...ChatUtils.privateChatMessages]);
      } catch (error) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      }
    },
    [dispatch]
  );

  const getNewUserMessages = useCallback(() => {
    if (searchParams.get("id") && searchParams.get("username")) {
      setConversationId("");
      setChatMessages([]);
      getChatMessages(searchParams.get("id"));
    }
  }, [getChatMessages, searchParams]);

  const getUserProfileByUserId = useCallback(async () => {
    try {
      const response = await user_getUserProfileByUserId(
        searchParams.get("id")
      );
      setReceiver(response.data.user);
      ChatUtils.joinRoomEvent(response.data.user, profile);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  }, [dispatch, profile, searchParams]);

  const sendChatMessage = async (message, gifUrl, selectedImage) => {
    try {
      const checkUserOne = some(
        ChatUtils.chatUsers,
        (user) =>
          user?.userOne === profile?.username &&
          user?.userTwo === receiver?.username
      );
      const checkUserTwo = some(
        ChatUtils.chatUsers,
        (user) =>
          user?.userOne === receiver?.username &&
          user?.userTwo === profile?.username
      );
      const messageData = ChatUtils.messageData({
        receiver,
        conversationId,
        message,
        searchParamsId: searchParams.get("id"),
        chatMessages,
        gifUrl,
        selectedImage,
        isRead: checkUserOne && checkUserTwo,
      });
      await chatService.saveChatMessage(messageData);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const updateMessageReaction = async (body) => {
    try {
      await chatService.updateMessageReaction(body);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const deleteChatMessage = async (senderId, receiverId, messageId, type) => {
    try {
      await chatService.markMessageAsDelete(
        messageId,
        senderId,
        receiverId,
        type
      );
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  useEffect(() => {
    if (rendered) {
      getUserProfileByUserId();
      getNewUserMessages();
    }
    if (!rendered) setRendered(true);
  }, [getUserProfileByUserId, getNewUserMessages, searchParams, rendered]);

  useEffect(() => {
    if (rendered) {
      ChatUtils.socketIOMessageReceived(
        chatMessages,
        searchParams.get("username"),
        setConversationId,
        setChatMessages
      );
    }
    if (!rendered) setRendered(true);
    ChatUtils.usersOnline(setOnlineUsers);
    ChatUtils.usersOnChatPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, rendered]);

  useEffect(() => {
    ChatUtils.socketIOMessageReaction(
      chatMessages,
      searchParams.get("username"),
      setConversationId,
      setChatMessages
    );
  }, [chatMessages, searchParams]);

  return (
    <div className="chat-window-container">
      {isLoading ? (
        <div className="message-loading"></div>
      ) : (
        <div>
          <div className="chat-title">
            {receiver && (
              <div className="chat-title-avatar">
                <Avatar
                  name={receiver?.username}
                  bgColor={
                    receiver.profilePicture == "undefined"
                      ? "transparent"
                      : receiver.avatarColor
                  }
                  textColor="#ffffff"
                  size={40}
                  avatarSrc={
                    receiver?.profilePicture == "undefined"
                      ? ""
                      : receiver?.profilePicture
                  }
                />
              </div>
            )}

            <div className="chat-title-items">
              <div
                className={`chat-name ${
                  Utils.checkIfUserIsOnline(receiver?.username, onlineUsers)
                    ? ""
                    : "user-not-online"
                }`}
              >
                {receiver?.username}
              </div>
              {Utils.checkIfUserIsOnline(receiver?.username, onlineUsers) && (
                <span className="chat-active">Online</span>
              )}
            </div>
          </div>
          <div className="chat-window">
            <div className="chat-window-message">
              <MessageDisplay
                chatMessages={chatMessages}
                profile={profile}
                updateMessageReaction={updateMessageReaction}
                deleteChatMessage={deleteChatMessage}
              />
            </div>
            <div className="chat-window-input">
              <MessageInput setChatMessage={sendChatMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatWindow;
