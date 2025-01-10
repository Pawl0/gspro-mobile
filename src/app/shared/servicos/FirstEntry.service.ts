import { Injectable } from "@angular/core";
import { Database } from "src/app/shared/providers/database";

@Injectable({
  providedIn: "root"
})
export class FirstEntryService {

  constructor(private db: Database) { }

  async getFirstEntry() {
    let row = await this.db.getAll("first_entry");
    return row;
  }
  async updateData() {

  }
}
