import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { UpgradeModule } from '@angular/upgrade/static'

import { SignupServices } from './core/signup/signup.service'

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, UpgradeModule, HttpClientModule],
    providers: [SignupServices],
    bootstrap: [],
})
export class AppModule {
    constructor(private upgrade: UpgradeModule) {}
    ngDoBootstrap() {
        this.upgrade.bootstrap(document.documentElement, ['mainApp'])
    }
}
