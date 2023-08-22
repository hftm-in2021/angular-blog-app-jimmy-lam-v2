import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

type InvalidFormGroup = {
  title: FormControl<string | null>;
  content: FormControl<string | null>;
};
@Component({
  selector: 'app-add-blog-page',
  templateUrl: './add-blog-page.component.html',
  styleUrls: ['./add-blog-page.component.scss'],
})
export class AddBlogPageComponent implements OnInit {
  form!: FormGroup<InvalidFormGroup>;

  ngOnInit(): void {
    this.form = new FormGroup<InvalidFormGroup>({
      title: new FormControl<string | null>('an existing title', [
        Validators.required,
        Validators.pattern('^[A-Z]+(.)*'),
      ]),
      content: new FormControl<string | null>(null),
    });
  }

  onSubmit() {
    console.log(this.form);
  }
}
