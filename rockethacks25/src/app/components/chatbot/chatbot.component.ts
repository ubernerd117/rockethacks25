import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';  // Your chat service for API calls
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngClass
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule

@Component({
  selector: 'app-chatbot',
  standalone: true,  // Use this if it's a standalone component
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,  // Add HttpClientModule here
  ],  // Add FormsModule to the imports array
})
export class ChatbotComponent {
  userInput: string = '';  // The user's message
  messages: { text: string, isUser: boolean }[] = [];  // Array to store chat messages
  loading: boolean = false;  // Loading state to handle when response is being fetched

  constructor(private chatService: ChatService) {}

  // Function to handle message sending
  sendMessage(): void {
    if (this.userInput.trim()) {
      // Push the user's message to the messages array
      this.messages.push({ text: this.userInput, isUser: true });

      // Set loading state to true while waiting for response
      this.loading = true;

      // Call the chat service to get the AI response
      this.chatService.getChatResponse(this.userInput).subscribe({
        next: (response) => {
          // Extract AI response and push it to the messages array
          const aiMessage = response.choices[0].message.content.trim();
          this.messages.push({ text: aiMessage, isUser: false });
        },
        error: (err) => {
          // In case of error, display an error message
          console.error(err);
          this.messages.push({ text: 'Error: Could not retrieve response from Mistral.', isUser: false });
        },
        complete: () => {
          // Once the response is received, stop loading
          this.loading = false;
        }
      });

      // Clear the input field
      this.userInput = '';
    }
  }
}
