import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseServiceService {
  file: boolean = false;
  constructor(private http:HttpClient){}
  getData(params:any){
    const apiUrl = [environment.live_url, params].join('/').replace(/\/+/g, '/');
    return this.http.get(apiUrl)
  }
  getByID(params:any){
    const apiUrl = [environment.live_url, params].join('/').replace(/\/+/g, '/');
    return this.http.get(apiUrl)
  }
  postData(url:any,data:any){
    const apiUrl = [environment.live_url, url].join('/').replace(/\/+/g, '/');
    return this.http.post(apiUrl, data);
  }
  postFile(url:any,data:any){
    this.file = true
    const apiUrl = [environment.live_url, url].join('/').replace(/\/+/g, '/');
    return this.http.post(apiUrl, data);
  }
  updateData(url:any,data:any){
    const apiUrl = [environment.live_url, url].join('/').replace(/\/+/g, '/');
    return this.http.put(apiUrl,data)
  }
  delete(id:any){
    const apiUrl = [environment.live_url, id].join('/').replace(/\/+/g, '/');
    return this.http.delete(apiUrl);
  }
}
