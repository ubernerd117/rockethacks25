import { Injectable } from '@angular/core';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private s3Client: S3Client;

  constructor() {
    // Initialize S3 client
    this.s3Client = new S3Client({
      region: environment.aws.region,
      credentials: {
        accessKeyId: environment.aws.accessKeyId,
        secretAccessKey: environment.aws.secretAccessKey
      }
    });
  }

  uploadFile(file: File, bucketName: string, key: string): Observable<any> {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: file.type
      }
    });

    return from(upload.done());
  }

  // Generate a presigned URL for temporary access to a file
  async getSignedUrl(bucketName: string, key: string): Promise<string> {
    const command = {
      Bucket: bucketName,
      Key: key
    };
    
    try {
      return await this.s3Client.getSignedUrl('getObject', command);
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }
} 