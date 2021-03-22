import {
  SET_USER_DATA,
  ADD_USER_INTERACTION,
  REMOVE_USER_INTERACTION,
  TOGGLE_IS_STREAM_PLAYING,
  TOGGLE_SHOW_EMOJI_BASKET,
  ADD_MESSAGES,
  CLEAR_MESSAGES,
  SHOW_SNAPSHOT_SHARE_POPUP,
  SET_SESSION_CHECHED,
  UNSET_USER_DATA,
  UPDATE_SUBSCRIPTION_DATA,
} from './types';

const DEFAULT_INTERACTION_TIMEOUT = 3000;

export const setUserData = ({ _id: userId, ...rest}) => ({
  type: SET_USER_DATA,
  payload: {
    userId,
    ...rest,
  },
});

let interactionId = 0;
const newUserInteraction = (payload) => ({
  type: ADD_USER_INTERACTION,
  payload: { ...payload, interactionId },
});

const removeUserInteraction = () => ({ type: REMOVE_USER_INTERACTION });

export const addUserInteraction = (payload) => (dispatch) => {
  interactionId += 1;
  dispatch(newUserInteraction(payload));
  setTimeout(() => dispatch(removeUserInteraction()), payload.ttl || DEFAULT_INTERACTION_TIMEOUT);
}

export const toggleIsStreamPlaying = () => ({ type: TOGGLE_IS_STREAM_PLAYING });
export const toggleShowEmojiBasket = () => ({ type: TOGGLE_SHOW_EMOJI_BASKET });

let messageId = 0;

const addChatMessage = (message) => ({
  type: ADD_MESSAGES,
  payload: message,
});

export const addMessages = (messages) => (dispatch) => {
  const messageList = messages.map((message) => {
    messageId += 1;
    return { ...message, messageId };
  });

  messageId += 1;
  dispatch(addChatMessage({ messages: messageList }));
}

export const clearMessages = () => ({
  type: CLEAR_MESSAGES,
});

export const showSnapshotShare = (show) => ({
  type: SHOW_SNAPSHOT_SHARE_POPUP,
  payload: { show },
});

export const setUserSessionChecked = () => ({ type: SET_SESSION_CHECHED });
export const unsetUserData = () => ({ type: UNSET_USER_DATA });

export const updateSubscription = (payload) => ({
  type: UPDATE_SUBSCRIPTION_DATA,
  payload,
});
