import { Message, useToaster } from "rsuite";

const toaster = {
  instance: null,
};

const Notification = () => {
  toaster.instance = useToaster();
  return null; // no UI needed
};

// helper function to trigger a toast
export const notify = (
  type = "info",
  message = "",
  placement = "topRight",
  duration = 3000
) => {
  if (!toaster.instance) return;

  const msg = (
    <Message type={type} showIcon closable>
      {message}
    </Message>
  );

  toaster.instance.push(msg, { placement, duration });
};

export default Notification;
