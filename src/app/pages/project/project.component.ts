import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectService } from 'src/app/services/project/project.service';
import { Project } from 'src/app/classes/project';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  public project: Project;
  public id: string;
  private subscriptions: Subscription[] = [];
  public error: string;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.paramMap.subscribe((p) => {
        this.id = p.get('id');
        this.projectService
          .getProject(this.id)
          .then((p) => (this.project = p))
          .catch((err) => {
            console.log(err);
            this.error = err.error;
          });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  delete(): void {
    this.projectService.delete(this.project.uid).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/']);
    });
  }
}
