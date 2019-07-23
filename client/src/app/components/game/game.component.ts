import { Component, OnInit, ElementRef } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  constructor(private gameService: GameService, private element: ElementRef) { }

  question; trivia: any;
  currentQuestion: number = 0;
  rightAnsCounter: number = 0;
  answers: string[] = [];
  selected; gameOver; submitted: boolean = false;
  // shuffle shuffles the answers array before rendering it.
  shuffle: Function = (a: string[]) => {
    for (let i: number = a.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  //
// markSelectionHandler triggred after user clicked one out of four answers
  markSelectionHandler(e) {
    if (!this.selected) {  //selected = false: first time selecting in this card.
      e.target.className = "selected";
      this.selected = true;
      this.element.nativeElement.querySelector('.btn-disabled').className = "btn";
    }
    else { //user has changed his previous selection, selected = true
      this.element.nativeElement.querySelector('.selected').className = "answer";
      e.target.className = "selected";
    }
  }
  // submitHandler has two functions: 1.checking current selection 2. continuing to next question
  submitHandler(e) {
    if (!this.submitted) { //user clicked btn after selecting answer. (first functionality)
      if (this.element.nativeElement.querySelector('.selected')
      .innerText === this.question.correct_answer) { //answer is correct
        //showing selected answer as right (green)
        this.element.nativeElement.querySelector('.selected').children[0].children[0].src = "../../../assets/Group.png";
        this.element.nativeElement.querySelector('.selected').style.borderColor = "green";
        this.element.nativeElement.querySelector('.selected').style.color = "green";
        this.rightAnsCounter++;
      } else { //showing selected answer as wrong
          this.element.nativeElement.querySelector('.selected').children[0].children[0].src = "../../../assets/Group3.png";
          this.element.nativeElement.querySelector('.selected').style.borderColor = "red";
          this.element.nativeElement.querySelector('.selected').style.color = "red";
      }
      //eliminating the possibility to choose another answer after clicking OK
      this.element.nativeElement.querySelectorAll('.answer').forEach(element => {
        element.style.pointerEvents = "none";
      });
      e.target.innerText = "Continue";
      this.submitted = true;
    } else if (this.currentQuestion < this.trivia.length - 1) { //second functionality, Continue btn. User has already recieved a feedback
        this.currentQuestion++;
        this.question = this.trivia[this.currentQuestion];
        this.answers = this.trivia[this.currentQuestion].incorrect_answers;
        this.answers.push(this.trivia[this.currentQuestion].correct_answer);
        this.shuffle(this.answers);
        this.submitted = false;
        this.selected = false;
        this.element.nativeElement.querySelector('.btn').className = "btn-disabled";
        this.element.nativeElement.querySelectorAll('.answer').forEach(element => {
          element.style.pointerEvents = "auto";
      });
    } else {
      this.gameOver = true;
    }
  }

  replayHandler() {
    this.selected = false;
    this.currentQuestion = 0;
    this.rightAnsCounter = 0;
    this.gameOver = false;
    this.submitted = false;
    this.ngOnInit();
  }
  ngOnInit() {
    this.gameService.getData().subscribe(data => {
      this.trivia = data;
      console.log(this.trivia);
      console.log(data[0]);
      console.log(this.currentQuestion);
      this.question = data[this.currentQuestion];
      this.answers = data[this.currentQuestion].incorrect_answers;
      this.answers.push(data[this.currentQuestion].correct_answer);
      this.shuffle(this.answers);

    })
  }
}

