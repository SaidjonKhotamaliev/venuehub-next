import React from 'react';
import Image from 'next/image';

const DownloadSection: React.FC = () => {
	return (
		<section className="download-section">
			<div className="download-container">
				<h2 className="title">Download Our App</h2>
				<p className="description">
					Get our app on your mobile device to experience all the features at your fingertips. Download now and stay
					connected!
				</p>

				<div className="app-store-buttons">
					<a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" style={{ height: '80px' }}>
						<div className="store-button play-store">
							<Image src="/img/logo/PlayMarket.png" alt="Play Store" width={120} height={40} />
						</div>
					</a>
					<a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
						<div className="store-button app-store">
							<Image src="/img/logo/AppStore.png" alt="App Store" width={120} height={40} />
						</div>
					</a>
				</div>
			</div>
		</section>
	);
};

export default DownloadSection;
