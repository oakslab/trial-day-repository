import { frontendEnv } from '@base/frontend-utils-base';

type GoogleMapPlaceProps = {
  googlePlaceId: string;
  width?: string;
  height?: string;
};

export default function GoogleMapPlace({
  googlePlaceId,
  width = '100%',
  height = '600',
}: GoogleMapPlaceProps) {
  return (
    <iframe
      width={width}
      height={height}
      style={{ border: '0' }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=${frontendEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}&q=place_id:${googlePlaceId}`}
    ></iframe>
  );
}
