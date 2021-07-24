import React, { useState, useEffect } from "react";
import "./App.css";
import { socket } from "./service/socket";
import LogoSVG from "./components/logoSVG";
import SentMessage from "./components/sentMessage";
import RecievedMessage from "./components/recievedMessage";

function App() {
  const [message, setMessage] = useState(null);
  const [text, setText] = useState("");
  const [info, setInfo] = useState("");
  const [total, setTotal] = useState(0);
  const [ID, setID] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setID(socket.id);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  socket.on("total", (num) => {
    setTotal(num);
  });

  socket.on("message", (text) => {
    message ? setMessage([...message, text]) : setMessage([text]);
    setInfo("");
  });
  socket.on("typing", (id) => {
    setInfo(`${id} is typing...`);
  });

  return (
    <div className="container">
      <h1>Socket Demo</h1>
      <div className="chat-container">
        <div className="chat-header">
          <LogoSVG />
          <div>
            My ID: <b>{ID}</b>
          </div>
          <div>Connected Uses: {total}</div>
        </div>

        <div className="chat-body">
          <div id="info">{info}</div>
          {message &&
            message.map((msg) => {
              console.log(msg.text);
              if (socket.id === msg.id) return <SentMessage msgBody={msg.text} />;
              return <RecievedMessage msgBody={msg.text} userId={msg.id} />;
            })}
        </div>

        <div className="chat-footer">
          <textarea
            id="textarea"
            placeholder="Type Something..."
            onChange={(e) => {
              setText(e.target.value);
              socket.emit("typing", { id: socket.id });
            }}
          />
          <button
            id="send"
            onClick={() => {
              document.querySelector("#textarea").value = "";
              socket.emit("message", { text, id: socket.id });
            }}
          >
            <i className="fa fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
