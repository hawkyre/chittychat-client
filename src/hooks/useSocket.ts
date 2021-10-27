import { useEffect, useLayoutEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, Room, RoomGroup } from 'types/socket';

const useSocket = () => {
	const [rooms, setRooms] = useState<RoomGroup>(new Map());
	const [activeRoom, setActiveRoom] = useState('');
	const [insideRoom, setInsideRoom] = useState(false);
	const [socket, setSocket] = useState<Socket>();
	const [user, setUser] = useState(`hawk${Math.random()}`);

	useEffect(() => {
		console.log('in useEffect');

		if (socket?.connected)
			return () => {
				socket?.close();
			};

		const s = io('http://localhost:3001');
		s.on('message', (data) => {
			console.log(data);
			console.log('received msg');

			addMessageToRoom(data.room, data.message);
			console.log('Added message after!!!');
		});
		setSocket(s);

		return () => {
			socket?.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		console.log('rooms changed: ', rooms.get(activeRoom)?.messages.length);
		console.log(socket);
	}, [rooms, activeRoom, socket]);

	function joinRoom(room: string): void {
		console.log('joining room: ', room);

		socket?.emit('join-request', {
			user,
			room,
		});

		setRooms((rooms) => {
			const newRoom: Room = {
				name: room,
				messages: [
					{
						date: Date.now(),
						message: 'Welcome to chat!',
						sender: user,
					},
				],
			};
			rooms.set(room, newRoom);
			return new Map(rooms);
		});

		setActiveRoom(room);
		setInsideRoom(true);
	}

	function sendMessage(room: string, message: string) {
		socket?.emit('message', {
			room,
			message: {
				message,
				date: Date.now(),
				sender: user,
			} as ChatMessage,
		});

		addMessageToRoom(room, {
			date: Date.now(),
			message,
			sender: user,
		});
	}

	function addMessageToRoom(room: string, message: ChatMessage) {
		setRooms((rs) => {
			const roomObj = rs.get(room);
			if (!roomObj) return rs;

			if (roomObj.messages.find((m) => m.date === message.date)) {
				return rs;
			}

			console.log(message);

			roomObj.messages.push(message);
			return new Map(rs);
		});
	}

	return {
		joinRoom,
		rooms,
		insideRoom,
		sendMessage,
		activeRoom,
		setActiveRoom,
	};
};

export default useSocket;
