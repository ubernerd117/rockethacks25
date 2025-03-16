import { Component, OnInit } from '@angular/core';
import { FileService, FileItem } from '../../services/file.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class FileListComponent implements OnInit {
  files: FileItem[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(folder: string = '') {
    this.isLoading = true;
    this.error = null;
    this.fileService.listFiles(folder).subscribe({
      next: (response) => {
        this.files = response.files;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load files.';
        console.error('Error loading files:', err);
        this.isLoading = false;
      },
    });
  }
}
