import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TitleService } from '../../services/title.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
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
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects.startsWith('/dashboard')) {
          this.titleService.setTitle('Dashboard');
        } else if (event.urlAfterRedirects.startsWith('/stages')) {
          this.titleService.setTitle('Offres de stage');
        } else if (event.urlAfterRedirects.startsWith('/sujets-examen')) {
          this.titleService.setTitle("Sujets d'examen");
        } else if (event.urlAfterRedirects.startsWith('/messages')) {
          this.titleService.setTitle('Messages');
        } else if (event.urlAfterRedirects.startsWith('/profil')) {
          this.titleService.setTitle('Profil');
          this.currentTitle = 'Profil';
        } else {
          this.currentTitle = 'StageLink';
        }
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
