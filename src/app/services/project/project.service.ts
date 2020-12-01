import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../../classes/project';
import { IProject } from '../../interfaces/iproject';
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
      .collection<IProject>('projects')
      .get()
      .toPromise()
      .then((result) => {
        return result.docs.map((doc) => new Project(doc));
      });
  }

  public async getProject(id: string): Promise<Project> {
    return this.db
      .collection<IProject>('projects')
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
      images: []
    };

    await this.uploadFileToStorage(mainImage)
      .then(async (observable) => {
        const mainImage = await observable.toPromise();
        downloadUrls.mainImage = mainImage;
        return Promise.all(
          images.map((image) => this.uploadFileToStorage(image))
        );
      })
      .then(async (observables) => {
        const imagesUrls = await Promise.all(
          observables.map((obs) => obs.toPromise())
        );
        downloadUrls.images = imagesUrls;
      });
    console.log({ downloadUrls });
    return downloadUrls;
  }

  async uploadFileToStorage(file: File) {
    const { name } = file;
    const ref = this.storage.ref(name);
    await ref.put(file);
    return ref.getDownloadURL();
  }

  public async delete(project: Project) {
    await this.storage.refFromURL(project.mainImage).delete().toPromise();
    for (const image of project.images) {
      await this.storage.refFromURL(image).delete().toPromise();
    }
    await this.db.collection('projects').doc(project.id).delete();
    // return this.http.get(this.deleteUrl + id);
  }
}
