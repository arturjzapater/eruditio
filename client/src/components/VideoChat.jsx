import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import hangUp from '../media/end-call.svg';

const VideoChat = ({ id, onRemoveVideo }) => {
    const userVideo = useRef();
    const otherVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();

    const callUser = userID => {
        peerRef.current = createPeer(userID);
        userStream.current
            .getTracks()
            .forEach(track => peerRef.current.addTrack(track, userStream.current));
    };

    const createPeer = userID => {
        const peer = new RTCPeerConnection({
            iceServers: [{
                urls: 'stun:stun.stunprotocol.org',
            }, {
                urls: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com',
            }],
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    };

    const handleNegotiationNeededEvent = (userID) => {
        peerRef.current
            .createOffer()
            .then(offer => peerRef.current.setLocalDescription(offer))
            .then(() => {
                const payload = {
                    target: userID,
                    caller: socketRef.current.id,
                    sdp: peerRef.current.localDescription,
                };
                socketRef.current.emit('offer', payload);
            })
            .catch(console.error);
    };

    const handleRecieveCall = incoming => {
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current
            .setRemoteDescription(desc)
            .then(() => {
                userStream.current
                    .getTracks()
                    .forEach(track => peerRef.current.addTrack(track, userStream.current));
            })
            .then(() => peerRef.current.createAnswer())
            .then(answer => peerRef.current.setLocalDescription(answer))
            .then(() => {
                const payload = {
                    target: incoming.caller,
                    caller: socketRef.current.id,
                    sdp: peerRef.current.localDescription,
                };
                socketRef.current.emit('answer', payload);
            });
    };

    const handleAnswer = message => {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current
            .setRemoteDescription(desc)
            .catch(console.error);
    };

    const handleICECandidateEvent = e => {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            };
            socketRef.current.emit('ice-candidate', payload);
        }
    };

    const handleNewICECandidateMsg = incoming => {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current
            .addIceCandidate(candidate)
            .catch(console.error);
    };

    const handleTrackEvent = e => {
        otherVideo.current.srcObject = e.streams[0];
    };

    const handleHangup = () => {
        userStream.current.getTracks()
            .forEach(x => x.stop());
        if (peerRef.current) peerRef.current.close();
        socketRef.current.emit('leave room', id);
        onRemoveVideo();
    };

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then(stream => {
                userVideo.current.srcObject = stream;
                userStream.current = stream;
                socketRef.current = io.connect('http://localhost:5000');

                socketRef.current.emit('join room', id);

                socketRef.current.on('room full', userID => {
                    callUser(userID);
                    otherUser.current = userID;
                });
                socketRef.current.on('user joined', userID => {
                    otherUser.current = userID;
                });
                socketRef.current.on('offer', handleRecieveCall);
                socketRef.current.on('answer', handleAnswer);
                socketRef.current.on('ice-candidate', handleNewICECandidateMsg);
                socketRef.current.on('user left', () => otherVideo.current.srcObject = null);
            });
        return handleHangup;
    }, []);

    return (
        <div className='bg-black flex flex-grow justify-center relative min-h-1 max-w-1'>
            <video autoPlay ref={userVideo} className='absolute top-1 right-1 w-1/5 h-1/5' muted='muted' />
            <video autoPlay ref={otherVideo} />
            <button onClick={handleHangup} className='absolute m-auto bottom-1'>
                <img src={hangUp} />
            </button>
        </div>
    );
};

export default VideoChat;