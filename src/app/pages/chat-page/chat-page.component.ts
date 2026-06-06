import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
  standalone: true,
  imports: [AsyncPipe, FormsModule],
})
export class ChatPageComponent {
  chatService = inject(ChatService);
  messages$ = (
    this.chatService.loadMessages() as Observable<DocumentData[]>
  ).pipe(tap(console.log));
  user$ = this.chatService.user$;
  text = '';
  editModeField = '';
  editedText = '';

  sendTextMessage() {
    this.chatService.saveTextMessage(this.text);
    this.text = '';
  }

  uploadImage(event: any) {
    const imgFile: File = event.target.files[0];
    if (!imgFile) {
      return;
    }
    this.chatService.saveImageMessage(imgFile);
  }

  enableEditMode(id: string, text: string) {
    this.editModeField = id;
    this.editedText = text;
  }

  editMessage(id: string, newText: string) {
    this.chatService.updateData('messages/' + id, { text: newText });
    this.editModeField = '';
  }

  cancelEditMode() {
    this.editModeField = '';
    this.editedText = '';
  }
}
