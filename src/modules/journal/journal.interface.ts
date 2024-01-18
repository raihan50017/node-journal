import { Types } from "mongoose";
import { ICommon } from "../../common/interface.common";
import { IUser } from "../users/user.interface";

interface IJournal {
  title: string;
  slug: string;
  about: string;
  e_issn: string;
  p_issn: string;
  frequency: string;
  publication_frequency: number;
  metrics: {
    impact_factor: number;
    site_score: number;
  };
  featured_articles: object[];
  highly_accessed: object[];
  announcements: object[];
  chief_editor: Types.ObjectId;
  associate_editors: Types.ObjectId[];
  current_issues: object[];
  contact: object;
  image: string;
}

interface IJournalDoc extends IJournal, ICommon {}

export { IJournal, IJournalDoc };
