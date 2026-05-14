import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { RouterOutlet } from "@angular/router";
import { TopbarComponent } from '../../topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet,SidebarComponent, TopbarComponent, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {

}
