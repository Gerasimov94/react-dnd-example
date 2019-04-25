import React from 'react';
import { MAX_WIDTH, MAX_HEIGHT } from '../constants/constants';

const imagePreviewHelper = (WrappedComponent) => {
    class ImagePreviewHelper extends React.Component {
		async componentDidMount() {
			const {item} = this.props;

			const temporaryFileReader = new FileReader();

			const result = await new Promise((resolve, reject) => {
				temporaryFileReader.onerror = () => {
					temporaryFileReader.abort();
					reject(new DOMException("Problem parsing input file."));
				};

				temporaryFileReader.onload = async () => {
					const img = document.createElement('img');
					img.src = temporaryFileReader.result

					const canvas = document.createElement("canvas");

					const ctx = canvas.getContext("2d");
					await ctx.drawImage(img, 0, 0);
		
					let width = img.width;
					let height = img.height;
		
					if (width > height) {
						if (width > MAX_WIDTH) {
							height *= MAX_WIDTH / width;
							width = MAX_WIDTH;
						}
					} else {
						if (height > MAX_HEIGHT) {
							width *= MAX_HEIGHT / height;
							height = MAX_HEIGHT;
						}
					}
					canvas.width = width;
					canvas.height = height;

					await ctx.drawImage(img, 0, 0, width, height)
		
					const dataurl = canvas.toDataURL("image/png");

					resolve(dataurl);
				};

				temporaryFileReader.readAsDataURL(item.file);
			});

			this.setState({imgSrc: result})
		}
	  
		state = {
			imgSrc: ''
		}
	
		render() {
			return <WrappedComponent {...this.props} item={{...this.props.item, imgSrc: this.state.imgSrc}} />;
		}
    }
  
    return React.forwardRef((props, ref) => {
		return <ImagePreviewHelper {...props} forwardedRef={ref} />;
	});
}

export default imagePreviewHelper;