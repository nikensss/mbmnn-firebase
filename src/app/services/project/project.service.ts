import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../../classes/project';
import BaseProject from '../../interfaces/BaseProject.interface';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import NewProject from 'src/app/interfaces/NewProject.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly baseUrl: string = `${environment.mbmnnApi}/api/`;
  private readonly projectsUrl: string = this.baseUrl + 'projects/';
  private readonly deleteUrl: string = this.projectsUrl + 'delete/';

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  public async getProjects(): Promise<Project[]> {
    return this.db
      .collection<BaseProject>('projects')
      .get()
      .toPromise()
      .then((result) => {
        return result.docs.map((doc) => new Project(doc));
      });
  }

  public async getProject(id: string): Promise<Project> {
    return this.db
      .collection<BaseProject>('projects')
      .doc(id)
      .get()
      .toPromise()
      .then((result) => new Project(result));
  }

  async postNewProject(newProject: NewProject) {
    if ((await this.afAuth.currentUser) === null) {
      throw new Error('Unauthenticated user!');
    }

    console.log({ newProject });
    const downloadUrls = await this.uploadFilesToStorage(
      newProject.mainImage,
      newProject.images
    );

    const docRef = await this.db.collection('projects').add({
      title: newProject.title,
      description: newProject.description,
      texts: newProject.texts,
      mainImage: downloadUrls.mainImage,
      images: downloadUrls.images
    });

    return docRef.id;
  }

  async uploadFilesToStorage(mainImage: File, images: File[]) {
    const downloadUrls = {
      mainImage: '',
      images: [] as string[]
    };

    downloadUrls.mainImage = await this.uploadFileToStorage(mainImage);
    downloadUrls.images = (await Promise.all(
      images.map(this.uploadFileToStorage.bind(this))
    )) as string[];

    console.log({ downloadUrls });
    return downloadUrls;
  }

  async uploadFileToStorage(file: File): Promise<string> {
    const { name } = file;
    console.log({ name });

    const ref = this.storage.ref(name);
    await ref.put(file);
    return ref.getDownloadURL().toPromise();
  }

  public async delete(project: Project) {
    await this.storage.refFromURL(project.mainImage).delete().toPromise();
    for (const image of project.images) {
      await this.storage.refFromURL(image).delete().toPromise();
    }
    await this.db.collection('projects').doc(project.id).delete();
  }
}
