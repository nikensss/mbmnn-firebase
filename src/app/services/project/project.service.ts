import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../../classes/project';
import { IProject } from '../../interfaces/iproject';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly baseUrl: string = `${environment.mbmnnApi}/api/`;
  private readonly projectsUrl: string = this.baseUrl + 'projects/';
  private readonly allProjects: string = this.projectsUrl + 'all';
  private readonly postNewProjectUrl: string = this.projectsUrl + 'new';
  private readonly deleteUrl: string = this.projectsUrl + 'delete/';

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
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
    // return this.http
    //   .get(this.projectsUrl + id)
    //   .toPromise()
    //   .then((data: IProject) => new Project(data));
  }

  async postNewProject(form: FormData) {
    if ((await this.afAuth.currentUser) === null) {
      throw new Error('Unauthenticated user!');
    }

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Authorization', `Bearer ${1234}`);

    return this.http.post(this.postNewProjectUrl, form, {
      headers,
      observe: 'response'
    });
  }

  public delete(id: string) {
    return this.http.get(this.deleteUrl + id);
  }
}
