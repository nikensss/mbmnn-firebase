import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../../classes/project';
import { IProject } from '../../interfaces/iproject';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly baseUrl: string = `${environment.mbmnnApi}/api/`;
  private readonly projectsUrl: string = this.baseUrl + 'projects/';
  private readonly allProjects: string = this.projectsUrl + 'all';
  private readonly postNewProjectUrl: string = this.projectsUrl + 'new';
  private readonly deleteUrl: string = this.projectsUrl + 'delete/';

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {}

  public async getProjects(): Promise<Project[]> {
    return this.http
      .get(this.allProjects)
      .toPromise()
      .then((data: IProject[]) => data.map((d) => new Project(d)));
  }

  public async getProject(id: string): Promise<Project> {
    return this.http
      .get(this.projectsUrl + id)
      .toPromise()
      .then((data: IProject) => new Project(data));
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
