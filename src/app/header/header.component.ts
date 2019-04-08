import { Component } from "@angular/core";

import { FormService } from "../form/form.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
  invoiceResponse;

  constructor(private formService: FormService) {
    this.formService.statusUpdated.subscribe(status => {
      this.invoiceResponse = status;
    });
  }
}
