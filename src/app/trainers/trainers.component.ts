import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../trainer.service';
import { environment } from '../environment';
@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css']
})
export class TrainersComponent implements OnInit {
  trainers: any[] = [];

  constructor(private trainerService: TrainerService) {}

  ngOnInit(): void {
    this.loadTrainers();
  }

  loadTrainers(): void {
    this.trainerService.getTrainers().subscribe({
      next: (data) => {
        this.trainers = data;
      },
      error: (error) => {
        console.error('Error fetching trainers:', error);
      },
    });
  }

   getImagePath(imagePath: string): string {
    return imagePath
      ? `${environment.apiBaseUrl}/uploads/images/trainers/${imagePath}`
      : '/assets/images/default-trainer.png';
  }

}
