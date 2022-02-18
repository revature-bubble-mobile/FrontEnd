import { PostService } from 'app/services/post.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'app/services/profile.service';
import { Router } from '@angular/router';
import { faHome, faUserFriends, faUsers, faCog, faSignOutAlt, faCameraRetro, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faIdCard, faComments, faCalendar } from '@fortawesome/free-regular-svg-icons';
import { ImageService } from 'app/services/image.service';


@Component({
  selector: 'nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private profileService: ProfileService, private httpClient: HttpClient,
    private router: Router, private postService: PostService, private imageService: ImageService) { }

  // Profile Info
  id: number = 0;
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  updated: boolean = false;
  credential: string = "";
  key = "";
  session: any = {};
  url: any = this.session.imgurl ? this.session.imgurl : `../../../../assets/favicon.png`


  // Icons
  faHome = faHome;
  faIdCard = faIdCard;
  faUserFriends = faUserFriends;
  faUsers = faUsers;
  faComments = faComments;
  faCalendar = faCalendar;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faCameraRetro = faCameraRetro;
  faUserPlus = faUserPlus;

  // Links
  profileUrl = "/profileview/" + this.id

  fileToUpload?: File;

  ngOnInit(): void {

    let sessionProfile: any = sessionStorage.getItem("profile");

    this.session = JSON.parse(sessionProfile);
    this.id = this.session.pid;
    this.profileService.getProfileByPid(this.id).subscribe((e: any) => {
      this.url = e.imgurl ? e.imgurl : `../../../../assets/favicon.png`;
      this.profileService.getProfile().imgurl = e.imgurl;
    });

  }



  get profile() {
    let sessionProfile = sessionStorage.getItem("profile");
    if (sessionProfile != null) {
      return JSON.parse(sessionProfile);
    }
  }

  /*
  @autor update image team
  */
  onSelectFile(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.fileToUpload = event.target.files[0];
    }

    if (this.fileToUpload !== undefined) {
      this.imageService.upload(this.fileToUpload).subscribe(url => {
        this.profileService.setImhg(url)
        this.session.imgurl = url;
        this.url = url;

        this.profileService.updateProfile(this.session).subscribe(d => {
          this.session.imgURL = url;
          this.profileService.getProfile().imgurl = d.imgurl;
          this.url = url;
          window.location.reload();
        });
      });
    }
  }

  public delete() {
    this.url = null;
  }

  public logout() {

    sessionStorage.clear();
    this.router.navigate(["/login"]);
  }

  goToprofile() {
    this.router.navigate(["/profileview/", this.id]);
  }
}
