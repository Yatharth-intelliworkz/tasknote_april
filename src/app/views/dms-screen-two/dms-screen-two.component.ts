import { Component } from '@angular/core';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-dms-screen-two',
  templateUrl: './dms-screen-two.component.html',
  styleUrls: ['./dms-screen-two.component.scss']
})
export class DmsScreenTwoComponent {
  constructor(private commonService: CommonService) {}
  ngOnInit(){
  this.commonService.checkLoggedIn();
}
  selectedFiles: File[] = [];

  onFilesSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  getPreviewUrl(file: File): string {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return reader.result as string;
  }

  removeFile(file: File): void {
    const index = this.selectedFiles.indexOf(file);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
    }
  }
}
