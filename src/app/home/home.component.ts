import { Component, OnInit } from '@angular/core';
import { AchievementService } from '../achievement.service'; // Adjust path
import { environment } from '../environment';

// Define the Achievement interface with explicit properties
interface Achievement {
  id: number;
  createdAt: string | Date; // Allow both string (from backend) and Date (after transformation)
  imagePaths?: string[]; // Optional array of image paths
  name?: string; // Optional name
  title?: string; // Optional title
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
        this.achievements = data.map((achievement: Achievement) => ({
          ...achievement,
          createdAt: new Date(achievement.createdAt) // Transform string to Date
        })).sort((a: Achievement, b: Achievement) => b.id - a.id);
        console.log('Achievements loaded:', this.achievements);
      },
      error: (error: any) => {
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
