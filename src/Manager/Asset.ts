import ChalkySticks from '@chalkysticks/sdk';

/**
 * @author Matt Kenefick <matt@chalkysticks.com>
 * @package Manager
 * @project ChalkySticks SDK Vue2.0 Components
 */
export class Asset extends ChalkySticks.Core.Event.Dispatcher {
	/**
	 * @type Record<string, any>
	 */
	private assetMap: Record<string, any> = {};

	/**
	 * We are lowercasing the path to fix mixed up directory casings
	 *
	 * @return void
	 */
	public createIndex(): void {
		// Use require.context to dynamically load assets from node_modules/@chalkysticks/sass/build (Webpack only)
		const context = require.context('@chalkysticks/sass/build', true, /\.(webp|png|jpg|gif|glb|gltf|webm|svg|mp3|mp4|riv|ttf|otf|woff|woff2)$/i);

		context.keys().forEach((key: string) => {
			const formattedKey = key
				.replace('./', '')
				.toLowerCase()
				.replace(/^\/src\/asset\//, '');

			if (!this.assetMap[formattedKey]) {
				this.assetMap[formattedKey] = context(key).default || context(key);
			}
		});

		console.log('🔺 Asset Indexing Complete', this.assetMap);
		this.trigger('complete');
	}

	/**
	 * @param string path
	 * @param boolean preferWebm
	 * @return any
	 */
	public getAsset(path: string, preferWebm: boolean = false): any {
		const normalizedPath: string = path.toLowerCase();

		if (preferWebm) {
			const webmVersion = normalizedPath.replace('.mp4', '.webm');

			if (this.assetMap[webmVersion]) {
				return this.assetMap[webmVersion];
			}
		}

		return this.assetMap[normalizedPath] || '';
	}
}

/**
 * @param string pathTo
 * @return string
 */
export function assetRef(pathTo: string): any {
	console.log('🔺 Asset Request:', pathTo);

	if (pathTo?.trim().length < 1) {
		console.warn('🔺 Attempting to get empty asset');
		return '';
	}

	if (pathTo.indexOf('http') > -1) {
		return pathTo;
	}

	// Attempt to retrieve the asset using the pre-indexed map
	return instance.getAsset(pathTo);
}

// Singleton
const instance = new Asset();

export default instance;
