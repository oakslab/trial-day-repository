import { useRouter } from 'next/router';
import { type PathMetadata } from './pathMetadata.types';

export const usePathMetadata = ({
  pathMetadataList,
}: {
  pathMetadataList: PathMetadata[];
}): PathMetadata['metadata'] => {
  const location = useRouter();

  const pathMetadata = pathMetadataList.find((pathMetadata) =>
    pathMetadata.pathRegex.test(location.asPath),
  );

  return pathMetadata
    ? pathMetadata.metadata
    : { screenId: '', screenName: '' };
};
