import { Component } from "@angular/core";
import { KpiCardComponent } from "./components/kpi-card/kpi-card.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [KpiCardComponent]
})
export class DashboardComponent {
}