import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";

import { FormComponent } from "./form.component";

describe("FormComponent", () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    console.log(component)

    component.invoiceForm.patchValue({
      discount: 10,
      invoices: [{
        code: "CODE123",
        description: "Some test description",
        quantity: 3,
        price: 23.22,
        vatRate: 22
      }]
    });
  });

  it("should show length = 2 of the invoices array after added item", () => {
    component.addItem()
    expect(component.invoices.controls.length).toBe(2);
  });

  it("should show length = 0 of the invoices array after removed item", () => {
    component.removeInvoice(0)
    expect(component.invoices.controls.length).toBe(0);
  });

  it("should show the price whthout the VAT rate", () => {
    const net = component.calcNet(0)
    expect(net).toBe(57.1);
  });

  it("should round the cents in discount", () => {
    component.roundCents()
    expect(component.discount).toBe(10.66);
    expect(component.total).toBe(59);
  });
});
