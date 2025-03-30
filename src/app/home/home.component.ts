import { Component, OnInit } from '@angular/core';
import { AchievementService } from '../achievement.service'; // Adjust path
import { environment } from '../environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  achievements: any[] = [];

  constructor(private achievementService: AchievementService) {}

  ngOnInit() {
    this.loadAchievements();
  }

  loadAchievements() {
    this.achievementService.getAllAchievements().subscribe({
      next: (data) => {
        this.achievements = data
          .map(achievement => ({
            ...achievement,
            createdAt: new Date(achievement.createdAt)
          }))
          .sort((a, b) => b.id - a.id);
        console.log('Achievements loaded:', this.achievements);
      },
      error: (error) => {
        console.error('Error loading achievements:', error);
      },
      complete: () => {
        console.log('Achievements loaded successfully.');
      }
    });
  }

  getImagePath(imagePath: string): string {
    return `${environment.apiBaseUrl}/uploads/images/achievements/${imagePath}`;
  }
}
