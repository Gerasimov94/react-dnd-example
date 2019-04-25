import React, {PureComponent} from 'react'
import {DropTarget} from 'react-dnd'
import Image from './Image';
import {IMAGE, IMAGES_STORAGE} from '../constants/constants';

const style = {
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	height: '100%',
	overflowY: 'auto',
}

class DroppedImages extends PureComponent {
	render() {
		const {canDrop, isOver, connectDropTarget, storageImages, moveCard} = this.props;

		let backgroundColor = '#C6EABA';
		const isActive = canDrop && isOver;

		if (isActive) {
			backgroundColor = '#6EBC47';
		} else if (canDrop) {
			backgroundColor = '#AAEB8A';
		}

		return (
			connectDropTarget(
				<div
					ref={connectDropTarget}
					style={{...style, backgroundColor}}
				>
					<h3>
						{!isOver && !canDrop && 'Storage for files'}
						{!isOver && canDrop && 'Drag the files here'}
						{isOver && 'Drop the files'}
					</h3>
					{storageImages.map((item, index) => (
						<Image
							key={item.id}
							item={item}
							index={index}
							moveCard={moveCard}
						/>)
					)}
				</div>
			)
		)
	}
}

export default DropTarget(
	IMAGE,
	{
		drop: ({moveToStorage, storageImages}, monitor) => {
			if (!storageImages.some(item => item.id === monitor.getItem().item.id)) {
				moveToStorage([{...monitor.getItem().item, type: IMAGES_STORAGE}])
			}
		},
	},
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),

	}),
)(DroppedImages)
