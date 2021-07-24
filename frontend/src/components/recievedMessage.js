const RecievedMessage = ({ userId, msgBody }) => {
  return (
    <div className="msg-container msg-recieved">
      <div id="userid">{userId}</div>
      {msgBody}
    </div>
  );
};

export default RecievedMessage;
