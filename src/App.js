import { useEffect, useRef, useState} from 'react';
import Peer from 'peerjs';


function App() {

  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef("");
  const currentUserVideoRef = useRef("");
  const peerInstance = useRef("");

  useEffect(() => {
  const peer = new Peer();

  peer.on('open', (id) => {
  setPeerId(id)
  });

  peer.on('call', (call) => {
  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', function(remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
        });
      });
    })

    peerInstance.current = peer;
  }, [])

  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
    currentUserVideoRef.current.srcObject = mediaStream;
    currentUserVideoRef.current.play();

    const call = peerInstance.current.call(remotePeerId, mediaStream);

    call.on('stream', (remoteStream) => {
    remoteVideoRef.current.srcObject = remoteStream;
    remoteVideoRef.current.play();
    });
    });
  };

  return (
    <div >
      <h1 className='text-4xl font-bold text-blue-700 text-center mt-5'>  ZOOM</h1>

       <div className='ml-40 mt-5 border-2 border-black focus:border-blue-500 p-5 h-100 w-80 '>
          <h1 className='font-bold text-2lg text-center '> Video Call Dialer</h1>
       <h1 className='font-bold font-mono text-lg'>Current user id  </h1>
      <h2 className='font-bold hover:text-red-500'>{peerId}</h2>
    
     <input type="text"
     className="focus:outline-blue-500  outline-black"
     value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
      <button  className="ml-5 mt-2 bg-black rounded-lg w-15 p-2 text-white hover:text-white hover:bg-blue-500" onClick={() => call(remotePeerIdValue)}>Call</button>
        
      </div>
      <div className="flex">
      <div>
        <video
         className="h-25 w-35"
         ref={currentUserVideoRef}>
         </video>
         </div>
         <div >
         <video 
         className="h-25 w-35"
         ref={remoteVideoRef}>
         </video>
         </div>
        </div>
    </div>
  );
}

export default App;