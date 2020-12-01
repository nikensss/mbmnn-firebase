import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project/project.service';
import { Project } from 'src/app/classes/project';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public projects: Project[] = [];
  public error: string;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService
      .getProjects()
      .then((d: Project[]) => (this.projects = d))
      .catch((err) => (this.error = err.error));
  }
}
