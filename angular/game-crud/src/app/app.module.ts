import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AvailableGamesComponent } from './available-games/available-games.component';
import { CrudComponent } from './crud/crud.component';
import { UserComponent } from './user/user.component';

const appRoutes: Routes = [
  { path: ':id',      component: UserComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AvailableGamesComponent,
    CrudComponent,
    UserComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
