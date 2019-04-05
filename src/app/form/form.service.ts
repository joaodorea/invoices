import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FormService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };
  response: Observable<Object> = new Observable();

  create(invoices): Observable<Object> {
    return this.http.post(
      "https://stamp-interview-apis.azurewebsites.net/api/invoices",
      invoices,
      this.httpOptions
    );
  }
}
