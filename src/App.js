import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';

import './App.css';

import Images from './components/Images';
import DroppedImages from './components/DroppedImages';

class App extends React.Component {

	state = {
		allImages: [],
		storageImages: [],
	}

	updateImages = (images) => this.setState(prevState => ({
		allImages: [
			...prevState.allImages,
			...images,
		],
		storageImages: prevState.storageImages.filter(item => !images.some(elem => elem.id === item.id))
	}));

	moveToStorage = (images) => this.setState(prevState => ({
		storageImages: [
			...prevState.storageImages,
			...images
		],
		allImages: prevState.allImages.filter(item => !images.some(elem => elem.id === item.id))
	}));

  	render() {
		const {allImages, storageImages} = this.state;

		return (
				<div className="App">
					<div className="App-header">
						React DND
					</div>
					<div className="App-container">
						<Images
							updateImages={this.updateImages}
							allImages={allImages}
						/>
						<div className="App-separator" />
						<DroppedImages
							moveToStorage={this.moveToStorage}
							storageImages={storageImages}
						/>
					</div>
				</div>	
		);
	}
}

export default DragDropContext(HTML5Backend)(App)