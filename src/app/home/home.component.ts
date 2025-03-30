import { Component, OnInit } from '@angular/core';
import { AchievementService } from '../achievement.service'; // Adjust path as needed
import { environment } from '../environment';

// Define the Achievement interface (can move to a separate file)
interface Achievement {
  id: number;
  createdAt: string; // Adjust based on your backend response
  [key: string]: any; // Add other properties as needed
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  achievements: Achievement[] = [];

  constructor(private achievementService: AchievementService) {}

  ngOnInit() {
    this.loadAchievements();
  }

  loadAchievements() {
    this.achievementService.getAllAchievements().subscribe({
      next: (data: Achievement[]) => {
        this.achievements = data
          .map((achievement: Achievement) => ({
            ...achievement,
            createdAt: new Date(achievement.createdAt)
          }))
          .sort((a: Achievement, b: Achievement) => b.id - a.id);
        console.log('Achievements loaded:', this.achievements);
      },
      error: (error: any) => { // You can refine this type if needed (e.g., HttpErrorResponse)
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
