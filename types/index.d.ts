interface IGoogleMapPosition {
	lat: number;
	lng: number;
}

interface IGoogleMapMarker {
	model?: any;
	name?: string;
	position: IGoogleMapPosition;
}

interface IGoogleMapMarkerIcon {
	scaledSize: {
		height: number;
		width: number;
	};
	url: string;
}

interface IGoogleMapOption {
	featureType: string;
	stylers: any;
}

interface IMapPosition {
	latitude: number;
	longitude: number;
}

declare module 'vue2-google-maps' {
	import { PluginObject } from 'vue';

	export interface LoadOptions {
		key: string;
		libraries?: string;
		v?: string;
		language?: string;
		region?: string;
		[key: string]: any;
	}

	export interface InstallOptions {
		load: LoadOptions;
		installComponents?: boolean;
	}

	export const install: PluginObject<InstallOptions>;
	export const GmapMap: any;
	export const GmapMarker: any;
	export const GmapInfoWindow: any;
	export const GmapCircle: any;
	export const GmapPolygon: any;
	export const GmapPolyline: any;
	export const GmapRectangle: any;
}
