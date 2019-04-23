import React from 'react'
import { DragSource } from 'react-dnd'
import { IMAGE } from '../constants/constants';

const style = {
	border: '1px dashed gray',
	backgroundColor: 'white',
	padding: '1rem',
	margin: '1rem',
	cursor: 'move',
	float: 'left',
}

export const Image = ({ item, isDragging, connectDragSource }) => {
	const opacity = isDragging ? 0.4 : 1

	return (
		<div ref={connectDragSource} style={{...style, opacity}}>
			{item.file.name}
		</div>
	)
}

export default DragSource(
	IMAGE,
  	{
		beginDrag: ({item}) => ({item}),
		endDrag: ({item}) => ({item}),
  	},
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}),
)(Image)
