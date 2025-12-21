import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: ` <footer class="footer">
    <a href="https://www.linkedin.com/in/william-nogueira-dev/" target="_blank">{{
      'FOOTER.COPYRIGHT' | translate
    }}</a>
  </footer>`,
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {}
