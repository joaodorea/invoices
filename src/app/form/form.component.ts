import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validators } from "@angular/forms";

import { FormService } from "./form.service";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit {
  invoiceForm: FormGroup;
  responseStatus;

  get invoices(): FormArray {
    return <FormArray>this.invoiceForm.get("invoices");
  }
  get subTotal(): number {
    let total = 0;
    this.invoices.controls.map(item => {
      const { quantity, price } = item.value;
      total += quantity * price;
    });
    return +total.toFixed(2);
  }
  get total(): number {
    const total: number = this.subTotal - this.discount;
    const formated: number = +total.toFixed(2);
    return formated;
  }
  get discount(): number {
    return this.invoiceForm.get("discount").value;
  }
  get request() {
    const discount: number = this.discount;
    let items: Object[] = [];
    this.invoices.controls.map(item => {
      items.push({
        code: item.get("code").value,
        description: item.get("description").value,
        quantity: item.get("quantity").value,
        unitPriceWithVat: item.get("price").value,
        vatRate: item.get("vatRate").value
      });
    });
    return {
      discount,
      items
    };
  }
  set discount(value) {
    this.invoiceForm.get("discount").patchValue(value);
  }

  calcNet(i: number): number {
    const { vatRate, price, quantity } = this.invoices.value[i];
    const originalPrice = +price / ((100 + +vatRate) / 100);
    const totalNet = +originalPrice * +quantity;
    return +totalNet.toFixed(2);
  }
  buildInvoices(): FormGroup {
    return this.fb.group({
      code: [{ value: "", disabled: this.responseStatus }, Validators.required],
      description: [
        { value: "", disabled: this.responseStatus },
        [Validators.required, Validators.minLength(5)]
      ],
      quantity: [
        { value: "", disabled: this.responseStatus },
        [Validators.min(1)]
      ],
      price: [
        { value: "", disabled: this.responseStatus },
        Validators.required
      ],
      vatRate: 22
    });
  }

  save(): void {
    if (this.invoiceForm.valid) {
      this.service.create(this.request).subscribe(resp => {
        if (resp["invoiceNumber"]) {
          this.responseStatus = true;
          this.service.statusUpdated.emit(resp);
        } else {
          alert(resp["message"]);
        }
      });
    }
  }
  addItem(): void {
    this.invoices.push(this.buildInvoices());
  }
  removeInvoice(index): void {
    this.invoices.removeAt(index);
  }
  roundCents(): void {
    function returnCents(n): number {
      const cents: number = n - Math.trunc(n);
      const twoDigits: number = +cents.toFixed(2);
      return twoDigits;
    }

    const subCents: number = returnCents(this.subTotal);
    const intDiscount: number = Math.trunc(this.discount);
    const centsRounded: number = intDiscount + subCents;
    this.discount = centsRounded;
  }

  constructor(private fb: FormBuilder, private service: FormService) {}
  ngOnInit() {
    this.invoiceForm = this.fb.group({
      invoices: this.fb.array([this.buildInvoices()]),
      discount: ""
    });
  }
}
