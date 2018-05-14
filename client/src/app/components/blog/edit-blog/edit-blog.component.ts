import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  message;
  messageClass;
  processing = false;
  blog;
  currentUrl;
  loading = true;

  constructor( 
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService, 
    private router: Router
  ) { }

  updateBlogSubmit() {
    // submit update form
    this.processing = true;
    this.blogService.editBlog(this.blog).subscribe(data => {
      if(!data.success) {
        this.processing = false;
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['blog']);
        }, 2000)
      }
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      console.log(data);
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = 'Blog not found.';
      } else {
        this.blog = data.blog;
        this.loading = false;
      }
    });
  }

}
