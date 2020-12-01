import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project/project.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {
  private _texts: FormArray;
  private _images: FormArray;
  private _projectForm: FormGroup;
  private _mainImage: File;
  private _sideImages: File[] = [];

  public submitText: string = 'Submit';
  public disabled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private location: Location,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
  }

  get projectForm(): FormGroup {
    return this._projectForm;
  }

  private createForm(): void {
    this._projectForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      mainImage: [null, [Validators.required]],
      texts: this.fb.array([this.createText('')]),
      images: this.fb.array([this.createImage()])
    });

    this._texts = this.texts;
    this._images = this.images;
  }

  get mainImage() {
    return this._mainImage;
  }

  set mainImage(f: File) {
    this._mainImage = f;
  }

  get sideImages() {
    return this._sideImages;
  }

  set sideImages(files: File[]) {
    this._sideImages = files;
  }

  get texts(): FormArray {
    return this.projectForm.get('texts') as FormArray;
  }

  get images(): FormArray {
    return this.projectForm.get('images') as FormArray;
  }

  public addImage(): void {
    this._images.push(this.createImage());
  }

  public createImage(): FormGroup {
    return this.fb.group({
      image: [null, [Validators.required]]
    });
  }

  public deleteImage(index: number): void {
    this.delete('images', index);
    this.sideImages.splice(index, 1);
  }

  public addText(): void {
    this._texts.push(this.createText(''));
  }

  public createText(text: String): FormGroup {
    return this.fb.group({
      text: [text, [Validators.required]]
    });
  }

  public deleteText(index: number): void {
    this.delete('texts', index);
  }

  private delete(controlName: string, index: number): void {
    (this._projectForm.controls[controlName] as FormArray).removeAt(index);
  }

  public onFileSelected(event: any) {
    if (event.target.dataset.formcontrolname === 'mainImage') {
      this.mainImage = event.target.files[0];
    } else {
      this.sideImages.push(event.target.files[0]);
    }
  }

  async submit(): Promise<void> {
    this.disabled = true;
    this.submitText = 'Submitting';

    const formData = new FormData();
    formData.append('title', this.projectForm.get('title').value);
    formData.append('description', this.projectForm.get('description').value);
    formData.append('mainImage', this.mainImage, this.mainImage.name);

    for (let text of this.projectForm.get('texts').value) {
      formData.append('texts', text.text);
    }

    for (let image of this.sideImages) {
      formData.append('images', image, image.name);
    }

    (await this.projectService.postNewProject(formData)).subscribe(
      (res: any) => {
        console.log(res);
        this.submitText = 'Done!';
        if (res.body.id) this.router.navigate([`/projects/${res.body.id}`]);
      }
    );
  }
}
