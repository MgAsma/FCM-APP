import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BaseServiceService {
  file: boolean = false;
  
  constructor(private http: HttpClient) {}

  getData(params: any) {
    // const apiUrl = [environment.live_url, params].join('/').replace(/\/+/g, '/');
    return this.http.get(params);
  }
  getByID(params: any) {
    // const apiUrl = [environment.live_url, params].join('/').replace(/\/+/g, '/');
    return this.http.get(params);
  }
  postData(url: any, data: any) {
    // const apiUrl = [environment.live_url, url].join('/').replace(/\/+/g, '/');
    return this.http.post(url, data);
  }
  postFile(url: any, data: any) {
    this.file = true;
    // const apiUrl = [environment.live_url, url].join('/').replace(/\/+/g, '/');
    return this.http.post(url, data);
  }
  updateData(url: any, data: any) {
    // const apiUrl = [environment.live_url, url].join('/').replace(/\/+/g, '/');
    return this.http.put(url, data);
  }
  delete(id: any) {
    // const apiUrl = [environment.live_url, id].join('/').replace(/\/+/g, '/');
    return this.http.delete(id);
  }
}
