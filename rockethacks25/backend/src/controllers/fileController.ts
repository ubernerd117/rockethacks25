import { Request, Response } from 'express';
import { uploadFileToS3, listFilesFromS3, deleteFileFromS3 } from '../services/s3Service';

// Upload a file to S3
export const uploadFile = async (req: Request, res: Response) => {
  try {
    console.log('Upload request received:', {
      headers: req.headers['content-type'],
      hasFile: !!req.file,
      body: req.body
    });
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Get folder name from request if provided
    const folderName = req.body.folder || '';

    // Upload file to S3
    const result = await uploadFileToS3(req.file, undefined, folderName);

    console.log('Upload successful:', {
      location: result.Location,
      key: result.Key,
      bucket: result.Bucket
    });

    // Return success response
    return res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl: result.Location,
      key: result.Key,
      bucket: result.Bucket
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to upload file', 
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// List all files in a folder
export const listFiles = async (req: Request, res: Response) => {
  try {
    // Get folder name from request if provided
    const folderName = req.query.folder as string || '';

    // List files from S3
    const files = await listFilesFromS3(undefined, folderName);

    // Format response
    const formattedFiles = files.map(file => ({
      key: file.Key,
      lastModified: file.LastModified,
      size: file.Size,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`
    }));

    // Return success response
    return res.status(200).json({
      message: 'Files retrieved successfully',
      files: formattedFiles
    });
  } catch (error) {
    console.error('Error listing files:', error);
    return res.status(500).json({ error: 'Failed to list files' });
  }
};

// Delete a file from S3
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({ error: 'File key is required' });
    }

    // Delete file from S3
    await deleteFileFromS3(key);

    // Return success response
    return res.status(200).json({
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ error: 'Failed to delete file' });
  }
}; 