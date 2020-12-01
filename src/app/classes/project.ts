import { IProject } from '../interfaces/iproject';

export class Project implements IProject {
  public _id: string;
  public title: string;
  public description: string;
  public texts: string[];
  public images: any;
  public mainImage: any;

  constructor({ _id, title, description, texts, mainImage, images }) {
    this._id = _id;
    this.title = title;
    this.description = description;
    this.texts = texts;
    this.mainImage = this.bufferToImage(mainImage.data.data);
    this.images = images.map(i => this.bufferToImage(i.data.data));
  }

  private bufferToImage(d: any): string {
    return (
      'data:image/jpg;base64,' +
      btoa(
        new Uint8Array(d).reduce(function (data, byte) {
          return data + String.fromCharCode(byte);
        }, '')
      )
    );
  }

  public get id(): string {
    return this._id;
  }
}
