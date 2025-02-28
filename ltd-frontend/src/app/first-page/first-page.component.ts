import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-first-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './first-page.component.html',
  styleUrl: './first-page.component.scss'
})
export class FirstPageComponent implements OnInit {
  passedExams = 0;
  instructors = 0;
  users = 0;
  
  features = [
    { icon: 'fas fa-book-open', title: 'Lorem Ipsum' },
    { icon: 'fas fa-car', title: 'Dolor Sit' },
    { icon: 'fas fa-chart-line', title: 'Amet Consectetur' }
  ];

  reviews = [
    { author: 'John Doe', rating: 5 },
    { author: 'Jane Smith', rating: 4 },
    { author: 'Mike Johnson', rating: 5 }
  ];

  ngOnInit() {
    this.animateNumbers();
  }

  animateNumbers() {
    const animate = (finalValue: number, property: 'passedExams' | 'instructors' | 'users') => {
      let current = 0;
      const increment = finalValue / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
          clearInterval(timer);
          current = finalValue;
        }
        this[property] = Math.floor(current);
      }, 20);
    };

    animate(12500, 'passedExams');
    animate(230, 'instructors');
    animate(45800, 'users');
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}
