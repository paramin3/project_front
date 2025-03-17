import { Component, OnInit } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  achievements: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAchievements();
  }

  loadAchievements() {
    this.http.get<any[]>('/api/achievements').subscribe({
      next: (data) => {
        // แปลง createdAt เป็น Date Object และเรียงลำดับ ID จากมากไปน้อย
        this.achievements = data
          .map(achievement => ({
            ...achievement,
            createdAt: new Date(achievement.createdAt) // แปลงเป็น Date Object
          }))
          .sort((a, b) => b.id - a.id);
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
    return `/uploads/images/achievements/${imagePath}`;
  }
}
