import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  UntypedFormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { BlogStateService } from './state/blog-state.service';

type InvalidFormGroup = {
  title: FormControl<string | null>;
  content: FormControl<string | null>;
};

type CreatedBlog = {
  title: string;
  content: string;
};

@Component({
  selector: 'app-add-blog-page',
  templateUrl: './add-blog-page.component.html',
  styleUrls: ['./add-blog-page.component.scss'],
})
export class AddBlogPageComponent implements OnInit {
  form!: FormGroup<InvalidFormGroup>;
  valueChanges$!: Observable<
    Partial<{ title: string | null; content: string | null }>
  >;

  constructor(public blogStateService: BlogStateService) {}

  ngOnInit(): void {
    this.form = new FormGroup<InvalidFormGroup>({
      title: new FormControl<string | null>(
        'an existing title',
        [
          Validators.required,
          Validators.pattern('^[A-Z]+(.)*'),
          customValidator,
        ],
        this.customAsyncValidator
      ),
      content: new FormControl<string | null>(null, Validators.required),
    });

    this.valueChanges$ = this.form.valueChanges;
  }

  customAsyncValidator(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (control.value === 'Test Async') {
          resolve({ customAsync: true });
        }
        resolve(null);
      }, 1000);
    });
  }

  onSubmit() {
    console.log(this.form);

    if (this.form.valid) {
      this.blogStateService.addBlog(this.form.value as CreatedBlog);
    }
  }
}

const customValidator = (
  control: UntypedFormControl
): ValidationErrors | null => {
  if (control.value === 'Test') {
    return { custom: true }; //Fehler
  }
  return null;
};
