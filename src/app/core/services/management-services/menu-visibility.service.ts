import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MenuVisibilityConfig {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MenuVisibilityService {
  private menuVisibilitySubject = new BehaviorSubject<MenuVisibilityConfig>({});
  public menuVisibility$ = this.menuVisibilitySubject.asObservable();

  /**
   * Update visibility of menu items based on user permissions or other criteria
   * @param config Object with menu labels as keys and visibility as boolean values
   * 
   * Example:
   * menuVisibilityService.updateMenuVisibility({
   *   'Offers': true,
   *   'Chat': true,
   *   'Admin': false
   * });
   */
  updateMenuVisibility(config: MenuVisibilityConfig) {
    this.menuVisibilitySubject.next(config);
  }

  /**
   * Update a single menu item visibility
   * @param menuLabel Label of the menu item
   * @param isVisible Visibility flag
   */
  setMenuItemVisibility(menuLabel: string, isVisible: boolean) {
    const current = this.menuVisibilitySubject.value;
    this.menuVisibilitySubject.next({
      ...current,
      [menuLabel]: isVisible
    });
  }

  /**
   * Get current visibility configuration
   */
  getCurrentVisibility(): MenuVisibilityConfig {
    return this.menuVisibilitySubject.value;
  }
}
