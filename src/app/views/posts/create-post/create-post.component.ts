import { FilterService } from './../../../services/filter.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from 'app/models/post';
import { Profile } from 'app/models/profile';
import { PostService } from 'app/services/post.service';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { ImageService } from 'app/services/image.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  profile: Profile = {};
  addPost: Post = {
    creator: {
      pid: this.profile.pid,
      username: this.profile.username,
      passkey: '',
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      email: this.profile.email
    },
    body: '',
    datePosted: new Date(),
    imgURL: '',
  };
  faImage = faImage;
  faCheckCircle = faCheckCircle;
  uploadDesired = false;

  fileToUpload?: File;

  @Input() show: boolean = false;

  constructor(
    public postService: PostService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private filterService: FilterService,
    private imageService: ImageService
    //public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    var sessionProfile = sessionStorage.getItem("profile");
    if (sessionProfile != null) {
      this.profile = JSON.parse(sessionProfile);
    }
  }

  ngOnDestroy(): void {
    window.location.href = '/home';
  }

  createPost() {
    if (this.addPost.body !== '') {
      if (this.fileToUpload !== undefined) {
        this.imageService.upload(this.fileToUpload).subscribe(url => {
          this.addPost.imgURL = url;

          //filter body for profanity
          this.addPost.body = this.filterService.filterProfanity(this.addPost.body);
          this.postService.createPost(this.addPost);
        });
      } else {
        this.addPost.body = this.filterService.filterProfanity(this.addPost.body);
        this.postService.createPost(this.addPost);
      }
    } else {
      this.show = true;
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.fileToUpload = event.target.files[0];
    }
    this.uploadDesired = true;
  }
}
