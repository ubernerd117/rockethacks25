import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // Update API URL to point to your backend API endpoint
  private apiUrl: string = 'http://localhost:3000/api/chat'; // Your backend API

  constructor(private http: HttpClient) {}

  // Function to call the Node.js backend, which will handle the Mistral API request
  getChatResponse(message: string): Observable<any> {
    const body = {
      userMessage: message, // Send the user's message to the backend
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Call the backend's API route that will forward the request to Mistral
    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
