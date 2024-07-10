import React, { useCallback } from 'react';
import { isProductionAppEnvironment } from '@base/common-base';
import * as S from './JiraBadge.styles';
import { PathMetadata } from './pathMetadata.types';
import { usePathMetadata } from './usePathMetadata';

const IS_VISIBLE = !isProductionAppEnvironment();

const JiraBadgeUnwrapped = ({
  pathMetadataList,
}: {
  pathMetadataList: PathMetadata[];
}) => {
  const pathMetadata = usePathMetadata({ pathMetadataList });

  const openLink = useCallback(() => {
    pathMetadata.screenId &&
      window.open(
        `https://oakslab.atlassian.net/browse/${pathMetadata.screenId}`,
        'blank',
      );
  }, [pathMetadata]);

  return IS_VISIBLE && pathMetadata.screenId ? (
    <S.Wrapper>
      <S.Img alt="jira" src="/jira.png" onClick={openLink} />
    </S.Wrapper>
  ) : null;
};

export const JiraBadge = React.memo(JiraBadgeUnwrapped);
