import { useEffect } from "react";

import NotificationStats
from "../components/NotificationStats";

import NotificationList
from "../components/NotificationList";

import {
  useNotificationStore,
} from "../store/notificationStore";

export default function Notifications() {
  const {
    notifications,
    loading,
    fetchNotifications,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">
        Notifications
      </h1>

      <NotificationStats
        notifications={notifications}
      />

      <NotificationList
        notifications={notifications}
      />
    </div>
  );
}