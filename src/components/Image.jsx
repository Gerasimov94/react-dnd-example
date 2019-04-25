import React, {useImperativeHandle, useRef, useEffect} from "react";
import {DragSource, DropTarget} from 'react-dnd'
import {IMAGE} from '../constants/constants';
import imagePreviewHelper from "./imagePreviewHelper";

const style = {
	border: '1px dashed gray',
	backgroundColor: 'white',
	padding: '1rem',
	margin: '1rem',
	cursor: 'move',
	float: 'left',
	maxWidth: 400,
	maxHeight: 400,
	// width: 'calc(100% - 40px)', enable this for fix sizes of images
	// height: 400,
}

const ImageComponent = ({
	item, connectDragPreview, isDragging,
	connectDragSource, connectDropTarget, forwardedRef
}) => {
	const elementRef = useRef(null);
	connectDragSource(elementRef);
	connectDropTarget(elementRef);
	useEffect(() => {
		const image = new Image(100, 200);
		image.src = item.imgSrc;
		image.onload = () => connectDragPreview(image, null, {});
	})

	useImperativeHandle(forwardedRef, () => ({
		getNode: () => elementRef.current
	}));

	return (
		<div ref={elementRef} style={isDragging ? {...style, backgroundColor: '#FFF1D2'} : style}>
			{item.file.name}
			<br />
			<img src={item.imgSrc} alt='' />
		</div>
	)
}

export default DropTarget(
	IMAGE,
	{
	  hover({moveCard, index}, monitor, component) {
		if (!component) return null;

		const node = component.getNode();

		if (!node) return null;

		const {item, index: dragIndex} = monitor.getItem();

		if (dragIndex === index) return;

		const hoverBoundingRect = node.getBoundingClientRect();
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
		const clientOffset = monitor.getClientOffset();
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		if (
			(dragIndex < index && hoverClientY < hoverMiddleY) ||
			(dragIndex > index && hoverClientY > hoverMiddleY)
		) {
		  	return;
		}

		moveCard(dragIndex, index, item.type);
		monitor.getItem().index = index;
	  }
	},
	connect => ({
	  connectDropTarget: connect.dropTarget()
	})
)(DragSource(
	IMAGE,
  	{
		beginDrag: ({item, index}) => ({item, index}),
		endDrag: ({item, index}) => ({item, index}),
  	},
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
		connectDragPreview: connect.dragPreview(),
	}),
)(imagePreviewHelper(ImageComponent)))
