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
    return this.http.get(`${environment.live_url}/${params}`)
  }
  getByID(params:any){
    return this.http.get(`${environment.live_url}/${params}`)
  }
  postData(url:any,data:any){
    return this.http.post(`${environment.live_url}/${url}`,data)
  }
  postFile(url:any,data:any){
    this.file = true
    return this.http.post(`${environment.live_url}/${url}`,data)
  }
  updateData(url:any,data:any){
    return this.http.put(`${environment.live_url}/${url}`,data)
  }
  delete(id:any){
    return this.http.delete(`${environment.live_url}/${id}`)
  }
}
