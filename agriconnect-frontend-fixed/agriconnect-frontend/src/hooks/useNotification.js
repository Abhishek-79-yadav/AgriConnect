import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useEffect,
} from "react";

import {
  fetchNotificationsThunk,
} from "../redux/thunks/notificationThunk";

export default function useNotification() {
  const dispatch =
    useDispatch();

  const {
    notifications,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.notification
  );

  useEffect(() => {
    dispatch(
      fetchNotificationsThunk()
    );
  }, [dispatch]);

  const refresh =
    () => {
      dispatch(
        fetchNotificationsThunk()
      );
    };

  const unreadCount =
    notifications?.filter(
      (item) =>
        !item.read
    ).length || 0;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    refresh,
  };
}