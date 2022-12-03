//@ts-nocheck
import * as angular from 'angular'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { downgradeInjectable } from '@angular/upgrade/static'

@Injectable()
export class SignupServices {
    constructor(private http: HttpClient) {}
    confirmAccount(confirmationObj): Observable<any[]> {
        return this.http.post('/api/confirmAccount', confirmationObj).toPromise()
    }
    userSignup(userObj): Observable<any[]> {
        return this.http.post('/api/userSignup', userObj).toPromise()
    }
    providerSignup(providerObj): Observable<any[]> {
        return this.http.post('/api/providerSignup', providerObj).toPromise()
    }
    getListCategories(): Observable<any[]> {
        return this.http.get('/api/categories/main_categories').toPromise()
    }
    getMyMedQuestInf0(): Observable<any[]> {
        return this.http.get('/api/dashboard/getMyMedQuestInfo').toPromise()
    }
    validateUserName(forgotObj): Observable<any[]> {
        return this.http.post('/api/providers/validateUserName', forgotObj).toPromise()
    }
    resetPasswordByUserName(forgotObj): Observable<any[]> {
        return this.http.post('/api/resetPassword', forgotObj).toPromise()
    }
    authenticateAccountPasswordReset(authObj): Observable<any[]> {
        return this.http.post('/api/authenticateAccountPasswordReset', authObj).toPromise()
    }
}

angular.module('core.signup', []).factory('SignupServices', downgradeInjectable(SignupServices))
