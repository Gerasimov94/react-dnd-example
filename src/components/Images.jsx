import React from 'react'
import { DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend';
import uniqueId from 'lodash.uniqueid';

import Image from './Image';
import { IMAGE } from '../constants/constants';

const style = {
	display: 'flex',
    flexDirection: 'column',
    height: '100%',
	width: '100%',
	overflowY: 'auto',
}

const Images = ({canDrop, isOver, connectDropTarget, allImages}) => {
	let backgroundColor = '#BADEE8';
	const isActive = canDrop && isOver;

	if (isActive) {
		backgroundColor = '#3CB5D6';
	} else if (canDrop) {
		backgroundColor = '#88D3E8';
	}

	return (
		connectDropTarget(
			<div
				ref={connectDropTarget}
				style={{...style, backgroundColor}}
			>
				<h3>
					{!isOver && !canDrop && 'Drag files from the hard drive'}
					{!isOver && canDrop && 'Drag the files here'}
					{isOver && 'Drop the files'}
				</h3>
				
				{allImages.map((item, index) => <Image key={index} item={item} />)}
			</div>
		)
	)
}
	export default DropTarget(
		[NativeTypes.FILE, IMAGE],
		{
			drop: ({updateImages, allImages}, monitor) => {
				if (monitor.getItem().files || !allImages.some(item => item.id === monitor.getItem().item.id)) {
					updateImages(
						monitor.getItem().files
							? monitor.getItem().files.map(file => ({file, id: uniqueId()}))
							: [monitor.getItem().item]
					)
				}
			},
		},
		(connect, monitor) => ({
			connectDropTarget: connect.dropTarget(),
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),

		}),
	)(Images)
