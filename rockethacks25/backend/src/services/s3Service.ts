import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create S3 instance
const s3 = new AWS.S3();

// Upload file to S3
export const uploadFileToS3 = async (
  file: Express.Multer.File,
  bucketName: string = process.env.AWS_BUCKET_NAME || '',
  folderName: string = ''
): Promise<AWS.S3.ManagedUpload.SendData> => {
  // Generate unique file name
  const fileName = `${folderName ? folderName + '/' : ''}${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

  console.log(`Attempting to upload file to S3 bucket: ${bucketName}, key: ${fileName}`);
  
  // Set upload parameters
  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype
    // Removed ACL parameter which might be causing issues
  };

  try {
    console.log('S3 upload params:', JSON.stringify({
      Bucket: params.Bucket,
      Key: params.Key,
      ContentType: params.ContentType,
      BodySize: file.buffer.length
    }));
    
    // Upload to S3
    return await s3.upload(params).promise();
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

// Get all files from a specific folder in S3
export const listFilesFromS3 = async (
  bucketName: string = process.env.AWS_BUCKET_NAME || '',
  folderName: string = ''
): Promise<AWS.S3.ObjectList> => {
  const params: AWS.S3.ListObjectsV2Request = {
    Bucket: bucketName,
    Prefix: folderName
  };

  try {
    const response = await s3.listObjectsV2(params).promise();
    return response.Contents || [];
  } catch (error) {
    console.error('Error listing files from S3:', error);
    throw error;
  }
};

// Delete file from S3
export const deleteFileFromS3 = async (
  key: string,
  bucketName: string = process.env.AWS_BUCKET_NAME || ''
): Promise<AWS.S3.DeleteObjectOutput> => {
  const params: AWS.S3.DeleteObjectRequest = {
    Bucket: bucketName,
    Key: key
  };

  try {
    return await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
}; 