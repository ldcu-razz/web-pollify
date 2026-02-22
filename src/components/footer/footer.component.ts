import { Component, computed } from "@angular/core";
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  host: {
    class: 'mt-auto'
  }
})
export class FooterComponent {

  public yearToday = computed(() => new Date().getFullYear());
}