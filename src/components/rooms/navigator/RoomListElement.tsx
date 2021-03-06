import { ConnectionContext } from 'context/ConnectionContext';
import { WindowContext } from 'context/WindowContext';
import { useContext } from 'react';
import { Room } from 'types/socket';
import PendingMessages from '../PendingMessages';

interface RoomListElementProps {
	room: Room;
}

const RoomListElement: React.FC<RoomListElementProps> = ({ room }) => {
	const { activeRoom, setActiveRoom } = useContext(ConnectionContext)!;
	const { setType, type } = useContext(WindowContext)!;

	const showContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
		// e.preventDefault();
		console.log('hey');
	};

	return (
		<button
			className={`w-full cursor-pointer rounded-lg px-4 py-3 text-left transition bg-white ${
				activeRoom === room.name && type === 'room'
					? 'bg-opacity-100'
					: 'bg-opacity-0'
			}`}
			onClick={() => {
				setActiveRoom(room.name);
				setType('room');
			}}
			onContextMenu={showContextMenu}
		>
			<div className="flex flex-row justify-between items-center">
				<p className="font-bold truncate">#{room.name}</p>
				<PendingMessages count={room.pending} />
			</div>
			<p className="truncate">
				{room.messages[room.messages.length - 1].message ?? ''}
			</p>
		</button>
	);
};

export default RoomListElement;
