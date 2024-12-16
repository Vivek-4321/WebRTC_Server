window.onload = () => {
    document.getElementById('my-button').onclick = () => {
        init();
    }
}

async function init() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById("video").srcObject = stream;
    const peer = createPeer();
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
}


function createPeer() {
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
            {
              urls: "turn:global.relay.metered.ca:80?transport=tcp",
              username: "f5baae95181d1a3b2947f791",
              credential: "n67tiC1skstIO4zc",
            },
            {
              urls: "turn:global.relay.metered.ca:443",
              username: "f5baae95181d1a3b2947f791",
              credential: "n67tiC1skstIO4zc",
            },
            {
              urls: "turns:global.relay.metered.ca:443?transport=tcp",
              username: "f5baae95181d1a3b2947f791",
              credential: "n67tiC1skstIO4zc",
            },
        ]
    });
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    const { data } = await axios.post('/broadcast', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}


