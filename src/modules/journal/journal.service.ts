import { Service } from "../../common/service.common";
import { IModel } from "../../common/mongoose-schema.common";
import { IJournalDoc } from "./journal.interface";
import { Journal } from "./journal.model";

export class JournalService extends Service<IJournalDoc> {
  constructor(Model: IModel<IJournalDoc>) {
    super(Model);
  }

  // create extra service here if needed..
}

export const journalService = new JournalService(Journal);

