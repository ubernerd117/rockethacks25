import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // Update API URL to point to your backend API endpoint
  private apiUrl: string = environment.apiBaseUrl + '/api/chat'; // Your backend API

  constructor(private http: HttpClient) {}

  // Function to call the Node.js backend
  getChatResponse(message: string): Observable<any> {
    const body = {
      query: message, // Changed from userMessage to query to match our backend
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Call the backend's API route
    return this.http.post<any>(this.apiUrl, body, { headers });
  }

  // Function to call the topic-specific endpoint
  getTopicChatResponse(topic: string, message: string): Observable<any> {
    const body = {
      query: message, // Use query to match our backend
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Call the topic-specific backend route
    return this.http.post<any>(`${this.apiUrl}/${topic}`, body, { headers });
  }
}
