import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { SnackbarService } from '../models/snekbar.service';
import { Router } from '@angular/router';
export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('ACCESS_TOKEN') || '';
  const snakBar = inject(SnackbarService);
  const route = inject(Router)
  const updateReq = req.clone({
    headers: req.headers.append('Authorization',token ),
  })
  return next(updateReq).pipe(
    tap((event:any)=>{
      if (event instanceof HttpErrorResponse) {
        console.log(event);
        
        if (event.status === 403) {
          localStorage.getItem('ACCESS_TOKEN');
        }
      }
    },
    (err:any)=>{
      if(err instanceof HttpErrorResponse){
        snakBar.openErrorSnackBar(err.error.message);
        if(err.error.statusCode === 401 || err.error.statusCode === 403){
          localStorage.setItem('ACCESS_TOKEN','');
          localStorage.setItem("USER",'')
          route.createUrlTree(['/login']);
        }
      }
    })
  );
};
