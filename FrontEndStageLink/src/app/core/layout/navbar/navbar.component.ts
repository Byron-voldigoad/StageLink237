import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TitleService } from '../../services/title.service';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentTitle = 'StageLink';

  constructor(
    private router: Router,
    private titleService: TitleService,
    public themeService: ThemeService
  ) {
    // Initialisation du titre
    const initialTitle = this.titleService.getRouteTitle(this.router.url);
    this.titleService.setTitle(initialTitle);
    this.currentTitle = initialTitle;

    // Souscription aux changements de titre
    this.titleService.title$.subscribe(title => {
      this.currentTitle = title;
    });

    // Gestion des changements d'URL
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const title = this.titleService.getRouteTitle(event.urlAfterRedirects);
        this.titleService.setTitle(title);
      }
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  ngOnInit(): void {
    // Initialisation si besoin
  }
}
