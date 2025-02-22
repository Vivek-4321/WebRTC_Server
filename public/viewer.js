// window.onload = () => {
//     document.getElementById('my-button').onclick = () => {
//         init();
//     }
// }

// async function init() {
//     const peer = createPeer();
//     peer.addTransceiver("video", { direction: "recvonly" })
// }

// function createPeer() {
//   try{

//     const peer = new RTCPeerConnection({
//     iceServers: [
//         {
//         urls: "stun:stun.relay.metered.ca:80",
//         },
//         {
//         urls: "turn:global.relay.metered.ca:80",
//         username: "f5baae95181d1a3b2947f791",
//         credential: "n67tiC1skstIO4zc",
//         },
//     ]
//     });
//     peer.ontrack = handleTrackEvent;
//     peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
//      peer.onicecandidate = event => {
//        if (event.candidate) {
//          console.log("ICE candidate:", event.candidate);
//        }
//      };
//     peer.onconnectionstatechange = event => {
//            console.log("Connection state change:", peer.connectionState);
//          };
//    peer.oniceconnectionstatechange = event =>{
//      console.log("ICE Connection state change:", peer.iceConnectionState);
//      }

//   return peer;

//   } catch (e) {
//     console.log(e);
//   }
// }

// function createPeer() {
//   try{

//     const peer = new RTCPeerConnection({
//         iceServers: [
//             {
//               urls: "stun:stun.relay.metered.ca:80",
//             },
//             {
//               urls: "turn:global.relay.metered.ca:80",
//               username: "f5baae95181d1a3b2947f791",
//               credential: "n67tiC1skstIO4zc",
//             },
//         ]
//     });
//     peer.ontrack = handleTrackEvent;
//     peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

//     return peer;

//   } catch (e) {
//     console.log(e);
//   }
// }

// async function handleNegotiationNeededEvent(peer) {
//   try {
//      const offer = await peer.createOffer();
//      await peer.setLocalDescription(offer);
//      const payload = {
//      sdp: peer.localDescription
//      };
//      const { data } = await axios.post('/consumer', payload);
//     const desc = new RTCSessionDescription(data.sdp);
//     await peer.setRemoteDescription(desc)
//   } catch (e) {
//     console.log("Error in handleNegotiationNeededEvent:", e);
//    }
// }

// async function handleNegotiationNeededEvent(peer) {
//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);
//     const payload = {
//         sdp: peer.localDescription
//     };

//     const { data } = await axios.post('/consumer', payload);
//     const desc = new RTCSessionDescription(data.sdp);
//     peer.setRemoteDescription(desc).catch(e => console.log(e));
// }

// function handleTrackEvent(e) {
//     document.getElementById("video").srcObject = e.streams[0];
// };

// function handleTrackEvent(e) {
//   console.log("Track event received:", e);
//   if (e.streams && e.streams[0]) {
//      console.log("Stream object", e.streams[0]);
//     const videoElement = document.getElementById("video");
//      videoElement.srcObject = e.streams[0];
//       videoElement.play(); // ADD THIS LINE
//       console.log("Video srcObject set.");

//    e.streams[0].getTracks().forEach(track => {
//        console.log("Track status", track.kind, track.readyState);
//    });
//   } else {
//      console.warn("No stream in track event");
//  }
// };

// viewer.js
window.onload = () => {
  document.getElementById('my-button').onclick = () => {
      init();
  }
}

async function init() {
  const peer = createPeer();
  peer.addTransceiver("video", { direction: "recvonly" })
}

function createPeer() {
try{

  const peer = new RTCPeerConnection({
  iceServers: [
      {
      urls: "stun:stun.relay.metered.ca:80",
      },
      {
      urls: "turn:global.relay.metered.ca:80",
      username: "f5baae95181d1a3b2947f791",
      credential: "n67tiC1skstIO4zc",
      },
  ]
  });
  peer.ontrack = handleTrackEvent;
  peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
   peer.onicecandidate = event => {
     if (event.candidate) {
       console.log("ICE candidate:", event.candidate);
     }
   };
  peer.onconnectionstatechange = event => {
         console.log("Connection state change:", peer.connectionState);
       };
 peer.oniceconnectionstatechange = event =>{
   console.log("ICE Connection state change:", peer.iceConnectionState);
   }

return peer;

} catch (e) {
  console.log(e);
}
} async function handleNegotiationNeededEvent(peer) {
try {
   console.log("handleNegotiationNeededEvent called");
   const offer = await peer.createOffer();
   console.log("Offer created", offer);
   await peer.setLocalDescription(offer);
   console.log("Local Description set:", peer.localDescription)
   const payload = {
   sdp: peer.localDescription
   };
   const { data } = await axios.post('/consumer', payload);
    console.log("Response received from /consumer: ", data)
    console.log("Response SDP", data.sdp)
  const desc = new RTCSessionDescription(data.sdp);
    console.log("Remote description created", desc)
  await peer.setRemoteDescription(desc)
   console.log("Remote Description set:", peer.remoteDescription)
} catch (e) {
  console.log("Error in handleNegotiationNeededEvent:", e);
 }
}function handleTrackEvent(e) {
console.log("Track event received:", e);
if (e.streams && e.streams[0]) {
   console.log("Stream object", e.streams[0]);
  const videoElement = document.getElementById("video");
   videoElement.srcObject = e.streams[0];
    videoElement.play(); // ADD THIS LINE
    console.log("Video srcObject set.");

 e.streams[0].getTracks().forEach(track => {
     console.log("Track status", track.kind, track.readyState);
 });
} else {
   console.warn("No stream in track event");
}
};