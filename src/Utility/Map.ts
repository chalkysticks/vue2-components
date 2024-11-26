/**
 * Convert latitude delta to pixels at a given zoom level
 *
 * @param latitudeDelta The latitude delta
 * @param zoom The zoom level
 * @returns The number of pixels
 */
export function pixelsToLatitudeDelta(pixels: number, zoom: number): number {
	// At zoom level 0, one pixel represents approximately 156543.03392 meters at the equator
	const metersPerPixel = (156543.03392 * Math.cos(0)) / Math.pow(2, zoom);

	// Earth's circumference is approximately 40075017 meters
	return (pixels * metersPerPixel) / 111319.9;
}

/**
 * Convert pixels to longitude delta at a given latitude and zoom level
 *
 * @param pixels The number of pixels
 * @param zoom The zoom level
 * @param latitude The latitude
 * @returns The longitude delta
 */
export function pixelsToLongitudeDelta(pixels: number, zoom: number, latitude: number): number {
	// Need to account for the fact that longitude distances vary with latitude
	const metersPerPixel = (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);
	// Earth's circumference at this latitude
	const earthCircumferenceAtLatitude = 40075017 * Math.cos((latitude * Math.PI) / 180);

	return (pixels * metersPerPixel * 360) / earthCircumferenceAtLatitude;
}
