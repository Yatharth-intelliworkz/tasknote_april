import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UntypedFormControl, FormControl, ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from '../service/common.service';

interface ICountry {
  item_id: any;
  item_text: string;
  image: string;
  isDisabled?: boolean;
}

@Component({
  selector: 'app-dms',
  templateUrl: './dms.component.html',
  styleUrls: ['./dms.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, RouterModule, ReactiveFormsModule,NgMultiSelectDropDownModule,MatFormFieldModule,MatInputModule]
})
export class DmsComponent {


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


  addFolderForm!: FormGroup;

  fileForm!: FormGroup;

  selectedItems2: ICountry[] = [];
  form: FormGroup;
  countries: Array<ICountry> = [];

  dropdownSettings2: any = {};

  constructor(private fb: FormBuilder,private formBuilder: FormBuilder, private commonService: CommonService) {


    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });


    this.form = this.fb.group({
      selectedItems2: [[]], // Initialize as an empty array
      // attech file
      addFolderForm: ['initialValue'],
      // attech file
    });

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };


    this.countries = [
      {
        item_id: 1,
        item_text: 'Arvind Rajput',
        image: 'url_to_image1.jpg',
      },
      {
        item_id: 2,
        item_text: 'Nikunj Sojitra',
        image: 'url_to_image2.jpg',
      },
      {
        item_id: 3,
        item_text: 'Mital Gandhi',
        image: 'url_to_image3.jpg',
      },
      {
        item_id: 3,
        item_text: 'Yamini Patel',
        image: 'url_to_image3.jpg',
      },
    ];


  }

  ngOnInit(){
    this.commonService.checkLoggedIn();
  }
}
