import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FormService {
  statusUpdated = new EventEmitter();
  response: Observable<Object> = new Observable();
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  constructor(private http: HttpClient) {}

  create(invoices): Observable<Object> {
    return this.http.post(
      "https://stamp-interview-apis.azurewebsites.net/api/invoices",
      invoices,
      this.httpOptions
    );
  }
}
