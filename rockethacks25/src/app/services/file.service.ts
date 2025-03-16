import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FileListResponse {
  message: string;
  files: FileItem[];
}

export interface FileItem {
  key: string;
  lastModified: Date;
  size: number;
  url: string;
}

export interface FileUploadResponse {
  message: string;
  fileUrl: string;
  key: string;
  bucket: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:3800/api/files';

  constructor(private http: HttpClient) { }

  // Upload a file to S3
  uploadFile(file: File, folder: string = ''): Observable<HttpEvent<FileUploadResponse>> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    
    if (folder) {
      formData.append('folder', folder);
    }

    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request<FileUploadResponse>(req);
  }

  // Get list of files from S3
  listFiles(folder: string = ''): Observable<FileListResponse> {
    let params = new HttpParams();
    if (folder) {
      params = params.set('folder', folder);
    }

    return this.http.get<FileListResponse>(this.apiUrl, { params });
  }

  // Delete a file from S3
  deleteFile(key: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${key}`);
  }
} 