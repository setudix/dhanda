import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{

  pdfFileURL: string[] = [
    // 'https://example.com/file1.pdf',
    // 'https://example.com/file2.pdf',

  ];

  getFileNameFromURL(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  ngOnInit(): void {
   this.getList();
   
  }
  
  getList() {
    throw new Error('Function not implemented.');
  }
}


