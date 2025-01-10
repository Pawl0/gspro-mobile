import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CompararArrayService {
  constructor() {}

  compararItensBoolean(a: any, b: any) {
    // const isEqual = function(a: any, b) {
    // Get the value type
    const type = Object.prototype.toString.call(a);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(b)) {
      return false;
    }

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
      return false;
    }

    // Compare the length of the length of the two items
    const aLen = type === '[object Array]' ? a.length : Object.keys(a).length;

    const bLen = type === '[object Array]' ? b.length : Object.keys(b).length;
    if (aLen !== bLen) {
      return false;
    }

    // Compare properties
    if (type === '[object Array]') {
      for (let i = 0; i < aLen; i++) {
        if (this.teste1(a[i], b[i]) === false) {
          return false;
        }
      }
    } else {
      for (const key in a) {
        if (a.hasOwnProperty(key)) {
          if (this.teste1(a[key], b[key]) === false) {
            return false;
          }
        }
      }
    }

    // If nothing failed, return true
    return true;
    // };
  }

  // @ts-ignore
  teste1(a: any, b: any) {
    // Get the object type
    const itemType = Object.prototype.toString.call(a);

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!this.compararItensBoolean(a, b)) {
        return false;
      }
    } else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(b)) {
        return false;
      }

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (a.toString() !== b.toString()) {
          return false;
        }
      } else {
        if (a !== b) {
          return false;
        }
      }
    }
  }
}
