import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../_services/auth.service';
import { StorageService } from '../../_services/storage.service';
import { DataService } from '../../_services/data.service';
import { ListService } from '../../_services/list.service';
import { ListHotel } from '../list-hotel';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent implements OnInit {
  form: any = {
    hotelName: null,
    hotelStar: 0,
    roomTotal: 0,
    location: null,
    picture: null,
  };

  isLoggedIn = false;

  hoteList$: Observable<ListHotel> = new Observable();
  // editUser: boolean = false;
  hotelId: number = 0;
  errorMessage = '';

  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private _router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private dataService: DataService,
    private listService: ListService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    this.dataService.variableChangedNumber$.subscribe((newValue: number) => {
      this.hotelId = newValue;
    });
    if (this.hotelId === 0) {
      // this.editUser = false;
      this._router.navigate(['/home']);
    } else if (this.hotelId >= 1) {
      // this.editUser = true;
      this.fetchList();
      this.hoteList$.subscribe((data) => {
        this.form.hotelName = data.hotelName;
        this.form.hotelStar = data.hotelStar;
        this.form.roomTotal = data.roomTotal;
        this.form.location = data.location;
      });
    }
  }

  private fetchList(): void {
    this.hoteList$ = this.listService.getHotelList(this.hotelId);
  }

  onSubmit(): void {
    const { hotelName, hotelStar, roomTotal, location } = this.form;

    // if (this.pictureForm.valid && this.selectedFile) {
    //   const formData = new FormData();
    //   formData.append('picture', this.selectedFile);

    //   // Replace with your backend API endpoint URL
    //   this.http.post('api/upload/picture', formData)
    //     .subscribe(response => {
    //       console.log('Upload successful!', response);
    //       // Handle successful upload (e.g., display success message)
    //     }, error => {
    //       console.error('Upload failed:', error);
    //       // Handle upload error (e.g., display error message)
    //     });
    // }

    this.listService
      .createHotelList({ hotelName, hotelStar, roomTotal, location })
      .subscribe({
        next: () => {
          this._router.navigate(['/list/users']);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        },
      });
  }

  onCancel(): void {
    this.hotelId = 0;
    this._router.navigate(['/list/users']);
  }

  onEditList() {
    const { hotelName, hotelStar, roomTotal, location } = this.form;

    this.listService
      .updateHotelList(this.hotelId, {
        hotelName,
        hotelStar,
        roomTotal,
        location,
      })
      .subscribe({
        next: () => {
          this._router.navigate(['/list/users']);
        },
        error: (error) => {
          alert('Failed to update user');
          console.error(error);
        },
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      // Validate file size and type (example)
      if (this.selectedFile.size > 1024 * 1024 * 5) {
        // Max 5MB
        alert('File size exceeds limit!');
        this.selectedFile = null;
      } else if (!this.selectedFile.type.match('image/')) {
        alert('Only image files are allowed!');
        this.selectedFile = null;
      }
    }
  }
}
