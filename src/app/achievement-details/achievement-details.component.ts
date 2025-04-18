import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';
import { AchievementService } from '../achievement.service';
import { environment } from '../environment';

@Component({
  selector: 'app-achievement-details',
  templateUrl: './achievement-details.component.html',
  styleUrls: ['./achievement-details.component.css']
})
export class AchievementDetailsComponent implements OnInit {
  achievement: any;

  getAchievementImageUrl(imagePath: string): string {
    return `${environment.apiBaseUrl}/uploads/images/achievements/${imagePath}`;
  }

  constructor(
    private route: ActivatedRoute,
    private achievementService: AchievementService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Achievement ID:', id);

    if (id) {
      this.achievementService.getAchievementById(id).subscribe({
        next: (res) => {
          if (res.body) {
            console.log('Achievement Data:', res.body);
            this.achievement = {
              ...res.body,
              createdAt: new Date(res.body.createdAt)
            };
          } else {
            console.warn(' No data in response (likely 304 Not Modified)');
          }
        },
        error: (err) => {
          console.error('Error fetching achievement details:', err);
        },
      });
    }
  }
}
