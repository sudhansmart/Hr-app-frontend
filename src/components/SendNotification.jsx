import React, { useState } from "react";
import { io } from "socket.io-client";
import { FloatingLabel, Form,Button } from "react-bootstrap";

// Initialize socket only once and outside the component
// const socket = io("http://103.38.50.152/nodejs");

function SendNotification() {
  const [message, setMessage] = useState("");

  const sendNotification = () => {
    if (message) {
      socket.emit("send_notification", { message });
      setMessage(""); // Clear the input after sending the message
    }
  };

  return (
    <div>
       <FloatingLabel
        controlId="floatingInput"
        label="Notification Message"
        className="mb-3"
      >
        <Form.Control type="text-area"
         value={message}
         onChange={(e) => setMessage(e.target.value)} 
         placeholder="Notification Message" />
      </FloatingLabel>
      <Button variant="success" onClick={sendNotification}>Send Notification</Button>
    </div>
  );
}

export default SendNotification;
