import { S3Client } from '../../../configs/aws-s3';
import { IGetS3Object, IPapaParseResponse } from '../interfaces';
import * as papaparse from 'papaparse';

export const generateSecureUrl = async ({ Bucket, Key }: IGetS3Object) => {
    try {
        return {
            uploadUrl: await S3Client.getSignedUrlPromise('putObject', {
                Bucket,
                Key,
            }),
            error: null,
        };
    } catch (error) {
        return {
            uploadUrl: null,
            error: `Services:S3:generateSecureUrl:${
                error as unknown as string
            }`,
        };
    }
};

export const generateSignedUrl = async ({ Bucket, Key }: IGetS3Object) => {
    try {
        const uploadUrl = await S3Client.getSignedUrl('getObject', {
            Bucket,
            Key,
            Expires: 0, // Set expires to 0 for permanent URL
            // SignatureAlgorithm: 'v4'
        });

        const linkWithoutExp = uploadUrl.split('?')[0];

        return {
            uploadUrl: linkWithoutExp,
            error: null,
        };
    } catch (error) {
        return {
            uploadUrl: null,
            error: `Services:S3:generateSecureUrl:${
                error as unknown as string
            }`,
        };
    }
};

export const getS3Object = async ({ Bucket, Key }: IGetS3Object) => {
    try {
        console.log(Bucket, Key);
        const { Body: content } = await S3Client.getObject({
            Bucket,
            Key,
        }).promise();
        if (!content) throw new Error(`Services:S3:getObject:InvalidKey`);
        return (await papaparse.parse(content.toString(), {
            header: true,
        })) as IPapaParseResponse;
    } catch (error) {
        console.log({ error });
        throw new Error(`Services:S3:getObject`);
    }
};

export const uploadFileToS3 = async (
    file: Express.Multer.File,
    Bucket: string,
    Key: string,
) => {
    try {
        await S3Client.putObject({
            Bucket,
            Key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        }).promise();
    } catch (error) {
        throw new Error(`Services:S3:uploadFile:${error as string}`);
    }
};
