const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const hangUpButton = document.getElementById('hangUpButton');
const chatBody = document.getElementById('chat-body');

let localStream;
let remoteStream;
let peerConnection;
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' } // STUN server for NAT traversal
    ]
};

// Start video chat
startButton.addEventListener('click', async () => {
    startButton.disabled = true;
    hangUpButton.disabled = false;

    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.addStream(localStream);

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            // Send the candidate to the remote peer through your signaling server
        }
    };

    peerConnection.onaddstream = event => {
        remoteVideo.srcObject = event.stream;
    };

    // Create an offer and set local description
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    // Send offer to the remote peer through your signaling server
});

// Hang up video chat
hangUpButton.addEventListener('click', () => {
    peerConnection.close();
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    startButton.disabled = false;
    hangUpButton.disabled = true;
});


function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText) {
        // Append user message to chat
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.textContent = messageText;
        chatBody.appendChild(userMessage);

        // Clear the input field
        messageInput.value = '';

        // Simulate bot response after a delay
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message';
            botMessage.textContent = 'This is a bot response.';
            chatBody.appendChild(botMessage);

            // Scroll to the bottom of the chat
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);

        // Scroll to the bottom of the chat
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}
// This function needs to handle signaling messages (like receiving offers, answers, and candidates)
