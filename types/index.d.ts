interface IGoogleMapPosition {
	lat: number;
	lng: number;
}

interface IGoogleMapMarker {
	model?: any;
	name?: string;
	position: IGoogleMapPosition;
}

interface IMapPosition {
	latitude: number;
	longitude: number;
}
