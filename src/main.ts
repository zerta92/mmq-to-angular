// https://medium.com/@elenaorfe/migrate-angularjs-to-angular-through-angular-cli-hybrid-application-8790b272a1d7
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import * as angular from 'angular'
import { WebsiteModule } from './app/app.module'
//@ts-ignore
import ajsApp from './app/app.module.ajs'

//@ts-ignore
import states from './app/app.config.ajs'

states(ajsApp)
import { setAngularJSGlobal } from '@angular/upgrade/static'
setAngularJSGlobal(angular)

platformBrowserDynamic()
    .bootstrapModule(WebsiteModule)
    .catch(err => console.error(err))
