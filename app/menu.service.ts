import { Injectable } from '@angular/core';
import { menus } from './menus.ts';



@Injectable()
export class MenuService {
    // getMenus(){
    //     return Promise.resolve(menus)
    // }
    menus = menus;
}