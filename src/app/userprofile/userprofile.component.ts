import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  userObj;
  constructor() { }

  ngOnInit(): void {
    //get user object from local storage
    this.userObj=JSON.parse(localStorage.getItem("userObj"))
  }

}
