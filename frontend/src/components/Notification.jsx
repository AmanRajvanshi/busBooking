// src/components/Notification.jsx
import { useEffect } from "react";
import { Message, useToaster } from "rsuite";

let toasterRef = null;

const Notification = () => {
  const toaster = useToaster();

  // Save toaster instance globally once this component mounts
  useEffect(() => {
    toasterRef = toaster;
  }, [toaster]);

  // No UI needed, this just sets up the toaster
  return null;
};

export const notify = (
  type = "info",
  message = "",
  placement = "topEnd",
  duration = 3000
) => {
  if (!toasterRef) return; // not mounted yet

  const msg = (
    <Message type={type} showIcon closable>
      {message}
    </Message>
  );

  toasterRef.push(msg, { placement, duration });
};

export default Notification;
