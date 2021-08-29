import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiHttpService {

  constructor(
    private http: HttpClient
  ) { }

  public jaum = {
    get: (args: { code: string }): Promise<any> => {
      const { code } = args;
      return new Promise((resolve, reject) => {
        this.http.get(
          'https://cq514y17s1.apigw.ntruss.com/getApi/hTest/GlidF3FHIb/json?code=' + code
        ).subscribe(response => {
          resolve(response);
        }, error => {
          reject(error);
        })
      });
    }
  }
}
