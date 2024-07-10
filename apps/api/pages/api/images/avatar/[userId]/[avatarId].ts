import 'reflect-metadata';
import type { NextApiRequest, NextApiResponse } from 'next';
import Container from 'typedi';
import { UserAssetsService } from '../../../../../src/services/user/user-assets.service';
import { addHeadersToRes } from '../../../../../src/utils/headers';

type ResponseData = {
  message: string;
};

export default async function handler(
  nextReq: NextApiRequest,
  nextRes: NextApiResponse<ResponseData>,
) {
  const { req, res } = addHeadersToRes(nextReq, nextRes);
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({
      message: 'Invalid method, only GET allowed!',
    });
    return;
  }

  const userId = req.query.userId as string;
  const avatarId = req.query.avatarId as string;

  const assetsService = Container.get(UserAssetsService);

  if (!userId || !avatarId) {
    res.status(400).json({
      message: 'Invalid userId or avatarId',
    });
    return;
  }

  const { stream, mimeType } = assetsService.streamFileFromStorage({
    userId: userId,
    filename: avatarId,
    location: 'public',
  });

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  stream.pipe(res);
}
