import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import BaseProject from '../interfaces/BaseProject.interface';

export class Project implements BaseProject {
  public uid: string;
  public title: string;
  public description: string;
  public texts: string[];
  public images: string[];
  public mainImage: string;

  constructor(doc: QueryDocumentSnapshot<BaseProject>) {
    const { title, description, texts, mainImage, images } = doc.data();
    this.uid = doc.id;
    this.title = title;
    this.description = description;
    this.texts = texts;
    this.mainImage = mainImage;
    this.images = images;
  }

  public get id(): string {
    return this.uid;
  }
}
