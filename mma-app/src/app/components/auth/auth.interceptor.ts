// Inteceptors are functions that run for any http requests
// Works like a middleware for outgoing requests
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

// Requirement by angular to put a injectable tag
@Injectable()

export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService: AuthService) {
        
    }
    intercept(req: HttpRequest<any>, next: HttpHandler){
        const authToken = this.authService.getToken();

        // Need to clone outgoing requests and not edit them outright because how it functions in the back
        const authRequest = req.clone({
            /** 
             * set() adds a new header to headers unless the headers have the same name, it will over write it
             * Use Bearer and white space because its the convention, we also parse the string after the white space in the back end
             * Making sure the user is Authorized for each request
             * */
            headers: req.headers.set('Authorization',"Bearer " + authToken)
        });

        return next.handle(authRequest);
    }
    
}