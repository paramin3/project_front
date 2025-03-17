import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';
import { AchievementService } from '../achievement.service';

@Component({
  selector: 'app-achievement-details',
  templateUrl: './achievement-details.component.html',
  styleUrls: ['./achievement-details.component.css']
})
export class AchievementDetailsComponent implements OnInit {
  achievement: any;

  constructor(
    private route: ActivatedRoute,
    private achievementService: AchievementService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Achievement ID:', id); // ตรวจสอบ ID

    if (id) {
      this.achievementService.getAchievementById(id).subscribe({
        next: (data) => {
          console.log('Achievement Data:', data); // ตรวจสอบข้อมูล
          this.achievement = {
            ...data,
            createdAt: new Date(data.createdAt) // แปลง createdAt เป็น Date object
          };
        },
        error: (err) => {
          console.error('Error fetching achievement details:', err);
        },
      });
    }
  }
}
