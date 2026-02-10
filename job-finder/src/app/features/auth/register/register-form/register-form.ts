import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.html',
})
export class RegisterForm {
  @Output() formSubmit = new EventEmitter<any>()

  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.formSubmit.emit(this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  hasError(controlName: string, errorName: string) {
    const control = this.registerForm.get(controlName);
    return control?.touched && control?.hasError(errorName);
  }

}
