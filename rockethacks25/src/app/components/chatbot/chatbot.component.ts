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
  topics: string[] = ['general', 'classes', 'assignments', 'users', 'submissions'];
  selectedTopic: string = ''; // Empty means use the general chat endpoint

  constructor(private chatService: ChatService) {
    // Add a welcome message
    this.messages.push({ 
      text: 'Hello! I\'m your educational assistant. How can I help you today?', 
      isUser: false 
    });
  }

  // Function to handle message sending
  sendMessage(): void {
    if (this.userInput.trim()) {
      // Push the user's message to the messages array
      this.messages.push({ text: this.userInput, isUser: true });

      // Set loading state to true while waiting for response
      this.loading = true;

      // Determine which service method to call based on selected topic
      const observable = this.selectedTopic 
        ? this.chatService.getTopicChatResponse(this.selectedTopic, this.userInput)
        : this.chatService.getChatResponse(this.userInput);

      // Call the service to get the AI response
      observable.subscribe({
        next: (response) => {
          // Extract AI response and push it to the messages array
          const aiMessage = response.response;
          this.messages.push({ text: aiMessage, isUser: false });
        },
        error: (err) => {
          // In case of error, display an error message
          console.error(err);
          this.messages.push({ text: 'Error: Could not retrieve response.', isUser: false });
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

  // Function to change the selected topic
  changeTopic(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTopic = selectElement.value;
    
    const topicMessage = this.selectedTopic 
      ? `Switched to ${this.selectedTopic} mode. Ask me anything about ${this.selectedTopic}!` 
      : 'Switched to general mode. Ask me anything!';
    
    this.messages.push({ text: topicMessage, isUser: false });
  }
}
